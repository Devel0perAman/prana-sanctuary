import { Button, Field } from './ui.jsx'
import Icon from './Icon.jsx'
import { useContactSubmit } from '../lib/useForm.js'
import { validateContact } from '../lib/validate.js'
import { TIMES, TOPICS } from '../data/content.js'

const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10) }

export default function ContactForm() {
  const { values: v, errors, status, onChange, submit, reset } = useContactSubmit({
    initial: { name: '', email: '', phone: '', topic: '', date: '', time: TIMES[0], message: '', matRequested: false, website: '' },
    validate: (x) => validateContact(x),
    toPayload: (x) => ({ ...x, kind: 'inquiry' }),
  })
  const sending = status.state === 'sending'
  const err = (k) => (errors[k] ? { 'aria-invalid': true, 'aria-describedby': `c-${k}-err` } : {})

  if (status.state === 'success') {
    return (
      <div className="form-done" role="status">
        <span className="co-success__tick"><Icon name="check" size={30} strokeWidth={2.4} /></span>
        <h3 className="h3">Thank you, {v.name.split(' ')[0]}.</h3>
        <p>Your inquiry has reached our Sanctuary Concierge. We reply within one working day — usually much sooner — at <strong>{v.email}</strong>.</p>
        <Button variant="ghost" onClick={reset}>Send another message</Button>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={submit} noValidate aria-describedby="form-status">
      {/* Honeypot — real people never see or fill this */}
      <div className="hp" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={v.website} onChange={onChange('website')} /></label></div>

      <div className="form__grid">
        <Field label="Full name" id="c-name" required error={errors.name} icon="user">
          <input id="c-name" value={v.name} onChange={onChange('name')} placeholder="Elena Rostova" autoComplete="name" {...err('name')} />
        </Field>
        <Field label="Email address" id="c-email" required error={errors.email} icon="mail">
          <input id="c-email" type="email" value={v.email} onChange={onChange('email')} placeholder="elena@sanctuary.com" autoComplete="email" {...err('email')} />
        </Field>
        <Field label="Phone number" id="c-phone" error={errors.phone} icon="phone">
          <input id="c-phone" type="tel" value={v.phone} onChange={onChange('phone')} placeholder="+91 98765 43210" autoComplete="tel" {...err('phone')} />
        </Field>
        <Field label="Inquiring about" id="c-topic" error={errors.topic}>
          <select id="c-topic" value={v.topic} onChange={onChange('topic')}><option value="">Select an experience…</option>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
        </Field>
        <Field label="Preferred date" id="c-date" error={errors.date}>
          <input id="c-date" type="date" min={today()} value={v.date} onChange={onChange('date')} {...err('date')} />
        </Field>
        <Field label="Preferred practice time" id="c-time">
          <select id="c-time" value={v.time} onChange={onChange('time')}>{TIMES.map((t) => <option key={t}>{t}</option>)}</select>
        </Field>
      </div>
      <Field label="Message & practice background" id="c-message" required error={errors.message}>
        <textarea id="c-message" rows={4} value={v.message} onChange={onChange('message')} placeholder="Tell us about your previous yoga experience, injuries, somatic aspirations, or questions…" {...err('message')} />
      </Field>

      <label className="check"><input type="checkbox" checked={v.matRequested} onChange={onChange('matRequested')} /><span>Complimentary organic jute mat &amp; cedar block preparation requested.</span></label>

      <div id="form-status" role="alert" aria-live="assertive">
        {status.state === 'error' && <div className="notice notice--error"><Icon name="alert" size={18} /><div>{status.message}</div></div>}
      </div>

      <Button type="submit" variant="primary" size="lg" icon={sending ? undefined : 'arrow-right'} disabled={sending}>{sending ? 'Sending…' : 'Send Sanctuary Inquiry'}</Button>
      <p className="form__fine"><Icon name="shield" size={14} /> Respectful discretion assured. We will never share your personal information.</p>
    </form>
  )
}
