// HTTP application: API + static site. Pure Node, no framework.
// createApp() takes its collaborators as arguments so tests can inject fakes.
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import crypto from 'node:crypto'
import { CATALOG } from '../shared/catalog.js'
import { verifyPaymentSignature, verifyWebhookSignature } from './lib/razorpay.js'
import { validateBuyer, validateContact, validateEmail, clean } from './lib/validate.js'
import { createRateLimiter } from './lib/ratelimit.js'

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2', '.xml': 'application/xml',
}
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt', '.xml'])

export function createApp({ env, razorpay, store, mailer, distDir, publicDir }) {
  const keySecret = env.RAZORPAY_KEY_SECRET
  const isProd = env.NODE_ENV === 'production'
  const allowedOrigin = env.CLIENT_ORIGIN || ''
  const limit = {
    order: createRateLimiter({ max: 12 }), verify: createRateLimiter({ max: 30 }),
    contact: createRateLimiter({ max: 6 }), news: createRateLimiter({ max: 6 }),
  }

  // ---------- helpers ----------
  const ip = (req) => (env.TRUST_PROXY === '1' ? String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() : '') || req.socket.remoteAddress || 'unknown'

  const securityHeaders = (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'SAMEORIGIN')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    if (isProd) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    // Razorpay Checkout loads a script + iframe from razorpay.com; media/images may come from stock CDNs.
    res.setHeader('Content-Security-Policy', [
      "default-src 'self'",
      "script-src 'self' https://checkout.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' blob: https:",
      "frame-src https://api.razorpay.com https://checkout.razorpay.com https://www.openstreetmap.org",
      "connect-src 'self' https://lumberjack.razorpay.com https://api.razorpay.com",
      "form-action 'self'", "base-uri 'self'", "object-src 'none'",
    ].join('; '))
  }

  const sendJson = (res, status, body) => {
    const data = JSON.stringify(body)
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Length': Buffer.byteLength(data) })
    res.end(data)
  }

  const readBody = (req, maxBytes = 20_000) => new Promise((resolve, reject) => {
    const chunks = []; let size = 0
    req.on('data', (c) => {
      size += c.length
      if (size > maxBytes) { if (size - c.length <= maxBytes) reject(Object.assign(new Error('Payload too large'), { status: 413 })); return }
      chunks.push(c)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
  const readJson = async (req) => {
    const raw = await readBody(req)
    try { return raw.length ? JSON.parse(raw.toString('utf8')) : {} } catch { throw Object.assign(new Error('Invalid JSON'), { status: 400 }) }
  }

  const mediaManifest = () => {
    try { return JSON.parse(fs.readFileSync(path.join(publicDir, 'media', 'manifest.json'), 'utf8')) } catch { return {} }
  }

  const notify = async (subject, text, replyTo) => {
    if (!mailer || !env.CONTACT_TO) return
    try { await mailer.send({ to: env.CONTACT_TO, subject, text, replyTo }) } catch (e) { console.error('[mail]', e.message) }
  }

  // Mark an order paid exactly once and send the confirmation emails exactly once, whether the browser's
  // verify call or Razorpay's webhook arrives first (or both, or twice).
  const settle = (order, paymentId, via) => {
    let current = order
    if (order.status !== 'paid') {
      current = store.updateOrder(order.id, { status: 'paid', paymentId, paidAt: new Date().toISOString(), via })
      store.append('payments.jsonl', { event: via === 'webhook' ? 'paid_via_webhook' : 'verified', orderId: order.id, paymentId, itemId: order.itemId, amount: order.amount })
    }
    if (!current.emailed) {
      current = store.updateOrder(order.id, { emailed: true })
      const item = CATALOG[order.itemId]
      notify(`New enrolment: ${item.name}`, `${order.buyer.name} <${order.buyer.email}> ${order.buyer.phone}\n${item.name}\nPayment ${current.paymentId} · Order ${order.id}`, order.buyer.email)
      mailer?.send({ to: order.buyer.email, subject: 'Your PRĀNA Sanctuary enrolment is confirmed', text: `Namaste ${order.buyer.name},\n\nThank you for enrolling in "${item.name}".\nPayment ID: ${current.paymentId}\n\nOur team will email your access details shortly.\n\nWith gratitude,\nPRĀNA Sanctuary` }).catch((e) => console.error('[mail]', e.message))
    }
    return current
  }

  // Razorpay → server webhook (Dashboard → Webhooks): catches payments the browser never reported.
  const webhook = async (req) => {
    const raw = await readBody(req, 200_000)
    const sig = req.headers['x-razorpay-signature']
    if (!verifyWebhookSignature({ rawBody: raw, signature: sig, webhookSecret: env.RAZORPAY_WEBHOOK_SECRET })) return [400, { error: 'Bad signature' }]
    let evt; try { evt = JSON.parse(raw.toString('utf8')) } catch { return [400, { error: 'Bad JSON' }] }
    const payment = evt?.payload?.payment?.entity
    const orderId = payment?.order_id || evt?.payload?.order?.entity?.id
    const order = orderId && store.getOrder(orderId)
    if (order) {
      if ((evt.event === 'payment.captured' || evt.event === 'order.paid') && order.status !== 'paid') {
        if (payment && payment.amount !== order.amount) store.append('payments.jsonl', { event: 'amount_mismatch', orderId, got: payment.amount, expected: order.amount })
        else settle(order, payment?.id, 'webhook')
      } else if (evt.event === 'payment.failed' && order.status === 'created') {
        store.append('payments.jsonl', { event: 'payment_failed', orderId, reason: payment?.error_description })
      }
    }
    store.append('payments.jsonl', { event: 'webhook:' + evt.event, orderId })
    return [200, { ok: true }]
  }

  // ---------- API routes ----------
  const api = {
    'GET /api/health': async () => [200, { ok: true, payments: Boolean(razorpay) }],

    // Public runtime config — safe values only. The Razorpay *key id* is public by design; the secret never leaves the server.
    'GET /api/config': async () => [200, {
      razorpayKeyId: razorpay ? razorpay.keyId : null,
      paymentsEnabled: Boolean(razorpay),
      whatsappNumber: (env.WHATSAPP_NUMBER || '').replace(/\D/g, ''),
      whatsappMessage: env.WHATSAPP_MESSAGE || 'Namaste! I would like to know more about PRĀNA Sanctuary.',
      heroVideoUrl: env.HERO_VIDEO_URL || '',
      media: mediaManifest(),
    }],

    'GET /api/catalog': async () => [200, Object.fromEntries(Object.entries(CATALOG).map(([id, i]) => [id, { name: i.name, amount: i.amount, kind: i.kind }]))],

    'POST /api/orders': async (req) => {
      if (!limit.order(ip(req))) return [429, { error: 'Too many attempts. Please wait a minute and try again.' }]
      if (!razorpay) return [503, { error: 'Online payments are not switched on yet. Please contact us on WhatsApp to enrol.' }]
      const body = await readJson(req)
      const item = Object.hasOwn(CATALOG, body.itemId) ? CATALOG[body.itemId] : null
      if (!item) return [400, { error: 'That course or plan does not exist.' }]
      const { value: buyer, errors } = validateBuyer(body.buyer)
      if (Object.keys(errors).length) return [422, { errors }]
      try {
        const receipt = 'prana_' + crypto.randomBytes(8).toString('hex')
        const order = await razorpay.createOrder({
          amount: item.amount, currency: 'INR', receipt,
          notes: { itemId: body.itemId, email: buyer.email, name: buyer.name },
        })
        store.saveOrder({ id: order.id, itemId: body.itemId, amount: item.amount, currency: 'INR', buyer, receipt, status: 'created', createdAt: new Date().toISOString() })
        return [200, { orderId: order.id, amount: order.amount, currency: order.currency, keyId: razorpay.keyId, name: item.name, buyer }]
      } catch (e) {
        console.error('[razorpay] create order failed:', e.message)
        return [502, { error: 'We could not start the payment. Please try again in a moment.' }]
      }
    },

    // Server-side verification of the signature Razorpay Checkout returns to the browser.
    'POST /api/payments/verify': async (req) => {
      if (!limit.verify(ip(req))) return [429, { verified: false, error: 'Too many attempts.' }]
      const b = await readJson(req)
      const orderId = clean(b.razorpay_order_id, 64), paymentId = clean(b.razorpay_payment_id, 64), signature = clean(b.razorpay_signature, 128)
      const order = store.getOrder(orderId)
      if (!order) return [404, { verified: false, error: 'We could not find that order.' }]
      if (!verifyPaymentSignature({ orderId, paymentId, signature, keySecret })) {
        store.append('payments.jsonl', { event: 'signature_mismatch', orderId, paymentId, ip: ip(req) })
        return [400, { verified: false, error: 'Payment could not be verified. If money was deducted, it will be refunded automatically — or contact us with your payment ID.' }]
      }
      const updated = settle(order, paymentId, 'checkout')
      return [200, { verified: true, orderId, paymentId: updated.paymentId, item: { id: order.itemId, name: CATALOG[order.itemId].name, amount: order.amount } }]
    },

    'POST /api/razorpay/webhook': (req) => webhook(req),
    'POST /api/payments/webhook': (req) => webhook(req), // the path documented in README / .env.example
    'POST /api/contact': async (req) => {
      if (!limit.contact(ip(req))) return [429, { error: 'You have sent several messages in a short time. Please wait a minute.' }]
      const b = await readJson(req)
      if (b.website) return [200, { ok: true }] // honeypot: silently accept bots
      const { value, errors } = validateContact(b)
      if (Object.keys(errors).length) return [422, { errors }]
      try {
        store.append('messages.jsonl', value)
        await notify(`${value.kind === 'application' ? 'Teacher-training application' : 'Sanctuary inquiry'} from ${value.name}`,
          Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('\n'), value.email)
        return [200, { ok: true }]
      } catch (e) {
        console.error('[contact]', e)
        return [500, { error: 'We could not send your message. Please try again, or message us on WhatsApp.' }]
      }
    },

    'POST /api/newsletter': async (req) => {
      if (!limit.news(ip(req))) return [429, { error: 'Please wait a minute and try again.' }]
      const { value, errors } = validateEmail((await readJson(req)).email)
      if (errors) return [422, { errors }]
      store.append('newsletter.jsonl', { email: value })
      return [200, { ok: true }]
    },
  }

  // ---------- static files ----------
  const serveFile = (req, res, file, { immutable = false } = {}) => {
    const ext = path.extname(file).toLowerCase()
    let stat; try { stat = fs.statSync(file) } catch { return false }
    if (!stat.isFile()) return false
    const type = MIME[ext] || 'application/octet-stream'
    const etag = `W/"${stat.size.toString(16)}-${Math.round(stat.mtimeMs).toString(16)}"`
    const headers = { 'Content-Type': type, ETag: etag, 'Accept-Ranges': 'bytes', Vary: 'Accept-Encoding',
      'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : ext === '.html' ? 'no-cache' : 'public, max-age=86400' }
    if (req.headers['if-none-match'] === etag) { res.writeHead(304, headers); res.end(); return true }

    // Range support so <video> can seek / start quickly.
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '')
    if (range && (ext === '.mp4' || ext === '.webm')) {
      let start = range[1] === '' ? Math.max(stat.size - Number(range[2]), 0) : Number(range[1])
      let end = range[1] === '' || range[2] === '' ? stat.size - 1 : Math.min(Number(range[2]), stat.size - 1)
      if (start > end || start >= stat.size) { res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }); res.end(); return true }
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1 })
      if (req.method === 'HEAD') { res.end(); return true }
      fs.createReadStream(file, { start, end }).pipe(res); return true
    }
    const accept = String(req.headers['accept-encoding'] || '')
    if (COMPRESSIBLE.has(ext) && stat.size > 1024) {
      const enc = /\bbr\b/.test(accept) ? 'br' : /\bgzip\b/.test(accept) ? 'gzip' : null
      if (enc) {
        res.writeHead(200, { ...headers, 'Content-Encoding': enc })
        if (req.method === 'HEAD') { res.end(); return true }
        const stream = fs.createReadStream(file)
        stream.pipe(enc === 'br' ? zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }) : zlib.createGzip()).pipe(res)
        return true
      }
    }
    res.writeHead(200, { ...headers, 'Content-Length': stat.size })
    if (req.method === 'HEAD') { res.end(); return true }
    fs.createReadStream(file).pipe(res); return true
  }

  const within = (root, p) => { const r = path.resolve(root, '.' + path.sep + p); return r.startsWith(path.resolve(root) + path.sep) || r === path.resolve(root) ? r : null }

  const serveStatic = (req, res, pathname) => {
    let rel; try { rel = decodeURIComponent(pathname) } catch { res.writeHead(400); return res.end() }
    if (rel.includes('\0')) { res.writeHead(400); return res.end() }
    for (const root of [distDir, publicDir]) {
      const f = within(root, rel === '/' ? '/index.html' : rel)
      if (f && serveFile(req, res, f, { immutable: /\/assets\/.+-[A-Z0-9]{8}\./.test(rel) })) return
    }
    // SPA fallback only for page-like paths (not for missing assets).
    if (!path.extname(rel)) {
      const indexFile = path.join(distDir, 'index.html')
      if (fs.existsSync(indexFile)) return serveFile(req, res, indexFile)
      res.writeHead(503, { 'Content-Type': 'text/plain' }); return res.end('Site not built yet. Run: npm run build')
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found')
  }

  // ---------- main handler ----------
  return async function handler(req, res) {
    securityHeaders(res)
    const url = new URL(req.url, 'http://localhost')
    if (url.pathname.startsWith('/api/')) {
      if (allowedOrigin && req.headers.origin === allowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigin); res.setHeader('Vary', 'Origin')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
      }
      if (req.method === 'OPTIONS') { res.writeHead(204); return res.end() }
      const route = api[`${req.method} ${url.pathname}`]
      if (!route) return sendJson(res, 404, { error: 'Not found' })
      try { const [status, body] = await route(req); return sendJson(res, status, body) }
      catch (e) {
        if (e.status) return sendJson(res, e.status, { error: e.message })
        console.error('[api]', e); return sendJson(res, 500, { error: 'Something went wrong on our side.' })
      }
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end() }
    return serveStatic(req, res, url.pathname)
  }
}
