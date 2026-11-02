// Extra page blocks: image + copy splits, photo strips, animated GIF bands, place cards and the "visit us" panel.
import Icon from './Icon.jsx'
import { Link } from '../lib/router.jsx'
import { Button, Eyebrow, Img, Reveal, SectionHead, cx } from './ui.jsx'
import { Ambient } from './Sections.jsx'
import { SITE } from '../data/site.js'

/** Animated GIF used as a decorative background (lazy; hidden for reduced-motion users, who keep the tinted fallback). */
export function GifBg({ src, className = '' }) {
  return <img className={cx('gifbg', className)} src={`/media/${src}.gif`} alt="" aria-hidden="true" loading="lazy" decoding="async" />
}

/** Picture on one side, copy on the other. */
export function ImageSplit({ img, alt, eyebrow, title, em, text, bullets, reverse, tag, actions, id, children }) {
  return (
    <section className="wrap sec" id={id}>
      <div className={cx('isplit', reverse && 'isplit--rev')}>
        <Reveal className="isplit__media">
          <Img k={img} alt={alt} className="img--tall" />
          {tag && <span className="tag tag--float">{tag}</span>}
        </Reveal>
        <Reveal className="isplit__copy" delay={80}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h2 className="h2">{title}{em && <> <em>{em}</em></>}</h2>
          {text && <p className="lede">{text}</p>}
          {bullets && <ul className="ticks ticks--roomy">{bullets.map((b) => <li key={b}><Icon name="check" size={16} />{b}</li>)}</ul>}
          {children}
          {actions && <div className="isplit__actions">{actions}</div>}
        </Reveal>
      </div>
    </section>
  )
}

/** Endless slow-scrolling row of photographs (CSS only, pauses on hover and for reduced-motion). */
export function PhotoStrip({ items, label = 'Photographs from the sanctuary' }) {
  const row = items.map(([k, cap], i) => (
    <figure key={k + i} className="pstrip__item"><Img k={k} alt={cap} loading="eager" /><figcaption>{cap}</figcaption></figure>
  ))
  return (
    <section className="pstrip" aria-label={label}>
      <div className="pstrip__track"><div>{row}</div><div aria-hidden="true">{row}</div></div>
    </section>
  )
}

/** Photo cards: items = [{img, tag, title, text, meta}] */
export function PlaceCards({ items, cols = 3 }) {
  return (
    <div className={cx('grid', cols === 4 ? 'grid--4' : 'grid--3')}>
      {items.map((x, i) => (
        <Reveal as="article" key={x.title} delay={i * 70} className="card card--lift">
          <div className="card__media"><Img k={x.img} />{x.tag && <span className="tag tag--float">{x.tag}</span>}</div>
          <div className="card__body"><h3 className="h4">{x.title}</h3><p>{x.text}</p>{x.meta && <span className="card__foot">{x.meta}</span>}</div>
        </Reveal>
      ))}
    </div>
  )
}

/** Full-bleed band with an animated GIF behind the copy. */
export function GifBand({ gif = 'bg-aarti', eyebrow, title, em, text, actions, tone = 'dark' }) {
  return (
    <section className={cx('gband', `gband--${tone}`)}>
      <GifBg src={gif} />
      <Ambient petals={6} mandala={false} />
      <Reveal className="wrap gband__body">
        {eyebrow && <Eyebrow className="eyebrow--light">{eyebrow}</Eyebrow>}
        <h2 className="h2">{title}{em && <> <em>{em}</em></>}</h2>
        {text && <p className="lede">{text}</p>}
        {actions && <div className="film__actions">{actions}</div>}
      </Reveal>
    </section>
  )
}

/** Address + hours + directions panel with the Rishikesh pin. */
export function VisitBlock({ img = 'rk-bridge' }) {
  const { lat, lon } = SITE.coords
  return (
    <section className="wrap sec" id="visit">
      <Reveal className="visit">
        <div className="visit__media"><Img k={img} /><span className="tag tag--float">Tapovan · Rishikesh</span></div>
        <div className="visit__copy">
          <Eyebrow>Visit the sanctuary</Eyebrow>
          <h2 className="h2">Come and sit <em>by the Ganga.</em></h2>
          <ul className="contact-list">
            <li><Icon name="map-pin" size={18} /><span>{SITE.address[0]}<br />{SITE.address[1]}</span></li>
            <li><Icon name="clock" size={18} /><span>{SITE.hours[0][0]}: {SITE.hours[0][1]}<br />{SITE.hours[1][0]}: {SITE.hours[1][1]}</span></li>
            <li><Icon name="phone" size={18} /><a href={SITE.phoneHref}>{SITE.phone}</a></li>
            <li><Icon name="mail" size={18} /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
          </ul>
          <div className="isplit__actions">
            <Button href={`https://www.openstreetmap.org/directions?to=${lat}%2C${lon}`} target="_blank" rel="noopener noreferrer" variant="primary" icon="arrow-up-right">Get directions</Button>
            <Button to="/contact#booking" variant="ghost">Book a visit</Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export { Link, SectionHead }
