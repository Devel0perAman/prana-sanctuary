import { useState } from 'react'
import { Link } from '../lib/router.jsx'
import { FOOTER_COLS, LEGAL, SITE } from '../data/site.js'
import { Logo } from './Navbar.jsx'
import Icon from './Icon.jsx'
import { Ambient, LoopVideo } from './Sections.jsx'
import { api } from '../lib/api.js'
import { validateEmail } from '../lib/validate.js'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState({ status: 'idle', msg: '' })
  const submit = async (e) => {
    e.preventDefault()
    const err = validateEmail(email)
    if (err) return setState({ status: 'error', msg: err })
    setState({ status: 'loading', msg: '' })
    try { await api.newsletter(email); setEmail(''); setState({ status: 'ok', msg: 'Thank you — you are on the list. 🌙' }) }
    catch (e2) { setState({ status: 'error', msg: e2.fields?.email || e2.message }) }
  }
  return (
    <form className="news" onSubmit={submit} noValidate>
      <label htmlFor="news-email" className="sr">Email address</label>
      <div className="news__row">
        <input id="news-email" type="email" autoComplete="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={state.status === 'error'} aria-describedby="news-msg" />
        <button type="submit" disabled={state.status === 'loading'}>{state.status === 'loading' ? '…' : 'Join'}</button>
      </div>
      <p id="news-msg" className={`news__msg news__msg--${state.status}`} role="status" aria-live="polite">{state.msg}</p>
    </form>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__bg" aria-hidden="true"><img className="gifbg gifbg--footer" src="/media/bg-footer.gif" alt="" loading="lazy" decoding="async" /></div><div className="footer__veil" />
      <Ambient petals={10} />
      <div className="wrap footer__om">
        <p className="footer__line">Breathe slowly · Walk gently · <em>Return often.</em></p>
        <p className="deva" lang="hi">ॐ शान्तिः शान्तिः शान्तिः</p>
      </div>
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p>An architectural sanctuary of mindful movement, somatic breathwork, and holistic stillness designed for intentional living.</p>
          <div className="footer__social">
            <a href={SITE.social[0].href} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="instagram" size={18} /></a>
            <a href={`mailto:${SITE.email}`} aria-label="Email us"><Icon name="mail" size={18} /></a>
            <a href={SITE.phoneHref} aria-label="Call us"><Icon name="phone" size={18} /></a>
          </div>
        </div>
        {FOOTER_COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h3 className="footer__title">{c.title}</h3>
            <ul>{c.links.map(([l, to]) => <li key={l}><Link to={to}>{l}</Link></li>)}</ul>
          </nav>
        ))}
        <div>
          <h3 className="footer__title">Newsletter &amp; Studio</h3>
          <p className="footer__small">Receive full-moon meditations, Ganga-side retreat dates and seasonal recipes.</p>
          <Newsletter />
          <address className="footer__addr"><Icon name="map-pin" size={14} /> {SITE.address[0]}, {SITE.address[1]}<br /><Icon name="phone" size={14} /> <a href={SITE.phoneHref}>{SITE.phone}</a><br /><Icon name="clock" size={14} /> Daily 05:30 – 20:30 IST</address>
        </div>
      </div>
      <div className="wrap footer__bar">
        <p>© {new Date().getFullYear()} PRĀNA Sanctuary Atelier. All rights reserved.</p>
        <ul>{LEGAL.map(([l, to]) => <li key={l}><Link to={to}>{l}</Link></li>)}</ul>
      </div>
    </footer>
  )
}
