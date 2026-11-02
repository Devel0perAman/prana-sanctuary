// Extra regression tests (own server instance so rate-limit counters are independent of api.test.js).
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

const SECRET = 'sec_x', WH = 'wh_x'
let server, base, dir, sent = []

before(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prana-flow-'))
  fs.mkdirSync(path.join(dir, 'dist'), { recursive: true }); fs.writeFileSync(path.join(dir, 'dist', 'index.html'), '<!doctype html>')
  fs.mkdirSync(path.join(dir, 'public', 'media'), { recursive: true }); fs.writeFileSync(path.join(dir, 'public', 'media', 'clip.webm'), Buffer.alloc(1000, 7))
  let n = 0
  const razorpay = { keyId: 'rzp_test_k', async createOrder(o) { return { id: 'order_F' + ++n, amount: o.amount, currency: o.currency } } }
  server = http.createServer(createApp({
    env: { RAZORPAY_KEY_SECRET: SECRET, RAZORPAY_WEBHOOK_SECRET: WH },
    razorpay, store: createStore(path.join(dir, 'data')), mailer: { send: async (m) => { sent.push(m) } },
    distDir: path.join(dir, 'dist'), publicDir: path.join(dir, 'public'),
  }))
  await new Promise((r) => server.listen(0, r)); base = `http://127.0.0.1:${server.address().port}`
})
after(() => server.close())

const post = (p, body, headers = {}) => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) })
const buyer = { name: 'Asha Verma', email: 'asha@example.com', phone: '+91 98765 43210' }
const whSig = (raw) => crypto.createHmac('sha256', WH).update(raw).digest('hex')
const orderOf = async (itemId) => (await (await post('/api/orders', { itemId, buyer })).json()).orderId
const stored = () => JSON.parse(fs.readFileSync(path.join(dir, 'data', 'orders.json'), 'utf8'))
const capture = (orderId, amount, id = 'pay_w') => JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id, order_id: orderId, amount } } } })

test('webhook is reachable at the documented /api/payments/webhook path too', async () => {
  const orderId = await orderOf('course-asana'); const raw = capture(orderId, CATALOG['course-asana'].amount)
  assert.equal((await post('/api/payments/webhook', raw, { 'x-razorpay-signature': 'bad' })).status, 400)
  assert.equal((await post('/api/payments/webhook', raw, { 'x-razorpay-signature': whSig(raw) })).status, 200)
  assert.equal(stored()[orderId].status, 'paid')
})

test('webhook arriving first still sends exactly one confirmation; later verify does not resend', async () => {
  const orderId = await orderOf('course-yin'); const amount = CATALOG['course-yin'].amount
  const raw = capture(orderId, amount, 'pay_first'); sent.length = 0
  assert.equal((await post('/api/razorpay/webhook', raw, { 'x-razorpay-signature': whSig(raw) })).status, 200)
  await new Promise((r) => setTimeout(r, 20))
  assert.equal(sent.filter((m) => m.to === buyer.email).length, 1, 'buyer emailed by webhook path')
  const sig = crypto.createHmac('sha256', SECRET).update(`${orderId}|pay_first`).digest('hex')
  const v = await post('/api/payments/verify', { razorpay_order_id: orderId, razorpay_payment_id: 'pay_first', razorpay_signature: sig })
  assert.equal(v.status, 200); assert.equal((await v.json()).verified, true)
  // a second webhook event (order.paid) for the same order must not resend either
  const raw2 = JSON.stringify({ event: 'order.paid', payload: { payment: { entity: { id: 'pay_first', order_id: orderId, amount } } } })
  await post('/api/razorpay/webhook', raw2, { 'x-razorpay-signature': whSig(raw2) })
  await new Promise((r) => setTimeout(r, 20))
  assert.equal(sent.filter((m) => m.to === buyer.email).length, 1, 'still exactly one buyer email')
})

test('webhook with the wrong amount never marks the order paid', async () => {
  const orderId = await orderOf('course-pranayama'); const raw = capture(orderId, 100, 'pay_cheap')
  assert.equal((await post('/api/razorpay/webhook', raw, { 'x-razorpay-signature': whSig(raw) })).status, 200)
  assert.equal(stored()[orderId].status, 'created')
})

test('oversized JSON body gets a 413 response (not a dropped connection)', async () => {
  const r = await post('/api/contact', JSON.stringify({ name: 'x'.repeat(60_000) }))
  assert.equal(r.status, 413)
})

test('video range requests: 206 partial, suffix range, 416 out of range, non-GET rejected', async () => {
  const r = await fetch(base + '/media/clip.webm', { headers: { Range: 'bytes=0-99' } })
  assert.equal(r.status, 206); assert.equal(r.headers.get('content-range'), 'bytes 0-99/1000'); assert.equal((await r.arrayBuffer()).byteLength, 100)
  const s = await fetch(base + '/media/clip.webm', { headers: { Range: 'bytes=-50' } })
  assert.equal(s.status, 206); assert.equal((await s.arrayBuffer()).byteLength, 50)
  assert.equal((await fetch(base + '/media/clip.webm', { headers: { Range: 'bytes=5000-' } })).status, 416)
  assert.equal((await fetch(base + '/courses', { method: 'DELETE' })).status, 405)
})

test('catalog and health endpoints respond; unknown API route is JSON 404', async () => {
  assert.equal((await (await fetch(base + '/api/health')).json()).ok, true)
  const c = await (await fetch(base + '/api/catalog')).json(); assert.ok(Object.keys(c).length >= 6)
  for (const [id, item] of Object.entries(c)) assert.ok(Number.isInteger(item.amount) && item.amount > 0, `${id} has a positive integer paise amount`)
  const r = await fetch(base + '/api/nope'); assert.equal(r.status, 404); assert.match(r.headers.get('content-type'), /json/)
})
