import { useEffect, useRef } from 'react'
import Icon from './Icon.jsx'
import { Img } from './ui.jsx'
import { useLockBody } from '../lib/hooks.js'

export default function Lightbox({ items, index, onClose, onIndex }) {
  const item = items[index]
  const btn = useRef(null)
  useLockBody(true)
  useEffect(() => {
    btn.current?.focus()
    const k = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [index, items.length, onClose, onIndex])
  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={item.title} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <button className="lb__btn lb__close" ref={btn} onClick={onClose} aria-label="Close"><Icon name="x" size={22} /></button>
      <button className="lb__btn lb__prev" onClick={() => onIndex((index - 1 + items.length) % items.length)} aria-label="Previous photo"><Icon name="chevron-left" size={26} /></button>
      <figure className="lb__fig">
        <Img k={item.img} alt={item.title} eager className="lb__img" />
        <figcaption><small>{item.series}</small><strong>{item.title}</strong><span>{item.text}</span><em>{index + 1} / {items.length}</em></figcaption>
      </figure>
      <button className="lb__btn lb__next" onClick={() => onIndex((index + 1) % items.length)} aria-label="Next photo"><Icon name="chevron-right" size={26} /></button>
    </div>
  )
}
