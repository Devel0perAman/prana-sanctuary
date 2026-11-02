import Icon from '../components/Icon.jsx'
import ContactForm from '../components/ContactForm.jsx'
import { Accordion, Button, PageHero, Reveal, SectionHead } from '../components/ui.jsx'
import { HOME_STATS, ETIQUETTE, CONTACT_FAQ } from '../data/content.js'
import { SITE } from '../data/site.js'
import { useConfig } from '../lib/config.jsx'
import { usePageMeta } from '../lib/hooks.js'
import { CardGrid, Counters, DayRhythm, FaqBlock, FeatureGrid, FilmBand, LoopVideo, MapBackdrop, Schedule, Steps, Timeline, VerseBand, CompareTable, Deva } from '../components/Sections.jsx'
import { GifBand, PlaceCards } from '../components/Blocks.jsx'
import { FAQ_TRAVEL, NEARBY, SAFETY, SEASONS, STAY } from '../data/rishikesh.js'
import { REACH, TEAM_CONTACTS, SCHEDULE } from '../data/extra.js'
import { LiveMap } from '../components/Sections.jsx'

const { lat, lon } = SITE.coords
const MAP = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.02}%2C${lat - 0.012}%2C${lon + 0.02}%2C${lat + 0.012}&layer=mapnik&marker=${lat}%2C${lon}`

export default function Contact() {
  usePageMeta('Contact Us', 'Book a class, ask about teacher training or plan a private retreat at PRĀNA Sanctuary in Tapovan, Rishikesh, Uttarakhand.')
  const { whatsappNumber } = useConfig()
  return (
    <main id="main">
      <PageHero eyebrow="Connect with our sanctuary" hi="आइए, बात करें" title="Let's Begin Your Yoga Journey." text="Have questions about studio classes, teacher training cohorts, or private wellness retreats? We welcome you to reach out or visit our Rishikesh sanctuary." />

      <section className="wrap"><ul className="grid grid--4 info-cards">{HOME_STATS.map(([v, t, d], i) => (
        <Reveal as="li" key={t} className="info-card" delay={i * 60}><Icon name={['home', 'clock', 'users', 'map-pin'][i]} size={20} /><b>{i === 3 ? v : `${v} ${t}`}</b><span>{d}</span></Reveal>))}</ul></section>

      <section className="wrap sec sec--tight contact" id="booking">
        <Reveal className="card card--form">
          <div className="card--form__head"><div><small className="kicker">Immediate dispatch</small><h2 className="h3">Sanctuary Inquiry &amp; Booking</h2></div><span className="round-icon"><Icon name="send" size={18} /></span></div>
          <ContactForm />
        </Reveal>

        <aside className="contact__side">
          <Reveal className="card card--pad">
            <small className="kicker">Sanctuary address</small><h2 className="h3">Rishikesh Shala &amp; Gardens</h2>
            <ul className="contact-list">
              <li><Icon name="map-pin" size={18} /><span>{SITE.address[0]}<br />{SITE.address[1]}</span></li>
              <li><Icon name="phone" size={18} /><a href={SITE.phoneHref}>{SITE.phone}</a></li>
              <li><Icon name="mail" size={18} /><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              {whatsappNumber && <li><Icon name="whatsapp" size={18} /><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></li>}
            </ul>
            <div className="map"><LiveMap src={MAP} />
              <a className="btn btn--glass btn--sm map__dir" href={`https://www.openstreetmap.org/directions?to=${lat}%2C${lon}`} target="_blank" rel="noopener noreferrer"><span>Get Directions</span><Icon name="arrow-up-right" size={16} /></a></div>
          </Reveal>

          <Reveal className="card card--pad" id="hours">
            <div className="hours__head"><h2 className="h4">Studio Operating Hours</h2><span className="open"><i />Open Today</span></div>
            <dl className="hours">{SITE.hours.map(([d, t]) => <div key={d}><dt>{d}</dt><dd>{t}</dd></div>)}</dl>
          </Reveal>

          <Reveal className="card card--pad card--tint">
            <h2 className="h4"><Icon name="leaf" size={18} /> Arrival &amp; Etiquette</h2>
            <ul className="etiquette">{ETIQUETTE.map(([i, t]) => <li key={t}><Icon name={i} size={16} /><span>{t}</span></li>)}</ul>
          </Reveal>
        </aside>
      </section>

      <section className="wrap sec" id="timetable">
        <SectionHead eyebrow="Weekly timetable" hi="कक्षाओं का समय" title="Drop in" em="any day." text="No booking needed for most classes. Arrive 15 minutes early and we will set up a mat for you." />
        <Reveal><Schedule data={SCHEDULE} /></Reveal>
      </section>

      <section className="sec sec--tint" id="reach"><div className="wrap">
        <SectionHead eyebrow="Getting here" hi="रास्ता" title="Reaching" em="the sanctuary." text="Rishikesh sits at the foot of the Himalaya, 25 km from Dehradun airport and 20 km from Haridwar station. Tell us how you are travelling and we will help." />
        <FeatureGrid items={REACH} cols={4} />
      </div></section>

      <section className="wrap sec" id="seasons">
        <SectionHead eyebrow="When to come" title="Four seasons" em="in the foothills." text="Rishikesh is lovely all year if you pack for it." />
        <FeatureGrid items={SEASONS} cols={4} />
      </section>

      <section className="sec sec--tint" id="stay"><div className="wrap">
        <SectionHead eyebrow="Stay with us" title="Rooms, food" em="and private sessions." />
        <PlaceCards items={STAY} />
      </div></section>

      <section className="wrap sec" id="nearby">
        <SectionHead eyebrow="Nearby" title="Walks, views" em="and slow meals." text="A few of the places our team sends every new guest." />
        <PlaceCards items={NEARBY.slice(0, 3)} />
      </section>

      <section className="wrap sec" id="team">
        <SectionHead eyebrow="Talk to a person" hi="हम सुन रहे हैं" title="Who to" em="write to." />
        <div className="team">{TEAM_CONTACTS.map(([n, r, hi, em, ph], i) => (
          <Reveal as="article" key={n} delay={i * 80} className="team__card"><Deva>{hi}</Deva><h3 className="h4">{n}</h3><p>{r}</p>
            <a href={`mailto:${em}`}><Icon name="mail" size={16} />{em}</a><a href={`tel:${ph.replace(/[^+\d]/g, '')}`}><Icon name="phone" size={16} />{ph}</a></Reveal>))}</div>
      </section>

      <section className="wrap sec" id="safe">
        <SectionHead eyebrow="Travelling to us" title="Safe, simple" em="and well looked after." />
        <FeatureGrid items={SAFETY} cols={4} />
      </section>

      <section className="sec sec--tint"><div className="wrap">
        <SectionHead eyebrow="Common inquiries" title="Frequently Asked Questions" text="Everything you need to know before unrolling your mat in our space." />
        <div className="wrap--narrow"><Accordion items={[...CONTACT_FAQ, ...FAQ_TRAVEL]} /></div>
        <p className="center muted">Have an inquiry not answered above? <a href="#booking" className="text-link">Write directly to our Sanctuary Concierge</a></p>
      </div></section>

      <GifBand gif="bg-mist" eyebrow="Say namaste" title="We reply within" em="one working day." text="Message us on WhatsApp, call the front desk or fill the form above." actions={<Button href={SITE.phoneHref} variant="peach" icon="phone">Call the desk</Button>} />

      <VerseBand verse="ganga" clip="calm" />

      <section className="wrap sec"><Reveal className="cta-slim">
        <div><small className="kicker">Immediate mat reservation</small><h2 className="h3">Reserve a mat for today's evening session</h2><p>View real-time shala capacity, upcoming guest masters, and choose your preferred space.</p></div>
        <div className="cta-slim__actions"><Button to="/courses" variant="primary">Explore Schedule</Button><Button href={SITE.phoneHref} variant="ghost">Call Studio Desk</Button></div>
      </Reveal></section>
    </main>
  )
}
