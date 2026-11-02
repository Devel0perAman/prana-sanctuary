import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { Button, Field, cx } from './ui.jsx'
import { api } from '../lib/api.js'
import { openCheckout } from '../lib/razorpay.js'
import { validateBuyer } from '../lib/validate.js'
import { useConfig } from '../lib/config.jsx'
import { formatINR } from '../../shared/catalog.js'
import { useLockBody } from '../lib/hooks.js'

/**
 * Purchase flow:  details → server creates order (price from server catalog) → Razorpay Checkout
 *                 → browser sends signature to /api/payments/verify → success shown ONLY after server verifies.
 */
export default function CheckoutModal({ item, onClose }) {
  const { paymentsEnabled, whatsappNumber } = useConfig()
  const [buyer, setBuyer] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [phase, setPhase] = useState('form') // form | working | success
  const [notice, setNotice] = useState(null) // {type:'error'|'info', text}
  const [receipt, setReceipt] = useState(null)
  const first = useRef(null), dialog = useRef(null)
  useLockBody(true)

  useEffect(() => { first.current?.focus() }, [])
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && phase !== 'working') onClose()
      if (e.key === 'Tab' && dialog.current) { // focus trap
        const f = [...dialog.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((x) => !x.disabled && x.offsetParent !== null)
        if (!f.length) return
        const a = f[0], z = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus() }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
      }
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [phase, onClose])

  const set = (k) => (e) => { setBuyer({ ...buyer, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }) }

  const pay = async (e) => {
    e.preventDefault(); setNotice(null)
    const v = validateBuyer(buyer); setErrors(v)
    if (Object.keys(v).length) return
    setPhase('working')
    try {
      const order = await api.createOrder(item.id, buyer)
      let resp
      try { resp = await openCheckout({ order, description: item.name }) }
      catch (err) {
        setPhase('form')
        return setNotice(err?.dismissed ? { type: 'info', text: 'Payment window closed — you have not been charged.' } : { type: 'error', text: err?.message || 'The payment did not go through. You have not been charged.' })
      }
      const result = await api.verifyPayment(resp)
      if (!result.verified) throw new Error(result.error || 'Verification failed')
      setReceipt(result); setPhase('success')
    } catch (err) {
      setPhase('form')
      if (err.fields && Object.keys(err.fields).length) setErrors(err.fields)
      setNotice({ type: 'error', text: err.message || 'Something went wrong. Please try again.' })
    }
  }

  const wa = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello! I would like to enrol in "${item.name}".`)}` : null

  return (
    <div className="modal" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && phase !== 'working' && onClose()}>
      <div className="modal__card" role="dialog" aria-modal="true" aria-labelledby="co-title" ref={dialog}>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close" disabled={phase === 'working'}><Icon name="x" size={20} /></button>

        {phase === 'success' ? (
          <div className="co-success">
            <span className="co-success__tick"><Icon name="check" size={30} strokeWidth={2.4} /></span>
            <h2 id="co-title" className="h3">Payment confirmed. Namaste 🙏</h2>
            <p>Thank you, {buyer.name.split(' ')[0]}. Your enrolment in <strong>{receipt.item.name}</strong> is confirmed and our team will email your access details to <strong>{buyer.email}</strong>.</p>
            <dl className="co-receipt">
              <div><dt>Amount paid</dt><dd>{formatINR(receipt.item.amount)}</dd></div>
              <div><dt>Payment ID</dt><dd>{receipt.paymentId}</dd></div>
              <div><dt>Order ID</dt><dd>{receipt.orderId}</dd></div>
            </dl>
            <Button onClick={onClose} variant="primary">Done</Button>
          </div>
        ) : (
          <form onSubmit={pay} noValidate>
            <p className="eyebrow">Secure checkout</p>
            <h2 id="co-title" className="h3">{item.name}</h2>
            <p className="co-price">{formatINR(item.amount)} <small>{item.suffix || 'one-time'} · incl. all taxes</small></p>

            {!paymentsEnabled ? (
              <div className="notice notice--info" role="status">
                <Icon name="alert" size={18} />
                <div><strong>Online payments open soon.</strong> You can still enrol today — message our team and we will send a secure payment link.
                  {wa && <> <a href={wa} target="_blank" rel="noopener noreferrer">Enrol on WhatsApp →</a></>}</div>
              </div>
            ) : (
              <>
                {notice && <div className={cx('notice', `notice--${notice.type}`)} role={notice.type === 'error' ? 'alert' : 'status'}><Icon name={notice.type === 'error' ? 'alert' : 'check'} size={18} /><div>{notice.text}</div></div>}
                <Field label="Full name" id="co-name" required error={errors.name} icon="user">
                  <input id="co-name" ref={first} value={buyer.name} onChange={set('name')} autoComplete="name" placeholder="Your full name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'co-name-err' : undefined} disabled={phase === 'working'} />
                </Field>
                <Field label="Email address" id="co-email" required error={errors.email} icon="mail">
                  <input id="co-email" type="email" value={buyer.email} onChange={set('email')} autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'co-email-err' : undefined} disabled={phase === 'working'} />
                </Field>
                <Field label="Mobile number" id="co-phone" required error={errors.phone} icon="phone">
                  <input id="co-phone" type="tel" value={buyer.phone} onChange={set('phone')} autoComplete="tel" placeholder="+91 98765 43210" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'co-phone-err' : undefined} disabled={phase === 'working'} />
                </Field>
                <Button type="submit" variant="primary" size="lg" className="co-pay" disabled={phase === 'working'} iconLeft={phase === 'working' ? undefined : 'lock'}>
                  {phase === 'working' ? 'Processing securely…' : `Pay ${formatINR(item.amount)} securely`}
                </Button>
                <p className="co-fine"><Icon name="shield" size={14} /> Payments by Razorpay · UPI, cards, netbanking &amp; wallets · 256-bit encrypted. We never see your card details.</p>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
