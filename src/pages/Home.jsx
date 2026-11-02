import { Link } from '../lib/router.jsx'
import Icon from '../components/Icon.jsx'
import HeroVideo from '../components/HeroVideo.jsx'
import { Button, Deva, Eyebrow, Img, Reveal, SectionHead, Stars, Monogram, initials } from '../components/ui.jsx'
import { CtaBand, TrustRow, useCheckout } from '../components/Shared.jsx'
import { CardGrid, Counters, DayRhythm, FaqBlock, FilmBand, Marquee, Schedule, Steps, VerseBand } from '../components/Sections.jsx'
import { DAY_RHYTHM, FIRST_CLASS, HOME_FAQ, JOURNAL, RETREATS, SCHEDULE } from '../data/extra.js'
import { COURSES, DISCIPLINES, HERO_BADGES, PHILOSOPHY, TESTIMONIALS } from '../data/content.js'
import { CATALOG, formatINR } from '../../shared/catalog.js'
import { usePageMeta } from '../lib/hooks.js'
import { GifBand, ImageSplit, PhotoStrip, PlaceCards, VisitBlock } from '../components/Blocks.jsx'
import { COHORTS, FAQ_TRAVEL, INTL, LEARN_RHYTHM, NEARBY, PHOTO_ROW, SAFETY, SEASONS, SEVA, STAY, WHY_RISHIKESH } from '../data/rishikesh.js'

export default function Home() {
  usePageMeta('', 'Find your balance. Studio classes, on-demand courses and Yoga Alliance teacher training in an architectural sanctuary beside the Ganga in Rishikesh, India.')
  const { buy, modal } = useCheckout()
  return (
    <main id="main">
      {/* HERO */}
      <section className="hero">
        <HeroVideo />
        <div className="wrap hero__body">
          <p className="live-chip"><i /> Live atelier in session <span>· 6:00 AM Ganga Dawn Meditation</span></p>
          <p className="hero__hi deva" lang="hi">॥ साँस में शांति, कदमों में संतुलन ॥</p>
          <h1 className="hero__title">Find Your Balance.<br /><em>Discover Your Inner Strength.</em></h1>
          <p className="hero__text">Reconnect with your mind, body and breath through authentic Himalayan lineages and physiological somatic alignment designed for every stage of your conscious evolution.</p>
          <div className="hero__actions">
            <Button to="/courses" variant="peach" size="lg" icon="arrow-right">Explore Yoga Courses</Button>
            <Button to="/about" variant="glass" size="lg">Discover Our Story</Button>
          </div>
          <TrustRow items={HERO_BADGES} />
        </div>
        <a className="hero__scroll" href="#philosophy" aria-label="Scroll to explore"><span>Explore Sanctuary</span><Icon name="chevron-down" size={18} /></a>
      </section>

      <Marquee />

      {/* PHILOSOPHY */}
      <section className="wrap sec split" id="philosophy">
        <Reveal className="split__media">
          <Img k="philosophy" className="img--tall" />
          <div className="float-card"><strong>Rooted in Tradition</strong><span>Evidence-aware somatic practice with Himalayan lineage at its core.</span></div>
        </Reveal>
        <div className="split__copy">
          <Reveal><Eyebrow>Our Philosophy <Deva className="deva--tag">· अपने भीतर की ओर</Deva></Eyebrow>
            <h2 className="h2">A Journey Towards a <em>Healthier, More Mindful You.</em></h2>
            <p className="lede">We reject the rush of performance-based yoga. Our teaching bridges ancient energetic anatomy with contemporary biomechanics, so every posture is a gateway to resilience, calm and sovereign inner stillness.</p></Reveal>
          <ul className="feature-list">
            {PHILOSOPHY.map((f, i) => (
              <Reveal as="li" key={f.title} delay={i * 90}><span className="feature-list__icon"><Icon name={f.icon} size={20} /></span><div><h3>{f.title}</h3><p>{f.text}</p></div></Reveal>
            ))}
          </ul>
          <Link to="/about" className="text-link">Read Our Full Lineage &amp; Philosophy <Icon name="arrow-right" size={16} /></Link>
        </div>
      </section>

      <VerseBand verse="breath" clip="reel-mist" />

      <ImageSplit id="why-rishikesh" img="rk-ganga" alt="The Ganga at sunrise" tag="Tapovan · Rishikesh" eyebrow="Why Rishikesh"
        title="Practise where yoga" em="has lived for centuries."
        text="PRĀNA sits in Tapovan, a short walk above the Ganga. Mornings begin with river mist and temple bells; evenings end with lamps on the water. It is hard to rush here, and that is the point."
        bullets={WHY_RISHIKESH}
        actions={<><Button to="/about" variant="primary" icon="arrow-right">Our story</Button><Button to="/contact#reach" variant="ghost">How to reach us</Button></>} />

      {/* DISCIPLINES */}
      <section className="sec sec--tint">
        <div className="wrap">
          <div className="sec-row">
            <SectionHead center={false} eyebrow="Sacred Offerings" hi="चार रास्ते, एक मंज़िल" title="Featured Disciplines" text="From vigorous building flows to meditative stillness, each discipline offers a distinct gateway to wellbeing." />
            <Link to="/courses" className="text-link">View All Practices <Icon name="arrow-right" size={16} /></Link>
          </div>
          <div className="grid grid--4">
            {DISCIPLINES.map((d, i) => (
              <Reveal as="article" className="card card--lift" key={d.title} delay={i * 80}>
                <div className="card__media"><Img k={d.img} /><span className="tag tag--float">{d.tag}</span></div>
                <div className="card__body"><Stars value={d.rating} /><h3 className="h4">{d.title}</h3><p>{d.text}</p><span className="card__foot">{d.level}</span></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PhotoStrip items={PHOTO_ROW} />

      <FilmBand clip="reel-dusk" eyebrow="The sanctuary in motion" hi="चलती तस्वीरें" title="Where the Ganga bends," em="the breath slows down."
        text="Step through the gate: cedar floors warming at sunrise, bowls humming in the Sound Dome, chai steaming under the pavilion and the river a few steps below. This is an ordinary day at PRĀNA."
        actions={<><Button to="/gallery" variant="peach" icon="arrow-right">Watch the gallery</Button><Button to="/contact#booking" variant="glass">Book a visit</Button></>} />

      {/* DAY RHYTHM */}
      <section className="wrap sec" id="rhythm">
        <SectionHead eyebrow="A day at the sanctuary" hi="दिनचर्या" title="Six moments," em="one unhurried day." text="You do not need to do it all. Come for one hour or stay the whole day — the rhythm is here whenever you are ready." />
        <DayRhythm items={DAY_RHYTHM} />
      </section>

      {/* AROUND RISHIKESH */}
      <section className="sec sec--tint"><div className="wrap">
        <SectionHead eyebrow="Around the sanctuary" title="Six things to do" em="in Rishikesh." text="Practice is only part of the trip. These are the walks, views and meals our students come back for." />
        <PlaceCards items={NEARBY} />
      </div></section>

      {/* TEACHER TRAINING */}
      <section className="wrap sec">
        <Reveal className="promo">
          <div className="promo__copy">
            <Eyebrow>Yoga Alliance Certified Workshops</Eyebrow>
            <h2 className="h2">Turn Your Passion for Yoga Into Your <em>Purpose.</em></h2>
            <p className="lede">Elevate your practice through internationally accredited 200H &amp; 300H Yoga Teacher Trainings. Vedic philosophy, anatomical precision and mentorship — with a hybrid format that fits your life.</p>
            <dl className="promo__facts">
              <div><dt>200H / 300H</dt><dd>Accredited RYS Curricula</dd></div>
              <div><dt>From ₹1,45,000</dt><dd>Instalments available</dd></div>
              <div><dt>1:8 ratio</dt><dd>Faculty to students</dd></div>
            </dl>
            <div className="promo__actions"><Button to="/yoga-career" variant="primary" icon="arrow-right">Apply for Teacher Training</Button><Button to="/yoga-career#apply" variant="ghost" iconLeft="download">Download 2026 Prospectus</Button></div>
          </div>
          <div className="promo__media"><Img k="group" /><span className="tag tag--float">Next cohort · Spring 2027</span></div>
        </Reveal>
      </section>

      {/* TIMETABLE */}
      <section className="wrap sec" id="timetable">
        <SectionHead eyebrow="Weekly timetable" hi="कक्षाओं का समय" title="Find your" em="hour on the mat." text="Studio and live-stream classes, every day. All times are Indian Standard Time (IST). Drop-ins welcome — no booking needed for most classes." />
        <Reveal><Schedule data={SCHEDULE} /></Reveal>
      </section>

      {/* ONLINE COURSES */}
      <section className="sec sec--tint">
        <div className="wrap">
          <SectionHead eyebrow="Practice Anywhere" hi="घर बैठे साधना" title="On-Demand Sanctuary Courses" text="Bring the sacred cadence of PRĀNA to your home space with beautifully filmed, cinematic multi-week programmes. Enrol once and learn at your own pace." />
          <div className="grid grid--3">
            {COURSES.slice(0, 3).map((c, i) => (
              <Reveal as="article" className="card card--lift" key={c.id} delay={i * 80}>
                <div className="card__media"><Img k={c.img} /><span className="tag tag--float">{c.level}</span></div>
                <div className="card__body">
                  <div className="card__meta"><Stars value={c.rating} count={c.reviews} /><span>{c.lessons} lessons</span></div>
                  <h3 className="h4">{c.title}</h3><p>{c.text}</p>
                  <div className="card__author"><Monogram text={initials(c.teacher)} size={34} /><span><b>{c.teacher}</b><small>{c.role}</small></span></div>
                  <div className="card__buy"><strong>{formatINR(CATALOG[c.id].amount)}</strong><Button variant="primary" size="sm" onClick={() => buy(c.id)}>Enrol now</Button></div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="trust-band"><Icon name="shield" size={22} /><p><strong>Bank-grade secure checkout.</strong> Pay with UPI, cards, netbanking or wallets through Razorpay. Cancel or refund within 7 days if the course isn't right for you.</p><Link to="/courses" className="text-link">See all 48 courses <Icon name="arrow-right" size={16} /></Link></Reveal>
        </div>
      </section>

      <Counters />

      {/* FIRST CLASS */}
      <section className="wrap sec">
        <SectionHead eyebrow="Your first class" hi="पहला क़दम" title="Nervous? Good." em="Everyone starts here." text="Four small steps, and you are on the mat. No experience, flexibility or special clothes required." />
        <Steps items={FIRST_CLASS} cols={4} />
      </section>

      {/* RETREATS */}
      <section className="sec sec--tint"><div className="wrap">
        <SectionHead eyebrow="Retreats & immersions" hi="कुछ दिन अपने नाम" title="Step away," em="come back lighter." text="Small groups, sattvic food and nothing to do but breathe. Three upcoming retreats — seats are limited to twelve." />
        <CardGrid items={RETREATS} kind="retreat" />
      </div></section>

      {/* STAY */}
      <section className="wrap sec" id="stay">
        <SectionHead eyebrow="Stay with us" title="Rooms, food" em="and one-to-one care." text="Spend a night, a week or a month. Everything on campus is simple, clean and a few steps from the shala." />
        <PlaceCards items={STAY} />
      </section>

      <GifBand gif="bg-aarti" eyebrow="Thursdays at dusk" title="Walk down to the Ganga aarti" em="with our teachers."
        text="Every Thursday we leave the shala at 5:45 PM and walk to the ghat together. Free for all students and retreat guests."
        actions={<><Button to="/contact#booking" variant="peach" icon="arrow-right">Join us this Thursday</Button><Button to="/gallery" variant="glass">See the gallery</Button></>} />

      {/* TESTIMONIALS */}
      <section className="wrap sec">
        <SectionHead eyebrow="Reflections & Impact" hi="साधकों की ज़ुबानी" title="Sanctuary Voices" text="Stories of renewal, deepened practice, liberation and inner equanimity from our community around the world." />
        <div className="grid grid--3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal as="figure" className="quote" key={t.name} delay={i * 80}>
              <div className="quote__stars" aria-label="5 out of 5">{[...Array(5)].map((_, n) => <Icon key={n} name="star" size={15} />)}</div>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption><Monogram text={initials(t.name)} /><span><b>{t.name}</b><small>{t.role}</small></span></figcaption>
            </Reveal>
          ))}
        </div>
      </section>

      <VerseBand verse="lamp" tone="terra" clip="reel-moon" />

      {/* JOURNAL */}
      <section className="wrap sec">
        <SectionHead eyebrow="The journal" hi="मन की बातें" title="Notes from" em="the mat." text="Short, practical reads from our teachers — breath, food, rest and the small habits that make practice stick." />
        <CardGrid items={JOURNAL} kind="journal" />
      </section>

      <FaqBlock items={HOME_FAQ} />

      <VisitBlock />

      <CtaBand eyebrow="14-day complimentary trial" title="Your Journey to" em="Wellbeing Starts Here."
        text="Step into our sanctuary online or in person. Your first week of live and on-demand practice is our gift — no card required."
        actions={<><Button to="/courses" variant="terra" size="lg" icon="arrow-right">Start Free 14-Day Trial</Button><Button to="/contact#hours" variant="glass" size="lg">View Weekly Class Schedule</Button></>}>
        <TrustRow items={[['check', 'No credit card needed'], ['check', 'Full library access'], ['check', 'Cancel anytime']]} />
      </CtaBand>
      {modal}
    </main>
  )
}
