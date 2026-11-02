import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { Button, Eyebrow, Field, Img, Monogram, Reveal, SectionHead, initials, cx } from '../components/ui.jsx'
import { ALUMNI, CAREER_PATHS, CAREER_STATS, PREREQS, SYLLABUS } from '../data/content.js'
import { useContactSubmit } from '../lib/useForm.js'
import { validateContact } from '../lib/validate.js'
import { usePageMeta } from '../lib/hooks.js'
import { CardGrid, Counters, DayRhythm, FaqBlock, FeatureGrid, FilmBand, LoopVideo, MapBackdrop, Schedule, Steps, Timeline, VerseBand, CompareTable, Deva } from '../components/Sections.jsx'
import { GifBand, ImageSplit, PhotoStrip, VisitBlock } from '../components/Blocks.jsx'
import { COHORTS, INTL, PHOTO_ROW, WHY_RISHIKESH } from '../data/rishikesh.js'
import { CAREER_FAQ, COMPARE, OUTCOMES, PAYMENT_STEPS, TRAINING_DAY } from '../data/extra.js'
import { useCheckout } from '../components/Shared.jsx'
import { CATALOG, formatINR } from '../../shared/catalog.js'

const INTAKES = ['200H Foundations — Spring 2027 (March 15 – June)', '300H Advanced — Autumn 2027', 'Mentorship & Residency (rolling)']

function ApplyForm() {
  const f = useContactSubmit({
    initial: { first: '', last: '', email: '', phone: '', track: INTAKES[0], message: '', brochure: true, website: '' },
    validate: (x) => { const e = validateContact({ ...x, name: `${x.first} ${x.last}`.trim() }, { phoneRequired: true }); if (!x.first.trim()) e.first = 'First name is required.'; if (!x.last.trim()) e.last = 'Last name is required.'; delete e.name; return e },
    toPayload: (x) => ({ name: `${x.first} ${x.last}`.trim(), email: x.email, phone: x.phone, topic: x.track, message: x.message, kind: 'application', website: x.website, matRequested: x.brochure }),
  })
  const { values: v, errors, status, onChange, submit, reset } = f
  const err = (k) => (errors[k] ? { 'aria-invalid': true, 'aria-describedby': `a-${k}-err` } : {})
  if (status.state === 'success') return (
    <div className="form-done" role="status"><span className="co-success__tick"><Icon name="check" size={30} strokeWidth={2.4} /></span>
      <h3 className="h3">Application received.</h3><p>Thank you, {v.first}. Our admissions team will email you within 2–3 working days to schedule your 30-minute interview.</p><Button variant="ghost" onClick={reset}>Submit another application</Button></div>
  )
  return (
    <form className="form form--card" onSubmit={submit} noValidate>
      <h3 className="h4">Reserve Your Mat for Upcoming Terms</h3><p className="form__sub">Submitting takes 2 minutes. Our registrar will respond within 48 business hours.</p>
      <div className="hp" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={v.website} onChange={onChange('website')} /></label></div>
      <div className="form__grid">
        <Field label="First name" id="a-first" required error={errors.first}><input id="a-first" value={v.first} onChange={onChange('first')} placeholder="Elena" autoComplete="given-name" {...err('first')} /></Field>
        <Field label="Last name" id="a-last" required error={errors.last}><input id="a-last" value={v.last} onChange={onChange('last')} placeholder="Rostova" autoComplete="family-name" {...err('last')} /></Field>
        <Field label="Email address" id="a-email" required error={errors.email}><input id="a-email" type="email" value={v.email} onChange={onChange('email')} placeholder="elena@example.com" autoComplete="email" {...err('email')} /></Field>
        <Field label="Phone number" id="a-phone" required error={errors.phone}><input id="a-phone" type="tel" value={v.phone} onChange={onChange('phone')} placeholder="+91 98765 43210" autoComplete="tel" {...err('phone')} /></Field>
      </div>
      <Field label="Intended track / cohort" id="a-track"><select id="a-track" value={v.track} onChange={onChange('track')}>{INTAKES.map((t) => <option key={t}>{t}</option>)}</select></Field>
      <Field label="Brief statement of intent / past experience" id="a-message" required error={errors.message}><textarea id="a-message" rows={4} value={v.message} onChange={onChange('message')} placeholder="Tell us about your practice and what you hope to teach…" {...err('message')} /></Field>
      <label className="check"><input type="checkbox" checked={v.brochure} onChange={onChange('brochure')} /><span>Send me the comprehensive PDF curriculum and financing guide.</span></label>
      <div role="alert" aria-live="assertive">{status.state === 'error' && <div className="notice notice--error"><Icon name="alert" size={18} /><div>{status.message}</div></div>}</div>
      <Button type="submit" variant="terra" size="lg" disabled={status.state === 'sending'}>{status.state === 'sending' ? 'Submitting…' : 'Submit Candidate Application'}</Button>
    </form>
  )
}

export default function Career() {
  usePageMeta('Yoga Career', 'Yoga Alliance-accredited 200-hour and 300-hour teacher trainings, plus a paid mentorship residency at PRĀNA Sanctuary.')
  const [tab, setTab] = useState(0)
  const { buy, modal } = useCheckout()
  const s = SYLLABUS[tab]
  return (
    <main id="main">
      <section className="hero-dark">
        <div className="wrap hero-dark__grid">
          <div>
            <p className="live-chip"><i /> Yoga Alliance certified 200H &amp; 300H programmes</p>
            <p className="hero__hi">Learn deeply. Teach honestly.</p>
            <h1 className="h1">Turn Your Passion for Yoga Into Your <em>Lifelong Purpose.</em></h1>
            <p className="lede">Comprehensive hybrid certifications combining classical Vedic philosophy, functional biomechanics, trauma-informed holding and tactile alignment architecture.</p>
            <div className="hero-dark__actions"><Button href="#apply" variant="terra" size="lg">Apply for Cohort</Button><Button href="#apply" variant="glass" size="lg" iconLeft="download">Download 2026 Prospectus</Button></div>
            <ul className="mini-stats"><li><strong>RYS 200/300</strong><span>Global Registry</span></li><li><strong>Hybrid Format</strong><span>Online &amp; Rishikesh</span></li><li><strong>1:8 Ratio</strong><span>Faculty : Mentor</span></li></ul>
          </div>
          <div className="hero-dark__media"><Img k="group" eager /><div className="float-card"><small>Lead Faculty</small><strong>Master Acharya Dev &amp; Dr. Elena Vance</strong><span>40+ combined years of somatic biomechanics &amp; lineage teaching.</span></div></div>
        </div>
      </section>

      <section className="wrap sec" id="programs">
        <SectionHead eyebrow="Curated Career Pathways" title="Accredited Teacher Training Pathways" text="Immersive experiential pedagogy structured around physiological integrity, conscious cueing and sustainable career architecture." />
        <div className="grid grid--3 grid--pricing">
          {CAREER_PATHS.map((p, i) => (
            <Reveal as="article" key={p.title} className={cx('plan', p.featured && 'plan--featured')} delay={i * 80}>
              {p.featured && <span className="plan__ribbon">Most popular advanced</span>}
              <div className="plan__tier"><span>{p.tier}</span><small>{p.meta}</small></div>
              <h3 className="h4">{p.title}</h3><p>{p.text}</p>
              <div className="plan__price"><small>Investment</small><strong>{p.price}</strong><span>{p.note}</span></div>
              <ul className="ticks">{p.points.map((x) => <li key={x}><Icon name="check" size={16} />{x}</li>)}</ul>
              <Button href="#apply" variant={p.featured ? 'terra' : 'primary'} className="plan__cta">{p.cta}</Button>
              {p.deposit && <Button variant="ghost" className="plan__cta" iconLeft="shield" onClick={() => buy(p.deposit)}>Reserve seat · {formatINR(CATALOG[p.deposit].amount)}</Button>}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap sec" id="compare">
        <SectionHead eyebrow="Compare programmes" hi="कौन-सा रास्ता आपका?" title="Find the track" em="that fits you." text="Same faculty, same sanctuary — different depth. Not sure? Book a free call with admissions." />
        <Reveal><CompareTable data={COMPARE} /></Reveal>
      </section>

      <section className="sec sec--tint"><div className="wrap">
        <div className="sec-row"><SectionHead center={false} eyebrow="In-Depth Modules" title="Comprehensive" em="4-Pillar Syllabus" text="Designed in accordance with the Yoga Alliance standards, elevated through individual mentorship and modern evidence-aware scholarship." /></div>
        <div className="tabs" role="tablist" aria-label="Syllabus pillars">
          {SYLLABUS.map((t, i) => <button key={t.tab} role="tab" id={`tab-${i}`} aria-selected={tab === i} aria-controls="tabpanel" tabIndex={tab === i ? 0 : -1} className={cx('tab', tab === i && 'is-on')}
            onClick={() => setTab(i)} onKeyDown={(e) => { if (e.key === 'ArrowRight') setTab((tab + 1) % SYLLABUS.length); if (e.key === 'ArrowLeft') setTab((tab - 1 + SYLLABUS.length) % SYLLABUS.length) }}>{t.tab}</button>)}
        </div>
        <div className="syllabus" role="tabpanel" id="tabpanel" aria-labelledby={`tab-${tab}`} key={tab}>
          <div className="syllabus__copy"><small className="kicker">{s.label}</small><h3 className="h3">{s.title}</h3><p>{s.text}</p>
            <ul className="syllabus__items">{s.items.map(([t, d]) => <li key={t}><Icon name="check" size={16} /><div><b>{t}</b><span>{d}</span></div></li>)}</ul></div>
          <div className="syllabus__media"><Img k={s.img} /></div>
        </div>
      </div></section>

      <VerseBand verse="guru" tone="terra" clip="reel-dusk" />

      <ImageSplit id="life" img="rk-yogapeeth" alt="Warrior pose in the shala" tag="Rishikesh immersion" eyebrow="Train in the yoga capital"
        title="Live the practice," em="not just study it."
        text="The in-person weeks happen on our Tapovan campus. You will wake with the river, practise in the shala, eat from our kitchen garden and fall asleep to the sound of the Ganga."
        bullets={['Shared garden room and three sattvic meals daily included', 'Evening satsang with senior teachers', 'Weekend trips to Haridwar, the ghats and nearby waterfalls', 'Airport and railway pickup arranged for you']}
        actions={<Button href="#apply" variant="terra" icon="arrow-right">Apply for a cohort</Button>} />

      <section className="wrap sec" id="cohorts">
        <SectionHead eyebrow="Upcoming cohorts" title="Next batches" em="at the sanctuary." text="Cohorts are capped at sixteen. Reserve a seat early to lock in instalments." />
        <Timeline items={COHORTS} />
      </section>

      <section className="wrap sec" id="day">
        <SectionHead eyebrow="A day in the training" hi="प्रशिक्षण की एक सुबह" title="From first breath" em="to evening satsang." text="Immersion weeks follow a gentle but full rhythm. Online weeks are lighter: two evenings and one weekend morning." />
        <Timeline items={TRAINING_DAY} />
      </section>

      <section className="wrap sec">
        <ul className="grid grid--4 stats-cards">{CAREER_STATS.map((c, i) => (
          <Reveal as="li" key={c.label} className={cx('stat-card', c.dark && 'stat-card--dark')} delay={i * 70}><Icon name={c.icon} size={22} /><strong>{c.value}</strong><b>{c.label}</b><span>{c.text}</span></Reveal>))}</ul>
      </section>

      <section className="sec sec--tint"><div className="wrap">
        <SectionHead eyebrow="Alumni Voices" title="From Sanctuary Cohort to" em="Studio Leadership" text="Over 5 years of continuous teacher training." />
        <div className="grid grid--3">{ALUMNI.map((t, i) => (
          <Reveal as="figure" className="quote" key={t.name} delay={i * 80}><div className="quote__stars">{[...Array(5)].map((_, n) => <Icon key={n} name="star" size={15} />)}</div><blockquote>“{t.quote}”</blockquote><figcaption><Monogram text={initials(t.name)} /><span><b>{t.name}</b><small>{t.role}</small></span></figcaption></Reveal>))}</div>
      </div></section>

      <section className="sec sec--tint" id="outcomes"><div className="wrap">
        <SectionHead eyebrow="After certification" hi="आगे की राह" title="Six ways" em="to build a career." text="Our graduates teach in studios, lead retreats, work online and in corporate wellbeing. You choose the shape of your path." />
        <FeatureGrid items={OUTCOMES} cols={3} />
      </div></section>

      <PhotoStrip items={PHOTO_ROW} />

      <section className="sec sec--tint" id="international"><div className="wrap">
        <SectionHead eyebrow="Coming from abroad" title="Support for" em="international students." text="Students from more than thirty countries have trained with us. We help with the paperwork so you can focus on practice." />
        <FeatureGrid items={INTL} cols={4} />
      </div></section>

      <section className="wrap sec" id="how-to-join">
        <SectionHead eyebrow="How enrolment works" hi="प्रवेश की राह" title="Four steps," em="no surprises." />
        <Steps items={PAYMENT_STEPS} cols={4} />
      </section>

      <FaqBlock items={CAREER_FAQ} />

      <GifBand gif="bg-mist" eyebrow="Applications open" title="Your seat is waiting" em="above the Ganga." text="Fill the short form below. Our admissions teacher will call you within 48 hours." actions={<Button href="#apply" variant="peach" icon="arrow-right">Start application</Button>} />

      <section className="wrap sec" id="apply">
        <div className="apply">
          <Reveal className="apply__copy"><Eyebrow>Cohort Admissions 2026</Eyebrow><h2 className="h2">Application &amp; <em>Scholarship Portal</em></h2>
            <p className="lede">We maintain intimate cohorts capped at 16 practitioners per track to ensure dedicated personalised mentoring, posture hands-on supervision and voice calibration.</p>
            <ul className="prereq">{PREREQS.map(([t, d]) => <li key={t}><Icon name="check" size={18} /><div><b>{t}</b><span>{d}</span></div></li>)}</ul></Reveal>
          <Reveal delay={100}><ApplyForm /></Reveal>
        </div>
      </section>
      <VisitBlock />
      {modal}
    </main>
  )
}
