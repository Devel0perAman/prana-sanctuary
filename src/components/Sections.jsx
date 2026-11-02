// Reusable section blocks for every page. Copy lives in src/data/extra.js.
import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { Link } from '../lib/router.jsx'
import { Accordion, Button, Deva, Eyebrow, Img, Reveal, SectionHead, cx } from './ui.jsx'
import { useInView, useMediaQuery } from '../lib/hooks.js'
import { COUNTERS, MARQUEE, VERSES } from '../data/extra.js'

/** Animated decoration: drifting petals + a slowly rotating mandala. Pure CSS/SVG, pauses for reduced-motion. */
export function Ambient({ mandala = true, petals = 9, className = '' }) {
  return (
    <div className={cx('ambient', className)} aria-hidden="true">
      {mandala && (
        <svg className="ambient__mandala" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth=".6">
          {[...Array(12)].map((_, i) => <ellipse key={i} cx="100" cy="52" rx="13" ry="40" transform={`rotate(${i * 30} 100 100)`} />)}
          {[...Array(8)].map((_, i) => <ellipse key={'b' + i} cx="100" cy="68" rx="8" ry="26" transform={`rotate(${i * 45 + 22.5} 100 100)`} />)}
          <circle cx="100" cy="100" r="96" /><circle cx="100" cy="100" r="60" strokeDasharray="2 4" /><circle cx="100" cy="100" r="14" />
        </svg>
      )}
      {[...Array(petals)].map((_, i) => <i key={i} className="petal" style={{ '--i': i, '--x': `${(i * 37) % 100}%`, '--dur': `${14 + (i % 5) * 3}s`, '--delay': `${-i * 2.3}s`, '--sz': `${10 + (i % 4) * 5}px` }} />)}
    </div>
  )
}

/** Looping muted video (webm first, mp4 fallback). Plays only while on-screen; honours reduced-motion. */
export function LoopVideo({ name, poster, className = '', eager = false, ...rest }) {
  const ref = useRef(null)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [live, setLive] = useState(eager)
  useEffect(() => {
    const v = ref.current; if (!v || !('IntersectionObserver' in window)) return setLive(true)
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setLive(true); if (!reduced) v.play?.().catch(() => {}) } else v.pause?.()
    }, { threshold: 0.2 })
    io.observe(v); return () => io.disconnect()
  }, [reduced])
  return (
    <video ref={ref} className={cx('loopvideo', className)} muted loop playsInline preload={live ? 'auto' : 'none'} poster={poster} aria-hidden="true" tabIndex={-1} {...rest}>
      {live && <><source src={`/media/${name}.webm`} type="video/webm" /><source src={`/media/${name}.mp4`} type="video/mp4" /></>}
    </video>
  )
}

/** Full-bleed Hindi line over an animated background. */
export function VerseBand({ verse = 'breath', tone = 'olive', clip }) {
  const v = typeof verse === 'string' ? VERSES[verse] : verse
  return (
    <section className={cx('verse', `verse--${tone}`)} aria-label="A line from the sanctuary">
      {clip && <LoopVideo name={clip} className="verse__video" />}
      <Ambient petals={7} />
      <Reveal className="wrap verse__inner">
        <span className="verse__om" aria-hidden="true">ॐ</span>
        <blockquote lang={v.hi ? 'hi' : 'en'} className={cx('verse__line', v.hi ? 'deva' : 'verse__line--en')}>{(v.hi || v.en).split('\n').map((l, i) => <span key={i}>{l}</span>)}</blockquote>
        <p className="verse__by">— {v.by}</p>
      </Reveal>
    </section>
  )
}

/** Looping film band with overlay copy. */
export function FilmBand({ clip = 'reel-dusk', eyebrow, hi, title, em, text, actions }) {
  return (
    <section className="film">
      <LoopVideo name={clip} className="film__video" />
      <div className="film__shade" />
      <div className="wrap film__body">
        <Reveal>
          {eyebrow && <Eyebrow className="eyebrow--light">{eyebrow}{hi && <Deva className="deva--tag"> · {hi}</Deva>}</Eyebrow>}
          <h2 className="h2">{title} {em && <em>{em}</em>}</h2>
          {text && <p className="lede">{text}</p>}
          {actions && <div className="film__actions">{actions}</div>}
        </Reveal>
      </div>
    </section>
  )
}

/** Endless scrolling strip of Hindi + English words. */
export function Marquee({ items = MARQUEE }) {
  const row = items.map((w, i) => <span key={i} lang="en">{w}<i aria-hidden="true">✦</i></span>)
  return <div className="marquee" aria-hidden="true"><div className="marquee__track"><div>{row}</div><div>{row}</div></div></div>
}

function Count({ to, suffix }) {
  const [ref, seen] = useInView()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(to)
    let raf; const t0 = performance.now(), D = 1400
    const tick = (t) => { const p = Math.min(1, (t - t0) / D); setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf)
  }, [seen, to])
  return <strong ref={ref}>{n.toLocaleString('en-IN')}{suffix}</strong>
}

export function Counters({ items = COUNTERS }) {
  return (
    <section className="counters"><Ambient mandala={false} petals={5} />
      <ul className="wrap counters__row">{items.map(([v, s, l, hi]) => <Reveal as="li" key={l}><Count to={v} suffix={s} /><span>{l}</span></Reveal>)}</ul>
    </section>
  )
}

/** Numbered step cards. items: [title, hindi, text] or [title, text] */
export function Steps({ items, cols = 4 }) {
  return (
    <ol className={cx('steps', `steps--${cols}`)}>
      {items.map((it, i) => {
        const [title, a, b] = it; const hi = b ? a : null; const text = b || a
        return <Reveal as="li" key={title} delay={i * 80} className="step"><span className="step__n">{String(i + 1).padStart(2, '0')}</span>{hi && <Deva className="step__hi">{hi}</Deva>}<h3 className="h4">{title}</h3><p>{text}</p></Reveal>
      })}
    </ol>
  )
}

/** Vertical timeline. items: [label, title, text] */
export function Timeline({ items }) {
  return (
    <ol className="tl">
      {items.map(([k, t, p], i) => <Reveal as="li" key={k + t} delay={i * 70} className="tl__item"><span className="tl__k">{k}</span><div><h3 className="h4">{t}</h3><p>{p}</p></div></Reveal>)}
    </ol>
  )
}

/** Icon feature grid. items: [icon, title, (hindi,) text] */
export function FeatureGrid({ items, cols = 3 }) {
  return (
    <ul className={cx('fgrid', `fgrid--${cols}`)}>
      {items.map((it, i) => {
        const [icon, title, a, b] = it; const hi = b ? a : null; const text = b || a
        return <Reveal as="li" key={title} delay={i * 60} className="fgrid__item"><span className="fgrid__icon"><Icon name={icon} size={22} /></span><h3 className="h4">{title}{hi && <Deva className="fgrid__hi"> {hi}</Deva>}</h3><p>{text}</p></Reveal>
      })}
    </ul>
  )
}

/** Day rhythm cards. */
export function DayRhythm({ items }) {
  return (
    <ol className="rhythm">
      {items.map(([time, title, hi, text, icon], i) => (
        <Reveal as="li" key={time} delay={i * 70} className="rhythm__item">
          <span className="rhythm__time">{time}</span><span className="rhythm__icon"><Icon name={icon} size={20} /></span>
          <Deva className="rhythm__hi">{hi}</Deva><h3 className="h4">{title}</h3><p>{text}</p>
        </Reveal>
      ))}
    </ol>
  )
}

/** Timetable with weekday/weekend tabs. */
export function Schedule({ data }) {
  const keys = Object.keys(data); const [k, setK] = useState(keys[0])
  return (
    <div className="sched">
      <div className="tabs" role="tablist" aria-label="Timetable days">
        {keys.map((x) => <button key={x} role="tab" aria-selected={k === x} className={cx('tab', k === x && 'is-on')} onClick={() => setK(x)}>{x}</button>)}
      </div>
      <div className="sched__table" role="table" aria-label={`Timetable ${k}`}>
        <div className="sched__row sched__row--head" role="row"><span>Time</span><span>Practice</span><span>Teacher</span><span>Level</span><span>Where</span></div>
        {data[k].map(([t, p, who, lv, where]) => (
          <div className="sched__row" role="row" key={t + p}><b>{t}</b><span className="sched__p">{p}</span><span>{who}</span><span><i className="pill">{lv}</i></span><span>{where}</span></div>
        ))}
      </div>
    </div>
  )
}

export function CompareTable({ data }) {
  return (
    <div className="cmp" role="table" aria-label="Programme comparison">
      <div className="cmp__row cmp__row--head" role="row">{data.head.map((h, i) => <span key={i} role="columnheader">{h}</span>)}</div>
      {data.rows.map((r) => <div className="cmp__row" role="row" key={r[0]}>{r.map((c, i) => <span key={i} role={i ? 'cell' : 'rowheader'} data-label={data.head[i]}>{c}</span>)}</div>)}
    </div>
  )
}

/** Retreat / journal style cards. */
export function CardGrid({ items, kind = 'retreat' }) {
  return (
    <div className="grid grid--3">
      {items.map((x, i) => (
        <Reveal as="article" key={x.title} delay={i * 80} className="card card--lift">
          <div className="card__media"><Img k={x.img} /><span className="tag tag--float">{x.tag}</span></div>
          <div className="card__body">
            <Deva className="kicker kicker--hi">{x.hi}</Deva>
            <h3 className="h4">{x.title}</h3><p>{x.text}</p>
            {kind === 'retreat'
              ? <div className="card__buy"><span><small>{x.date}</small><strong>{x.price}</strong></span><Button to="/contact#booking" variant="primary" size="sm" icon="arrow-right">Enquire</Button></div>
              : <span className="card__foot">{x.mins} min read</span>}
          </div>
        </Reveal>
      ))}
    </div>
  )
}

export function FaqBlock({ items, eyebrow = 'Clear guidance', hi = 'मन के सवाल', title = 'Frequently', em = 'Asked Questions', tint = true }) {
  return (
    <section className={cx('sec', tint && 'sec--tint')}><div className="wrap wrap--narrow">
      <SectionHead eyebrow={eyebrow} hi={hi} title={title} em={em} />
      <Reveal><Accordion items={items} /></Reveal>
    </div></section>
  )
}

/** Illustrated map backdrop (always visible, even if the embedded map is blocked/offline). */
export function MapBackdrop() {
  return (
    <svg className="map__art" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="260" fill="#dfe9c8" />
      <path d="M0 190c60-30 90 10 150-10s90-50 150-20 70 10 100-10V260H0z" fill="#c6d8a4" />
      <path d="M0 215c70-20 110 15 180-5s100-30 220 5V260H0z" fill="#aac27f" />
      <path d="M-10 60c80 20 120-30 200 0s130 30 220-10" stroke="#9dc3c9" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M40 0c20 70 60 90 70 160M250 0c-10 50 20 90 60 130M0 120h400" stroke="#fff" strokeWidth="5" fill="none" opacity=".8" />
      <g transform="translate(205 118)"><circle r="22" fill="#8c3a1c" opacity=".18" className="map__pulse" /><path d="M0-22c-9 0-16 7-16 16 0 12 16 28 16 28s16-16 16-28c0-9-7-16-16-16z" fill="#8c3a1c" /><circle cy="-6" r="5.5" fill="#fff" /></g>
    </svg>
  )
}

/** Illustrated map that loads the real (OpenStreetMap) embed only on request — never blank, no third-party call until asked. */
export function LiveMap({ src }) {
  const [on, setOn] = useState(false)
  return (
    <>
      <MapBackdrop />
      {on
        ? <iframe title="Map showing PRĀNA Sanctuary" src={src} loading="lazy" referrerPolicy="no-referrer" />
        : <button type="button" className="map__load btn btn--primary btn--sm" onClick={() => setOn(true)}><Icon name="map-pin" size={16} /><span>View interactive map</span></button>}
    </>
  )
}

export { Deva, Link }
