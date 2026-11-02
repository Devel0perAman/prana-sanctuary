import { useEffect, useState } from 'react'
import { Link, useRouter } from '../lib/router.jsx'
import { NAV } from '../data/site.js'
import Icon from './Icon.jsx'
import { Button, cx } from './ui.jsx'
import { useLockBody } from '../lib/hooks.js'

export const Logo = ({ light }) => (
  <Link to="/" className={cx('logo', light && 'logo--light')} aria-label="PRĀNA Sanctuary — home">
    <Icon name="lotus" size={26} strokeWidth={1.5} className="logo__mark" />
    <span className="logo__text"><b>PRĀNA</b><small>SANCTUARY</small></span>
  </Link>
)

export default function Navbar() {
  const { path } = useRouter()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useLockBody(open)
  useEffect(() => { setOpen(false) }, [path])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on(); window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [open])

  const overHero = path === '/' && !scrolled && !open
  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <header className={cx('nav', scrolled && 'is-scrolled', overHero && 'nav--hero')}>
        <div className="nav__inner">
          <Logo light={overHero} />
          <nav className="nav__links" aria-label="Primary">
            {NAV.map((n) => <Link key={n.to} to={n.to} className={cx('nav__link', path === n.to && 'is-active')} aria-current={path === n.to ? 'page' : undefined}>{n.label}</Link>)}
          </nav>
          <div className="nav__cta">
            <Button to="/contact#booking" variant="terra" size="sm" className="nav__book">Book Class</Button>
            <button type="button" className="nav__burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
              <Icon name={open ? 'x' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </header>
      <div id="mobile-menu" className={cx('drawer', open && 'is-open')} aria-hidden={!open} inert={!open}>
        <nav aria-label="Mobile">
          {NAV.map((n, i) => <Link key={n.to} to={n.to} className={cx('drawer__link', path === n.to && 'is-active')} style={{ '--i': i }}>{n.label}<Icon name="arrow-right" size={18} /></Link>)}
        </nav>
        <Button to="/contact#booking" variant="terra" className="drawer__cta">Book a Class</Button>
      </div>
    </>
  )
}
