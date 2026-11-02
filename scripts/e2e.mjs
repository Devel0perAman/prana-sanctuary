// End-to-end smoke test. `npm run build && npm run e2e`
// Starts the real server with a FAKE Razorpay API + a stubbed checkout.js, then drives a real browser through
// every page, the contact form, the WhatsApp button, the hero video and the full payment flow (incl. a forged signature).
import http from 'node:http'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from '../server/app.js'
import { createStore } from '../server/lib/store.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
let chromium
try { ({ chromium } = await import('playwright')) } catch { ({ chromium } = await import(process.env.PLAYWRIGHT_ESM || '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs')) }

const SECRET = 'e2e_secret', WA = '919876543210'
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prana-e2e-'))
const created = [], mails = []
const razorpay = { keyId: 'rzp_test_e2e', async createOrder(o) { created.push(o); return { id: `order_E2E${created.length}xyz`, amount: o.amount, currency: o.currency } } }
const server = http.createServer(createApp({
  env: { RAZORPAY_KEY_ID: 'rzp_test_e2e', RAZORPAY_KEY_SECRET: SECRET, WHATSAPP_NUMBER: WA, CONTACT_TO: 'owner@example.com' },
  razorpay, store: createStore(dataDir), mailer: { send: async (m) => { mails.push(m) } },
  distDir: path.join(root, 'dist'), publicDir: path.join(root, 'public'),
}))
await new Promise((r) => server.listen(0, r))
const base = `http://127.0.0.1:${server.address().port}`

let pass = 0; const fails = []
const ok = (cond, name) => { cond ? pass++ : fails.push(name); console.log(`${cond ? '  ✓' : '  ✗'} ${name}`) }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const CHECKOUT_STUB = `window.Razorpay = class { constructor(o){ this.o = o; this.h = {} } on(e, f){ this.h[e] = f }
  async open(){ const o = this.o; window.__lastOptions = { amount: o.amount, order_id: o.order_id, key: o.key, currency: o.currency };
    const sig = await window.__sign(o.order_id, 'pay_E2E' + Math.random().toString(36).slice(2, 10), window.__forge === true);
    setTimeout(() => o.handler(sig), 50) } }`

async function launchBrowser() {
  for (const opts of [{}, { channel: 'msedge' }, { channel: 'chrome' }]) {
    try { return await chromium.launch(opts) } catch { /* try the next one */ }
  }
  console.error('\nNo browser found for the e2e test. Either run `npx playwright install chromium` (needs internet), or install Microsoft Edge / Google Chrome.')
  process.exit(2)
}
const browser = await launchBrowser()
const PAGES = [['/', 'Home'], ['/about', 'About'], ['/yoga-career', 'Yoga Career'], ['/courses', 'Online Courses'], ['/gallery', 'Gallery'], ['/contact', 'Contact']]
const VIEWPORTS = { desktop: [1440, 900], tablet: [820, 1100], mobile: [390, 844] }
const ignorable = (t) => /fonts\.g|openstreetmap|ERR_TUNNEL|ERR_NAME|ERR_CONNECTION|Failed to load resource/.test(t)

async function newPage(ctx) {
  const pg = await ctx.newPage(); pg.errors = []
  pg.on('pageerror', (e) => pg.errors.push(e.message))
  pg.on('console', (m) => { if (m.type() === 'error' && !ignorable(m.text())) pg.errors.push(m.text()) })
  await pg.route('https://checkout.razorpay.com/**', (r) => r.fulfill({ contentType: 'text/javascript', body: CHECKOUT_STUB }))
  await pg.route(/fonts\.(googleapis|gstatic)\.com|openstreetmap\.org/, (r) => r.abort())
  await pg.exposeFunction('__sign', (orderId, paymentId, forge) => ({
    razorpay_order_id: orderId, razorpay_payment_id: paymentId,
    razorpay_signature: crypto.createHmac('sha256', forge ? 'attacker' : SECRET).update(`${orderId}|${paymentId}`).digest('hex'),
  }))
  return pg
}

try {
  console.log('\n[1] Every page × desktop/tablet/mobile')
  for (const [vn, [w, h]] of Object.entries(VIEWPORTS)) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } })
    for (const [p, label] of PAGES) {
      const pg = await newPage(ctx)
      await pg.goto(base + p, { waitUntil: 'networkidle' })
      const info = await pg.evaluate(() => {
        const wa = document.querySelector('a.wa')?.getBoundingClientRect()
        return {
          h1: document.querySelectorAll('h1').length, title: document.title,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          waHref: document.querySelector('a.wa')?.getAttribute('href'),
          waRight: wa ? innerWidth - wa.right : null, waBottom: wa ? innerHeight - wa.bottom : null,
          imgsBroken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc).length,
          nav: !!document.querySelector('header nav, nav'), footer: !!document.querySelector('footer'),
        }
      })
      const tag = `${vn} ${label}`
      ok(info.h1 === 1 && info.nav && info.footer, `${tag}: one <h1>, nav and footer present`)
      ok(!info.overflow, `${tag}: no horizontal scroll`)
      ok(info.waHref?.startsWith(`https://wa.me/${WA}`) && info.waRight >= 0 && info.waRight < 48 && info.waBottom >= 0 && info.waBottom < 48, `${tag}: WhatsApp button bottom-right with wa.me link`)
      ok(info.imgsBroken === 0, `${tag}: no broken images`)
      ok(pg.errors.length === 0, `${tag}: no JS/console errors${pg.errors.length ? ' → ' + pg.errors[0] : ''}`)
      await pg.close()
    }
    await ctx.close()
  }

  console.log('\n[2] Hero video')
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const pg = await newPage(ctx)
    await pg.goto(base + '/', { waitUntil: 'networkidle' })
    await pg.waitForSelector('video.hero-media__video', { timeout: 8000 })
    await sleep(2000)
    const v = await pg.evaluate(() => { const v = document.querySelector('video.hero-media__video'); return { t: v.currentTime, paused: v.paused, w: v.videoWidth, src: v.currentSrc, muted: v.muted, loop: v.loop } })
    ok(v.w > 0 && !v.paused && v.t > 0.3, `hero <video> is decoding and playing (${v.src.split('/').pop()}, t=${v.t.toFixed(1)}s, ${v.w}px)`)
    ok(v.muted && v.loop, 'hero video is muted + looping (required for autoplay)')
    await ctx.close()
  }

  console.log('\n[3] Contact form')
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await newPage(ctx)
    await pg.goto(base + '/contact', { waitUntil: 'networkidle' })
    await pg.click('form.form button[type=submit]')
    const errs = await pg.locator('.field__error').allTextContents()
    ok(errs.length >= 3, `empty submit shows ${errs.length} inline validation errors`)
    await pg.fill('#c-name', 'Asha Verma'); await pg.fill('#c-email', 'not-an-email'); await pg.fill('#c-phone', 'abc')
    await pg.click('form.form button[type=submit]')
    ok((await pg.locator('#c-email-err').count()) === 1 && (await pg.locator('#c-phone-err').count()) === 1, 'bad email / phone are flagged')
    // server-side failure → friendly error banner
    await pg.fill('#c-email', 'asha@example.com'); await pg.fill('#c-phone', '+91 98765 43210'); await pg.selectOption('#c-topic', { index: 1 }); await pg.fill('#c-message', 'I would like to join the morning class and ask about beginners.')
    await pg.route('**/api/contact', (r) => r.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'We could not send your message. Please try again or WhatsApp us.' }) }), { times: 1 })
    await pg.click('form.form button[type=submit]')
    await pg.waitForSelector('.notice--error', { timeout: 5000 })
    ok(true, 'server error shows an error message (form data kept)')
    ok((await pg.inputValue('#c-name')) === 'Asha Verma', 'form values preserved after error')
    await pg.click('form.form button[type=submit]')
    await pg.waitForSelector('.form-done', { timeout: 5000 })
    ok(true, 'valid submit shows the success message')
    const saved = fs.readFileSync(path.join(dataDir, 'messages.jsonl'), 'utf8').trim().split('\n').map(JSON.parse)
    ok(saved.length === 1 && saved[0].email === 'asha@example.com', 'message persisted on the server')
    ok(mails.some((m) => /Asha Verma/.test(m.subject || m.text || '')), 'owner notification email attempted')
    await ctx.close()
  }

  console.log('\n[4] Razorpay checkout (course)')
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await newPage(ctx)
    await pg.goto(base + '/courses', { waitUntil: 'networkidle' })
    await pg.locator('button:has-text("Enrol now")').first().click()
    await pg.waitForSelector('.modal__card')
    await pg.click('.co-pay'); ok((await pg.locator('.modal .field__error').count()) >= 2, 'empty checkout form is validated')
    await pg.fill('#co-name', 'Asha Verma'); await pg.fill('#co-email', 'asha@example.com'); await pg.fill('#co-phone', '+91 98765 43210')
    // 4a: forged signature must NOT unlock anything
    await pg.evaluate(() => { window.__forge = true }); await pg.click('.co-pay')
    await pg.waitForSelector('.modal .notice--error', { timeout: 6000 })
    ok((await pg.locator('.co-success').count()) === 0, 'forged payment signature is rejected by the server (no success screen)')
    // 4b: genuine signature
    await pg.evaluate(() => { window.__forge = false }); await pg.click('.co-pay')
    await pg.waitForSelector('.co-success', { timeout: 6000 })
    ok(true, 'genuine payment verified → confirmation screen')
    const opt = await pg.evaluate(() => window.__lastOptions)
    ok(opt.amount === 199900 && opt.currency === 'INR' && opt.key === 'rzp_test_e2e', 'Razorpay opened with server-priced amount (₹1,999), INR, public key id only')
    ok(created.every((o) => o.amount === 199900), 'order created server-side from catalog price')
    const orders = JSON.parse(fs.readFileSync(path.join(dataDir, 'orders.json'), 'utf8'))
    ok(Object.values(orders).some((o) => o.status === 'paid'), 'order marked paid only after verification')
    ok(!(await pg.content()).includes(SECRET), 'key secret never present in the page')
    await ctx.close()
  }

  console.log('\n[5] Career deposit + newsletter')
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await newPage(ctx)
    await pg.goto(base + '/yoga-career', { waitUntil: 'networkidle' })
    await pg.locator('button:has-text("Reserve seat")').first().click()
    await pg.waitForSelector('.modal__card'); ok(/34,999/.test(await pg.locator('.co-price').innerText()), '200h seat deposit checkout shows ₹34,999')
    await pg.keyboard.press('Escape'); await pg.waitForSelector('.modal__card', { state: 'detached' }); ok(true, 'Esc closes checkout')
    await pg.fill('#news-email', 'bad'); await pg.click('form.news button[type=submit]'); ok((await pg.locator('form.news').innerText()).length > 0, 'newsletter handles bad email')
    await pg.fill('#news-email', 'reader@example.com'); await pg.click('form.news button[type=submit]'); await pg.waitForFunction(() => /on the list/.test(document.querySelector('form.news')?.innerText || ''), null, { timeout: 5000 })
    ok(true, 'newsletter sign-up succeeds')
    await ctx.close()
  }

  console.log('\n[6] Navigation + 404')
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } }); const pg = await newPage(ctx)
    await pg.goto(base + '/', { waitUntil: 'networkidle' })
    const burger = pg.locator('button[aria-label*="menu" i]').first()
    ok(await burger.isVisible(), 'mobile menu button visible')
    await burger.click(); await pg.locator('.drawer__link:has-text("Gallery")').click(); await pg.waitForURL('**/gallery')
    ok(await pg.locator('h1').first().isVisible(), 'mobile menu navigates client-side')
    await pg.goto(base + '/nope', { waitUntil: 'networkidle' }); await pg.waitForSelector('h1'); ok(/dissolved/.test(await pg.locator('h1').innerText()), 'unknown URL shows the friendly 404 page')
    await ctx.close()
  }
} finally {
  await browser.close(); server.close()
}
console.log(`\n${pass} passed, ${fails.length} failed`)
if (fails.length) { console.log('FAILED:\n - ' + fails.join('\n - ')); process.exit(1) }
