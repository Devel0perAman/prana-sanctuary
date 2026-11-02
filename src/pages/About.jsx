import Icon from '../components/Icon.jsx'
import { Button, Eyebrow, Img, PageHero, Reveal, SectionHead, Monogram } from '../components/ui.jsx'
import { CtaBand } from '../components/Shared.jsx'
import { ABOUT_STATS, FACULTY, METHOD, SPACES } from '../data/content.js'
import { SITE } from '../data/site.js'
import { usePageMeta } from '../lib/hooks.js'
import { CardGrid, Counters, DayRhythm, FaqBlock, FeatureGrid, FilmBand, LoopVideo, MapBackdrop, Schedule, Steps, Timeline, VerseBand, CompareTable, Deva } from '../components/Sections.jsx'
import { GifBand, ImageSplit, PhotoStrip, PlaceCards, VisitBlock } from '../components/Blocks.jsx'
import { PHOTO_ROW, SEASONS, SEVA, WHY_RISHIKESH } from '../data/rishikesh.js'
import { ABOUT_FAQ, DAY_RHYTHM, RETREATS, TIMELINE, VALUES } from '../data/extra.js'
const CAMPUS_COUNTERS = [[14, ' acres', 'Native orchard & gardens', ''], [100, '%', 'Solar & spring water', 'सौर ऊर्जा'], [0, '', 'Single-use plastics', 'प्लास्टिक मुक्त'], [3, ' t', 'Compost every season', 'खाद']]

export default function About() {
  usePageMeta('About Us', 'Our lineage, our method and the spaces crafted for resonance at PRĀNA Sanctuary in Tapovan, Rishikesh.')
  return (
    <main id="main">
      <PageHero className="page-hero--center" eyebrow="Our Philosophy & Lineage" hi="जड़ें प्राचीन, दृष्टि आधुनिक" title="Rooted in Ancient Wisdom," em="Crafted for Modern Living.">
        <p className="lede">Set above the Ganga in Tapovan, the yoga capital of the world, PRĀNA is an architectural sanctuary designed to harmonise timeless Himalayan yogic lineages with contemporary somatic neuroscience.</p>
        <div className="page-hero__actions"><Button href="#founder" variant="primary" icon="arrow-right">Discover the Lineage</Button><Button href="#spaces" variant="ghost">Explore the Sanctuaries</Button></div>
      </PageHero>

      <section className="wrap"><ul className="stat-row">{ABOUT_STATS.map(([v, l]) => <Reveal as="li" key={l}><strong>{v}</strong><span>{l}</span></Reveal>)}</ul></section>

      <VerseBand verse="return" clip="reel-mist" />

      <section className="wrap sec split" id="founder">
        <Reveal className="split__media">
          <Img k="founder" className="img--tall" />
          <div className="float-card float-card--dark"><small>Sanctuary Founder</small><strong>Devi Ananda Thorne</strong><span>Advaita Vedanta &amp; Ultrasuda · 28 Years of Practice</span></div>
        </Reveal>
        <div className="split__copy">
          <Reveal><Eyebrow>The Founder's Vision</Eyebrow><h2 className="h2">A Heritage Transmitted <em>Across Rivers.</em></h2>
            <p className="lede">Founded under the auspicious guidance of Himalayan master Swami Vivekananda Parampara, PRĀNA emerged from a vow to preserve the energetic integrity of traditional Kundalini and Hatha practice — while keeping every class accessible, anatomically intelligent and kind.</p>
            <p>What began as six mats under a mango tree near the river is now a campus of earth-built shalas, herb gardens and a spring-fed tea pavilion, held by a community of resident teachers who have spent decades in devoted practice.</p></Reveal>
        </div>
      </section>

      <ImageSplit id="rishikesh" img="rk-bridge" alt="Footbridge over the Ganga at dawn" tag="Rishikesh, Uttarakhand" eyebrow="Our home" reverse
        title="A small town" em="on a big river."
        text="Rishikesh is where the Ganga leaves the mountains and meets the plains. Sages have meditated on these banks for thousands of years; today it is also a place for climbers, rafters, musicians and anyone who needs to slow down."
        bullets={WHY_RISHIKESH} />

      <section className="wrap sec" id="journey">
        <SectionHead eyebrow="Our journey" hi="सफ़र के पड़ाव" title="Twenty-six years," em="one unbroken thread." text="From six mats above a spice shop to a fourteen-acre sanctuary — a short history of how PRĀNA grew, slowly and on purpose." />
        <Timeline items={TIMELINE} />
      </section>

      <section className="sec sec--tint"><div className="wrap">
        <SectionHead eyebrow="Our Foundations" title="Our Methodological" em="Foundation" text="We reject performance-based practice. Our curriculum bridges ancient energetic anatomy with peer-reviewed biomechanics to restore inner regulation by homeostasis." />
        <div className="grid grid--4">{METHOD.map(([t, d], i) => <Reveal key={t} className="card card--pad card--lift" delay={i * 80}><span className="num">{t.slice(0, 2)}</span><h3 className="h4">{t.slice(4)}</h3><p>{d}</p></Reveal>)}</div>
      </div></section>

      <section className="wrap sec" id="spaces">
        <SectionHead eyebrow="Architectural Elements" title="Spaces Crafted for" em="Resonance" text="Built with reclaimed cypress, clay plaster and non-toxic earthen finishes to naturally amplify acoustic and energetic calm." />
        <div className="grid grid--3">
          {SPACES.map((s, i) => (
            <Reveal as="article" className="card card--lift" key={s.title} delay={i * 80}>
              <div className="card__media card__media--tall"><Img k={s.img} /><span className="tag tag--float">{s.meta[0]}</span></div>
              <div className="card__body"><small className="kicker">{s.tag}</small><h3 className="h4">{s.title}</h3><p>{s.text}</p><span className="card__foot">{s.meta[1]}</span></div>
            </Reveal>
          ))}
        </div>
      </section>

      <PhotoStrip items={PHOTO_ROW} />

      <section className="wrap sec" id="values">
        <SectionHead eyebrow="What we stand for" hi="हमारे मूल्य" title="Four values," em="woven into every class." />
        <FeatureGrid items={VALUES} cols={4} />
      </section>

      <section className="sec sec--tint" id="faculty"><div className="wrap">
        <SectionHead eyebrow="The Lineage Roots" title="Resident Masters &" em="Faculty" text="Our senior mentors carry deep apprenticeships across India, Nepal and Japan, uniting decades of living practice with compassionate, modern mentorship." />
        <div className="grid grid--4">
          {FACULTY.map((f, i) => (
            <Reveal as="article" className="card card--pad card--lift person" key={f.name} delay={i * 80}>
              <div className="person__photo"><Img k={`faculty-${i}`} alt={f.name} /></div><small className="kicker">{f.badge}</small>
              <h3 className="h4">{f.name}</h3><p className="person__role">{f.role}</p><p className="person__quote">{f.text}</p>
              <ul className="meta-list">{f.meta.map((m) => <li key={m}>{m}</li>)}</ul>
            </Reveal>
          ))}
        </div>
      </div></section>

      <section className="wrap sec">
        <SectionHead eyebrow="Living Atmospheres" title="Life Inside" em="PRĀNA" />
        <div className="mosaic">
          {[['life-deck', 'Mountain Deck at 6:30 AM'], ['life-tea', 'Ayurvedic Botanical Rituals'], ['g-bowls', 'Crystal Singing Bowls Cavitation'], ['life-yin', 'Restorative Somatic Release'], ['life-garden', 'Silent Walking Meditation Arena'], ['g-cohort', 'Personalised Mentorship & Touch']].map(([k, cap], i) => (
            <Reveal as="figure" key={k} className={`mosaic__item mosaic__item--${i + 1}`} delay={i * 60}><Img k={k} /><figcaption>{cap}</figcaption></Reveal>
          ))}
        </div>
      </section>

      <section className="wrap sec" id="seva">
        <SectionHead eyebrow="Giving back" title="Seva in" em="the community." text="Yoga means little if it stays on the mat. These are the ways PRĀNA gives back to Rishikesh each year." />
        <FeatureGrid items={SEVA} cols={4} />
      </section>

      <FilmBand clip="deck" eyebrow="A morning at PRĀNA" hi="एक सुबह" title="Warrior on the deck," em="valley below." text="Our teachers practise what they teach — every morning, before the first student arrives." actions={<Button to="/courses" variant="peach" icon="arrow-right">Practise with us online</Button>} />

      <section className="wrap sec" id="day">
        <SectionHead eyebrow="A day at the sanctuary" hi="दिनचर्या" title="The rhythm" em="we keep." />
        <DayRhythm items={DAY_RHYTHM} />
      </section>

      <Counters items={CAMPUS_COUNTERS} />

      <section className="wrap sec" id="seasons">
        <SectionHead eyebrow="Plan your visit" title="The best time" em="to come." text="Rishikesh has four distinct moods. Pick the one that suits you." />
        <FeatureGrid items={SEASONS.map(([i, t, x]) => [i, t, x])} cols={4} />
      </section>

      <GifBand gif="bg-dusk" eyebrow="Open gate" title="Walk in any day" em="between 10 and 3." text="Free sanctuary tours with tea. No booking needed — just ring the bell at the gate." actions={<Button to="/contact#booking" variant="peach" icon="arrow-right">Plan your visit</Button>} />

      <section className="sec sec--tint"><div className="wrap">
        <SectionHead eyebrow="Retreats & immersions" hi="कुछ दिन अपने नाम" title="Stay a while." text="Eight garden rooms, a kitchen garden and no phone signal in the shala." />
        <CardGrid items={RETREATS} kind="retreat" />
      </div></section>

      <FaqBlock items={ABOUT_FAQ} tint={false} />

      <VisitBlock img="rk-bridge-dusk" />

      <CtaBand eyebrow="Sanctuary Visit Invitations" title="Cross Our Threshold into" em="Unhurried Stillness." text="Whether you are an aspiring teacher seeking your 300-hour accreditation, or a tired urbanite longing for morning silence, our doors in Rishikesh are warmly open."
        actions={<><Button to="/contact#booking" variant="terra" size="lg" icon="arrow-right">Book In-Person Sanctuary Tour</Button><Button to="/gallery" variant="glass" size="lg">Virtual 360° Studio Tour</Button></>}>
        <div className="concierge"><h3>Sanctuary Concierge</h3>
          <p><Icon name="map-pin" size={16} />{SITE.addressShort}</p>
          <p><Icon name="clock" size={16} />Sanctuary tour · Daily, 10:00 – 15:00</p>
          <p><Icon name="mail" size={16} />{SITE.email}</p></div>
      </CtaBand>
    </main>
  )
}
