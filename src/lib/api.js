// Thin fetch wrapper. Throws ApiError with `.fields` (validation) and `.message` (user-friendly).
export class ApiError extends Error {
  constructor(message, { status, fields } = {}) { super(message); this.status = status; this.fields = fields || {} }
}

async function request(path, { method = 'GET', body, timeout = 20000 } = {}) {
  let res
  try {
    res = await fetch(path, {
      method, headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(timeout),
    })
  } catch {
    throw new ApiError('We could not reach the server. Please check your connection and try again.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.error || (data.errors ? 'Please check the highlighted fields.' : 'Something went wrong. Please try again.'), { status: res.status, fields: data.errors })
  return data
}

export const api = {
  config: () => request('/api/config', { timeout: 2500 }),
  createOrder: (itemId, buyer) => request('/api/orders', { method: 'POST', body: { itemId, buyer } }),
  verifyPayment: (payload) => request('/api/payments/verify', { method: 'POST', body: payload }),
  contact: (data) => request('/api/contact', { method: 'POST', body: data }),
  newsletter: (email) => request('/api/newsletter', { method: 'POST', body: { email } }),
}
