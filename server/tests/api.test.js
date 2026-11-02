import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createApp } from '../app.js'
import { createStore } from '../lib/store.js'
import { CATALOG } from '../../shared/catalog.js'

const SECRET = 'test_secret_123', WH = 'wh_secret_456'
let server, base, dir, created = [], sent = []

before(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prana-'))
  fs.mkdirSync(path.join(dir, 'dist'), { recursive: true }); fs.writeFileSync(path.join(dir, 'dist', 'index.html'), '<!doctype html><title>x</title>' + 'a'.repeat(2000))
  const fakeRazorpay = { keyId: 'rzp_test_abc', async createOrder(o) { created.push(o); return { id: 'order_' + created.length, amount: o.amount, currency: o.currency } } }
  const handler = createApp({
    env: { RAZORPAY_KEY_SECRET: SECRET, RAZORPAY_WEBHOOK_SECRET: WH, CONTACT_TO: 'a@b.c', WHATSAPP_NUMBER: '+91 98765-43210' },
    razorpay: fakeRazorpay, store: createStore(path.join(dir, 'data')),
    mailer: { send: async (m) => { sent.push(m) } }, distDir: path.join(dir, 'dist'), publicDir: path.join(dir, 'public'),
  })
  server = http.createServer(handler); await new Promise((r) => server.listen(0, r)); base = `http://127.0.0.1:${server.address().port}`
})
after(() => server.close())

const post = (p, body, headers = {}) => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) })
const buyer = { name: 'Asha Verma', email: 'asha@example.com', phone: '+91 98765 43210' }
const sign = (o, p, s = SECRET) => crypto.createHmac('sha256', s).update(`${o}|${p}`).digest('hex')

test('config exposes only public values', async () => {
  const c = await (await fetch(base + '/api/config')).json()
  assert.equal(c.razorpayKeyId, 'rzp_test_abc'); assert.equal(c.whatsappNumber, '919876543210')
  assert.ok(!JSON.stringify(c).includes(SECRET))
})

test('order amount comes from server catalog, never from the client', async () => {
  const r = await post('/api/orders', { itemId: 'course-foundations', amount: 1, buyer })
  assert.equal(r.status, 200); const b = await r.json()
  assert.equal(b.amount, CATALOG['course-foundations'].amount); assert.equal(created.at(-1).amount, 199900); assert.equal(created.at(-1).currency, 'INR')
})

test('unknown item, prototype keys and bad buyer are rejected', async () => {
  assert.equal((await post('/api/orders', { itemId: 'nope', buyer })).status, 400)
  assert.equal((await post('/api/orders', { itemId: '__proto__', buyer })).status, 400)
  assert.equal((await post('/api/orders', { itemId: 'plan-annual', buyer: { name: '', email: 'x', phone: '1' } })).status, 422)
  assert.equal((await post('/api/orders', '{bad json')).status, 400)
})

test('valid signature verifies, is idempotent, and emails the buyer', async () => {
  const { orderId } = await (await post('/api/orders', { itemId: 'plan-unlimited', buyer })).json()
  const body = { razorpay_order_id: orderId, razorpay_payment_id: 'pay_1', razorpay_signature: sign(orderId, 'pay_1') }
  const r1 = await post('/api/payments/verify', body); assert.equal(r1.status, 200); assert.equal((await r1.json()).verified, true)
  const n = sent.length
  const r2 = await post('/api/payments/verify', body); assert.equal(r2.status, 200); assert.equal(sent.length, n, 'no duplicate emails')
})

test('tampered / wrong-secret / swapped-payment signatures are rejected', async () => {
  const { orderId } = await (await post('/api/orders', { itemId: 'course-yin', buyer })).json()
  for (const sig of ['deadbeef', sign(orderId, 'pay_2', 'other_secret'), sign(orderId, 'pay_OTHER'), '']) {
    const r = await post('/api/payments/verify', { razorpay_order_id: orderId, razorpay_payment_id: 'pay_2', razorpay_signature: sig })
    assert.equal(r.status, 400); assert.equal((await r.json()).verified, false)
  }
  assert.equal((await post('/api/payments/verify', { razorpay_order_id: 'order_fake', razorpay_payment_id: 'p', razorpay_signature: sign('order_fake', 'p') })).status, 404)
})

test('webhook needs a valid signature; payment.captured marks order paid', async () => {
  const { orderId } = await (await post('/api/orders', { itemId: 'course-asana', buyer })).json()
  const raw = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_w', order_id: orderId, amount: CATALOG['course-asana'].amount } } } })
  assert.equal((await post('/api/razorpay/webhook', raw, { 'x-razorpay-signature': 'bad' })).status, 400)
  assert.equal((await post('/api/razorpay/webhook', raw, { 'x-razorpay-signature': crypto.createHmac('sha256', WH).update(raw).digest('hex') })).status, 200)
  const orders = JSON.parse(fs.readFileSync(path.join(dir, 'data', 'orders.json'), 'utf8'))
  assert.equal(orders[orderId].status, 'paid'); assert.equal(orders[orderId].via, 'webhook')
})

test('contact: validation errors, success, honeypot', async () => {
  const bad = await post('/api/contact', { name: 'A', email: 'nope', message: 'short' }); assert.equal(bad.status, 422)
  const errs = (await bad.json()).errors; assert.ok(errs.name && errs.email && errs.message)
  const ok = await post('/api/contact', { name: 'Elena Rostova', email: 'elena@sanctuary.com', phone: '+1 805 555 0142', topic: 'Private retreat', message: 'I would love to know more about retreats.' })
  assert.equal(ok.status, 200)
  assert.ok(fs.readFileSync(path.join(dir, 'data', 'messages.jsonl'), 'utf8').includes('Elena Rostova'))
  const before = fs.readFileSync(path.join(dir, 'data', 'messages.jsonl'), 'utf8')
  assert.equal((await post('/api/contact', { name: 'Bot Bot', email: 'b@b.co', message: 'spam spam spam spam', website: 'http://x' })).status, 200)
  assert.equal(fs.readFileSync(path.join(dir, 'data', 'messages.jsonl'), 'utf8'), before, 'honeypot not stored')
})

test('newsletter validates email', async () => {
  assert.equal((await post('/api/newsletter', { email: 'bad' })).status, 422)
  assert.equal((await post('/api/newsletter', { email: 'ok@example.com' })).status, 200)
})

test('static: SPA fallback, 404 for missing asset, no path traversal, security headers', async () => {
  const r = await fetch(base + '/courses'); assert.equal(r.status, 200); assert.match(r.headers.get('content-type'), /html/)
  assert.ok(r.headers.get('content-security-policy').includes('checkout.razorpay.com'))
  assert.equal((await fetch(base + '/missing.js')).status, 404)
  // Traversal attempts must never leak files outside dist/public (falling back to index.html is fine).
  const t = await (await fetch(base + '/..%2f..%2f..%2f..%2fetc%2fpasswd')).text(); assert.ok(!t.includes('root:'))
  const raw = await new Promise((res) => http.get({ host: '127.0.0.1', port: server.address().port, path: '/../../../etc/passwd' }, (x) => { let d = ''; x.on('data', (c) => (d += c)); x.on('end', () => res(d)) }))
  assert.ok(!raw.includes('root:'))
})

test('rate limit kicks in on orders', async () => {
  let last; for (let i = 0; i < 15; i++) last = await post('/api/orders', { itemId: 'nope', buyer })
  assert.equal(last.status, 429)
})
