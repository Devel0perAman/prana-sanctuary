import { useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'
import { Accordion, Button, Eyebrow, Img, Monogram, Reveal, SectionHead, Stars, initials, cx } from '../components/ui.jsx'
import { Chips, TrustRow, useCheckout } from '../components/Shared.jsx'
import { COURSES, COURSE_FAQ, COURSE_FILTERS, PLANS } from '../data/content.js'
import { CATALOG, formatINR } from '../../shared/catalog.js'
import { usePageMeta } from '../lib/hooks.js'
import { CardGrid, Counters, DayRhythm, FaqBlock, FeatureGrid, FilmBand, LoopVideo, MapBackdrop, Schedule, Steps, Timeline, VerseBand, CompareTable, Deva } from '../components/Sections.jsx'
import { GifBand, ImageSplit, PhotoStrip } from '../components/Blocks.jsx'
import { LEARN_RHYTHM, PHOTO_ROW } from '../data/rishikesh.js'
import { HOW_IT_WORKS, INCLUDED, PATHS } from '../data/extra.js'

export default function Courses() {
  usePageMeta('Online Courses', 'On-demand yoga, pranayama and somatic courses taught by master lineage practitioners. Pay securely with UPI, cards or netbanking.')
  const { buy, modal } = useCheckout()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('All')
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return COURSES.filter((c) => (filter === 'All' || c.topic === filter) && (!s || [c.title, c.text, c.teacher, c.style, c.topic, c.level].join(' ').toLowerCase().includes(s)))
  }, [q, filter])

  return (
    <main id="main">
      <header className="page-hero page-hero--split">
        <div className="wrap page-hero__grid">
          <div>
            <p className="eyebrow"><i className="eyebrow__dot" />On-demand streaming &amp; live practices</p>
            <h1 className="h1">Practice Anywhere. <em>Grow Every Day.</em></h1>
            <p className="lede">Immerse yourself in intentional somatics, deliberate sequencing and restorative breath architectures guided by master lineage practitioners from our Rishikesh sanctuary.</p>
          </div>
          <ul className="hero-counters"><li><Icon name="video" size={20} /><strong>48+</strong><span>Archived courses</span></li><li><Icon name="sun" size={20} /><strong>4× / wk</strong><span>Live mat streams</span></li></ul>
        </div>
        <div className="wrap">
          <div className="searchbar"><Icon name="search" size={18} />
            <label htmlFor="course-search" className="sr">Search courses</label>
            <input id="course-search" type="search" placeholder="Search by teacher, style or focus (e.g., hip opening, vinyasa, somatic nervous system)…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <Chips items={COURSE_FILTERS} value={filter} onChange={setFilter} label="Filter courses" />
        </div>
      </header>

      <section className="wrap sec sec--tight" id="catalog" aria-live="polite">
        <div className="sec-row"><div><Eyebrow>Curated Sequences</Eyebrow><h2 className="h2">Signature Learning Immersions</h2></div><p className="muted">Showing {list.length} master programme{list.length === 1 ? '' : 's'}</p></div>
        {list.length === 0 ? (
          <div className="empty"><Icon name="search" size={28} /><h3 className="h4">No courses match that search</h3><p>Try a broader word like “breath” or “flow”.</p><Button variant="ghost" onClick={() => { setQ(''); setFilter('All') }}>Clear filters</Button></div>
        ) : (
          <div className="grid grid--3">
            {list.map((c, i) => (
              <Reveal as="article" className="card card--lift course" key={c.id} delay={(i % 3) * 80}>
                <div className="card__media"><Img k={c.img} /><span className="tag tag--float">{c.level}</span>{c.badge && <span className="tag tag--solid">{c.badge}</span>}<span className="card__dur"><Icon name="clock" size={13} />{c.duration}</span><span className="card__dur card__dur--r">{c.lessons} Lessons</span></div>
                <div className="card__body">
                  <Stars value={c.rating} count={c.reviews} />
                  <h3 className="h4">{c.title}</h3><p>{c.text}</p>
                  <div className="card__author"><Monogram text={initials(c.teacher)} size={34} /><span><b>{c.teacher}</b><small>{c.role}</small></span></div>
                  <div className="card__buy"><strong>{formatINR(CATALOG[c.id].amount)}</strong><Button variant="primary" size="sm" icon="arrow-right" onClick={() => buy(c.id)}>Enrol now</Button></div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
        <Reveal className="live-banner">
          <span className="live-banner__icon"><Icon name="video" size={22} /></span>
          <div><small>Live transmission this Thursday</small><h3 className="h4">Full Moon Prana Kriya &amp; Sound Bath Journey</h3><p>Join Acharya Kavita &amp; guest harpist for an interactive 75-minute live evening practice. Includes live member Q&amp;A mat circle.</p></div>
          <div className="live-banner__when"><b>Thu, 18:30 IST</b><span>Live on Zoom • HD stream</span><Button to="/contact#booking" variant="terra" size="sm">Reserve Live Mat</Button></div>
        </Reveal>
      </section>

      <section className="wrap"><ul className="grid grid--3 metrics">
        {[['Weekly mindful rhythm', '3 of 4 Sessions', 75], ['Breath cadence metric', '5.2 bpm Avg', 88], ['Mastery accreditation', '48 Total Hours', 60]].map(([l, v, p]) => (
          <Reveal as="li" key={l} className="metric"><small>{l}</small><strong>{v}</strong><span className="bar"><i style={{ '--w': p + '%' }} /></span></Reveal>))}
      </ul><p className="muted metrics__note">Sample of the progress dashboard members see in their library.</p></section>

      <section className="wrap sec" id="how">
        <SectionHead eyebrow="How it works" hi="कैसे सीखें" title="From click" em="to child's pose." text="Four simple steps, and you are practising in your living room." />
        <Steps items={HOW_IT_WORKS} cols={4} />
      </section>

      <ImageSplit id="rhythm" img="rk-ganga" alt="A quiet bend of the Ganga" tag="Filmed in Rishikesh" eyebrow="Built for real life" reverse
        title="Three small practices" em="for every day."
        text="You do not need an hour. Our courses are cut into short, repeatable lessons that fit before work, between meetings or just before sleep."
        bullets={['5 to 30 minute lessons, never longer than a lunch break', 'Audio-only versions for walks and commutes', 'Downloads for the mountains, trains and bad Wi-Fi', 'Every lesson filmed on location in Rishikesh']} />

      <FilmBand clip="calm" eyebrow="Free preview" hi="पहले देखिए" title="Try a lesson" em="before you pay." text="Every course opens with a free preview lesson. Press play, roll out a mat and see if the teacher's voice feels like home."
        actions={<><Button href="#catalog" variant="peach" icon="arrow-right">Browse courses</Button><Button to="/contact#booking" variant="glass">Ask a teacher</Button></>} />

      <section className="wrap sec sec--tight" id="daily"><FeatureGrid items={LEARN_RHYTHM} cols={3} /></section>

      <section className="wrap sec" id="paths">
        <SectionHead eyebrow="Learning paths" hi="अपनी राह चुनिए" title="Not sure where" em="to begin?" text="Three curated roadmaps. Follow one end to end or mix and match." />
        <div className="grid grid--3">
          {PATHS.map((p, i) => (
            <Reveal as="article" key={p.title} delay={i * 80} className="card card--pad card--lift path">
              <Deva className="kicker kicker--hi">{p.hi}</Deva><h3 className="h3">{p.title}</h3><p className="muted">{p.for}</p>
              <ol className="path__steps">{p.steps.map((x) => <li key={x}>{x}</li>)}</ol>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap sec" id="plans">
        <SectionHead eyebrow="Sanctuary Memberships" title="One Pass. Unlimited Stillness." text="Transparent monthly and annual immersions. Pay securely for the period you choose — no hidden renewals." />
        <div className="grid grid--3 grid--pricing">
          {PLANS.map((p, i) => (
            <Reveal as="article" key={p.id} className={cx('plan', p.featured && 'plan--dark')} delay={i * 80}>
              {p.featured && <span className="plan__ribbon">Most revered</span>}
              <div className="plan__head"><h3 className="h4">{p.name}</h3>{p.save && <span className="tag">{p.save}</span>}</div>
              <div className="plan__amount"><strong>{formatINR(CATALOG[p.id].amount)}</strong><span>/ {p.per}</span></div>
              <p>{p.blurb}</p>
              <ul className="ticks">{p.features.map(([t, on]) => <li key={t} className={cx(!on && 'is-off')}><Icon name={on ? 'check' : 'x'} size={16} />{t}</li>)}</ul>
              <Button variant={p.featured ? 'terra' : 'ghost'} className="plan__cta" onClick={() => buy(p.id, { suffix: `for ${p.per === 'year' ? '12 months' : '1 month'}` })}>{p.cta}</Button>
            </Reveal>
          ))}
        </div>
        <Reveal className="pay-strip"><Icon name="lock" size={20} /><div><b>Trusted Indian &amp; global checkouts · 256-bit encrypted</b><span>Instant activation via UPI QR &amp; apps, Razorpay Secure (cards, netbanking, wallets) or international cards. GST invoicing available.</span></div>
          <ul><li>UPI / AutoPay</li><li>Razorpay</li><li>Cards &amp; Netbanking</li></ul></Reveal>
      </section>

      <section className="sec sec--tint" id="included"><div className="wrap">
        <SectionHead eyebrow="Every course includes" hi="साथ में क्या मिलेगा" title="Everything you need" em="to practise well." />
        <FeatureGrid items={INCLUDED} cols={3} />
      </div></section>

      <PhotoStrip items={PHOTO_ROW} />

      <VerseBand verse="mat" clip="reel-moon" />

      <GifBand gif="bg-dusk" eyebrow="Try before you pay" title="Seven days to decide." em="Full refund, no questions." text="Watch the free preview of any course, start learning and ask for your money back within seven days if it is not for you." actions={<Button href="#catalog" variant="peach" icon="arrow-right">Browse courses</Button>} />
      <Counters />

      <section className="sec sec--tint" id="faq"><div className="wrap wrap--narrow">
        <SectionHead eyebrow="Clear Guidance" title="Frequently Contemplated Questions" />
        <Accordion items={COURSE_FAQ} />
      </div></section>

      <section className="wrap sec"><Reveal className="pull-quote"><i /><p>“The mat is not an arena of performance, but an architectural container where the breath rearranges the spirit.”</p><small>PRĀNA Sanctuary Lineage Codex</small></Reveal></section>
      {modal}
    </main>
  )
}
