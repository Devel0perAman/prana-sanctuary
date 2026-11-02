// Sliding-window in-memory rate limiter keyed by client IP.
export function createRateLimiter({ windowMs = 60_000, max = 20 } = {}) {
  const hits = new Map()
  const timer = setInterval(() => {
    const cutoff = Date.now() - windowMs
    for (const [k, arr] of hits) { const f = arr.filter((t) => t > cutoff); f.length ? hits.set(k, f) : hits.delete(k) }
  }, windowMs); timer.unref?.()
  return (key) => {
    const now = Date.now(), arr = (hits.get(key) || []).filter((t) => t > now - windowMs)
    if (arr.length >= max) { hits.set(key, arr); return false }
    arr.push(now); hits.set(key, arr); return true
  }
}
