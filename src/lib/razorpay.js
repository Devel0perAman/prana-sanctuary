// Loads Razorpay Checkout on demand (only when someone actually clicks "Enrol") and opens it.
let loading
export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay)
  loading ||= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'; s.async = true
    s.onload = () => resolve(window.Razorpay)
    s.onerror = () => { loading = null; reject(new Error('Could not load the secure payment window. Please check your connection.')) }
    document.head.appendChild(s)
  })
  return loading
}

/** Opens Checkout. Resolves with the signed response, rejects with {dismissed} or {failed}. */
export async function openCheckout({ order, description }) {
  const Razorpay = await loadRazorpay()
  return new Promise((resolve, reject) => {
    const rzp = new Razorpay({
      key: order.keyId, order_id: order.orderId, amount: order.amount, currency: order.currency,
      name: 'PRĀNA Sanctuary', description, theme: { color: '#2b3a22' },
      prefill: { name: order.buyer.name, email: order.buyer.email, contact: order.buyer.phone },
      modal: { ondismiss: () => reject({ dismissed: true }), confirm_close: true },
      handler: (resp) => resolve(resp),
    })
    rzp.on('payment.failed', (r) => reject({ failed: true, message: r?.error?.description || 'The payment did not go through.' }))
    rzp.open()
  })
}
