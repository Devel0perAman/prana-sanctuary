import { useEffect, useId, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { Link } from '../lib/router.jsx'
import { mediaAlt, mediaUrl } from '../lib/media.js'
import { useInView } from '../lib/hooks.js'

export const cx = (...a) => a.filter(Boolean).join(' ')

/** Scroll-reveal wrapper (CSS handles reduced motion). */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, seen] = useInView()
  return <Tag ref={ref} className={cx('reveal', seen && 'is-in', className)} style={delay ? { '--d': `${delay}ms` } : undefined} {...rest}>{children}</Tag>
}

/** Lazy image from the media registry: fades in, retries a smaller variant, then falls back to a tonal gradient. */
export function Img({ k, alt, className = '', eager = false, sizes, ...rest }) {
  const [src, setSrc] = useState(() => mediaUrl(k))
  const [state, setState] = useState('loading')
  const ref = useRef(null)
  useEffect(() => { setSrc(mediaUrl(k)); setState('loading') }, [k])
  useEffect(() => { if (ref.current?.complete && ref.current.naturalWidth > 0) setState('ok') }, [src])
  const onError = () => {
    if (/\.webp$/.test(src) && !src.includes('-sm.')) setSrc(src.replace('.webp', '-sm.webp'))
    else setState('error')
  }
  return (
    <span className={cx('img', `tone-${(k?.length || 0) % 5}`, state === 'ok' && 'is-loaded', className)}>
      {src && state !== 'error' && (
        <img ref={ref} src={src} alt={alt ?? mediaAlt(k)} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchpriority={eager ? 'high' : undefined}
          sizes={sizes} onLoad={() => setState('ok')} onError={onError} {...rest} />
      )}
    </span>
  )
}

export function Button({ to, href, variant = 'primary', size = 'md', icon, iconLeft, children, className = '', ...rest }) {
  const cls = cx('btn', `btn--${variant}`, size !== 'md' && `btn--${size}`, className)
  const inner = <>{iconLeft && <Icon name={iconLeft} size={18} />}<span>{children}</span>{icon && <Icon name={icon} size={18} className="btn__icon" />}</>
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>
  if (href) return <a href={href} className={cls} {...rest}>{inner}</a>
  return <button className={cls} {...rest}>{inner}</button>
}

/** Devanagari text, rendered with the Hindi display font. */
/** Devanagari text. The site is English-first, so labels are hidden unless `keep` is passed (hero line, two verses, footer). */
export const Deva = ({ children, className = '', as: Tag = 'span', keep = false }) => (keep ? <Tag className={cx('deva', className)} lang="hi">{children}</Tag> : null)

export const Eyebrow = ({ children, dot, className = '' }) => <p className={cx('eyebrow', className)}>{dot && <i className="eyebrow__dot" />}{children}</p>

export function SectionHead({ eyebrow, hi, title, em, text, center = true, className = '', children }) {
  return (
    <Reveal className={cx('sec-head', center && 'sec-head--center', className)}>
      {(eyebrow || hi) && <Eyebrow>{eyebrow}{hi && <Deva className="deva--tag">{eyebrow ? ' · ' : ''}{hi}</Deva>}</Eyebrow>}
      <h2 className="h2">{title}{em && <> <em>{em}</em></>}</h2>
      {text && <p className="lede">{text}</p>}
      {children}
    </Reveal>
  )
}

export const Stars = ({ value, count }) => (
  <span className="stars" aria-label={`Rated ${value} out of 5`}>
    <Icon name="star" size={14} className="stars__icon" /><b>{Number(value).toFixed(1)}</b>{count != null && <span>({count} reviews)</span>}
  </span>
)

const PORTRAITS = ['faculty-0', 'faculty-1', 'faculty-2', 'faculty-3']
/** Round illustrated avatar (never blank). Pick is stable per name. */
export const Monogram = ({ text, size = 44, className = '' }) => {
  const k = PORTRAITS[[...String(text)].reduce((a, c) => a + c.charCodeAt(0), 0) % PORTRAITS.length]
  return <span className={cx('mono', 'mono--photo', className)} style={{ '--s': size + 'px' }} aria-hidden="true"><Img k={k} alt="" /></span>
}

export const initials = (name) => name.replace(/^(Dr\.|Acharya|Master)\s+/i, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()

/** Accessible accordion. `items` = [[question, answer]] */
export function Accordion({ items }) {
  const [open, setOpen] = useState(-1)
  const uid = useId()
  return (
    <div className="acc">
      {items.map(([q, a], i) => (
        <div key={q} className={cx('acc__item', open === i && 'is-open')}>
          <h3>
            <button type="button" className="acc__btn" aria-expanded={open === i} aria-controls={`${uid}-${i}`} id={`${uid}-b${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{q}</span><Icon name="chevron-down" size={18} className="acc__chev" />
            </button>
          </h3>
          <div id={`${uid}-${i}`} role="region" aria-labelledby={`${uid}-b${i}`} className="acc__panel"><div><p>{a}</p></div></div>
        </div>
      ))}
    </div>
  )
}

/** Form field with label, hint and error wiring for screen readers. */
export function Field({ label, error, required, icon, children, className = '', id }) {
  return (
    <div className={cx('field', error && 'has-error', className)}>
      <label htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      <div className="field__control">{children}{icon && <Icon name={icon} size={16} className="field__icon" />}</div>
      {error && <p className="field__error" id={`${id}-err`} role="alert">{error}</p>}
    </div>
  )
}

export function PageHero({ eyebrow, hi, title, em, text, children, className = '' }) {
  return (
    <header className={cx('page-hero', className)}>
      <img className="gifbg gifbg--hero" src="/media/bg-mist.gif" alt="" aria-hidden="true" decoding="async" />
      <div className="wrap">
        {(eyebrow || hi) && <Eyebrow dot>{eyebrow}{hi && <Deva className="deva--tag">{eyebrow ? ' · ' : ''}{hi}</Deva>}</Eyebrow>}
        <h1 className="h1">{title}{em && <> <em>{em}</em></>}</h1>
        {text && <p className="lede">{text}</p>}
        {children}
      </div>
    </header>
  )
}
