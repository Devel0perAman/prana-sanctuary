import { useEffect, useRef, useState } from 'react'

/** Sets <title> and meta description per page. */
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — PRĀNA Sanctuary` : 'PRĀNA Sanctuary — Yoga, Somatic Breathwork & Teacher Training'
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}

/** true once the element has entered the viewport (one-shot). */
export function useInView(options = { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (!('IntersectionObserver' in window)) { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, options)
    io.observe(el); return () => io.disconnect()
  }, [seen])
  return [ref, seen]
}

export function useMediaQuery(q) {
  const [m, setM] = useState(() => (typeof matchMedia === 'function' ? matchMedia(q).matches : false))
  useEffect(() => { const mq = matchMedia(q), on = () => setM(mq.matches); mq.addEventListener('change', on); on(); return () => mq.removeEventListener('change', on) }, [q])
  return m
}

export function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [locked])
}
