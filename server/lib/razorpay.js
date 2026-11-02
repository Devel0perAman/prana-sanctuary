// Minimal Razorpay REST client (no SDK needed): https://razorpay.com/docs/api/orders/
import crypto from 'node:crypto'

export function createRazorpayClient({ keyId, keySecret, fetchImpl = fetch }) {
  const auth = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64')
  return {
    keyId,
    async createOrder({ amount, currency = 'INR', receipt, notes }) {
      const res = await fetchImpl('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: { Authorization: auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, receipt, notes }),
        signal: AbortSignal.timeout(15_000),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        const err = new Error(body?.error?.description || `Razorpay responded ${res.status}`)
        err.status = res.status
        throw err
      }
      return body // { id, amount, currency, status, ... }
    },
  }
}

const safeEqualHex = (a, b) => {
  const x = Buffer.from(String(a), 'utf8'), y = Buffer.from(String(b), 'utf8')
  return x.length === y.length && crypto.timingSafeEqual(x, y)
}

/** Checkout signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret) */
export function verifyPaymentSignature({ orderId, paymentId, signature, keySecret }) {
  if (!orderId || !paymentId || !signature || !keySecret) return false
  const expected = crypto.createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest('hex')
  return safeEqualHex(expected, signature)
}

/** Webhook signature: HMAC_SHA256(raw request body, webhook_secret) */
export function verifyWebhookSignature({ rawBody, signature, webhookSecret }) {
  if (!rawBody || !signature || !webhookSecret) return false
  const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex')
  return safeEqualHex(expected, signature)
}
