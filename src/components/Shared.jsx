import { useState } from 'react'
import { Button, Eyebrow, Reveal, cx } from './ui.jsx'
import Icon from './Icon.jsx'
import CheckoutModal from './CheckoutModal.jsx'
import { CATALOG } from '../../shared/catalog.js'

/** Dark closing call-to-action band used at the bottom of pages. */
export function CtaBand({ eyebrow, title, em, text, actions, children }) {
  return (
    <section className="wrap sec"><Reveal className="cta-band">
      <div className="cta-band__copy">
        {eyebrow && <Eyebrow className="eyebrow--light">{eyebrow}</Eyebrow>}
        <h2 className="h2">{title}{em && <> <em>{em}</em></>}</h2>
        {text && <p>{text}</p>}
      </div>
      <div className="cta-band__side">{actions}{children}</div>
    </Reveal></section>
  )
}

/** Hook owning the "which item is being bought" state + the modal. */
export function useCheckout() {
  const [item, setItem] = useState(null)
  const buy = (id, extra = {}) => setItem({ id, ...CATALOG[id], ...extra })
  const modal = item ? <CheckoutModal item={item} onClose={() => setItem(null)} /> : null
  return { buy, modal }
}

export const TrustRow = ({ items }) => (
  <ul className="trust-row">{items.map(([icon, text]) => <li key={text}><Icon name={icon} size={16} />{text}</li>)}</ul>
)

export const Chips = ({ items, value, onChange, label }) => (
  <div className="chips" role="group" aria-label={label}>
    {items.map((c) => <button key={c} type="button" className={cx('chip', value === c && 'is-on')} aria-pressed={value === c} onClick={() => onChange(c)}>{c}</button>)}
  </div>
)
