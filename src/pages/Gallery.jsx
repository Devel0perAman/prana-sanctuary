import { useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'
import HeroVideo from '../components/HeroVideo.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { Button, Eyebrow, Img, PageHero, Reveal, SectionHead, cx } from '../components/ui.jsx'
import { Chips, CtaBand } from '../components/Shared.jsx'
import { COMMUNITY_SHOTS, GALLERY_FILTERS, GALLERY_ITEMS, GALLERY_STATS, TOUR_POINTS } from '../data/content.js'
import { SITE } from '../data/site.js'
import { usePageMeta } from '../lib/hooks.js'
import { CardGrid, Counters, DayRhythm, FaqBlock, FeatureGrid, FilmBand, LoopVideo, MapBackdrop, Schedule, Steps, Timeline, VerseBand, CompareTable, Deva } from '../components/Sections.jsx'
import { REELS, WALL } from '../data/extra.js'
import { GifBand, PhotoStrip, VisitBlock } from '../components/Blocks.jsx'
import { PHOTO_ROW } from '../data/rishikesh.js'

const PAGE = 9

export default function Gallery() {
  usePageMeta('Gallery', 'Visual stillness: a curated archive of photography and film from PRĀNA Sanctuary — shalas, rituals, retreats and community.')
  const [filter, setFilter] = useState('All Works')
  const [shown, setShown] = useState(PAGE)
  const [open, setOpen] = useState(-1)
  const items = useMemo(() => GALLERY_ITEMS.filter((i) => filter === 'All Works' || i.cat === filter), [filter])
  const visible = items.slice(0, shown)

  return (
    <main id="main">
      <PageHero eyebrow="Visual Archive & Living Moments" hi="दृश्यों में ठहराव" title="Capturing Stillness, Space" em="& Sacred Movement.">
        <p className="lede">Step inside the sensory realm of PRĀNA through our curated photography collections and high-definition cinematic visual reels from our Rishikesh sanctuary.</p>
        <ul className="chip-stats">{GALLERY_STATS.map(([v, l]) => <li key={l}><strong>{v}</strong><span>{l}</span></li>)}</ul>
      </PageHero>

      <section className="wrap">
        <Chips items={GALLERY_FILTERS} value={filter} onChange={(f) => { setFilter(f); setShown(PAGE) }} label="Filter gallery" />
        <Reveal className="reel">
          <HeroVideo />
          <div className="reel__caption"><span className="tag tag--solid">Featured cinematic reel</span><h2 className="h2">Dawn above the Ganga: <em>The Symphony of Breath</em></h2><p>A meditative visual capturing morning pranayama across the misty valley. Recorded with ribbon microphones and sung over our 432Hz singing bowls.</p></div>
        </Reveal>
      </section>

      <section className="wrap sec" id="archive" aria-live="polite">
        <div className="sec-row"><div><Eyebrow>Curated Collection Archive</Eyebrow><h2 className="h2">Visual Stillness in {items.length} Compositions</h2></div><p className="muted">Click any work to inspect it full-screen.</p></div>
        <div className="masonry">
          {visible.map((it, i) => (
            <Reveal as="button" type="button" className="tile" key={it.title} delay={(i % 3) * 70} onClick={() => setOpen(i)} aria-label={`View ${it.title}`}>
              <Img k={it.img} alt={it.title} />
              <span className="tile__overlay"><small>{it.series}</small><strong>{it.title}</strong><span>{it.cat}</span></span>
              <span className="tile__expand"><Icon name="expand" size={16} /></span>
            </Reveal>
          ))}
        </div>
        {shown < items.length && <div className="center"><Button variant="ghost" onClick={() => setShown(shown + PAGE)}>Reveal {Math.min(PAGE, items.length - shown)} more plates</Button></div>}
      </section>

      <section className="wrap sec" id="reels">
        <SectionHead eyebrow="Moving pictures" hi="चलती तस्वीरें, ठहरा हुआ मन" title="Nine short" em="cinematic loops." text="Hover or scroll — each clip loops silently, made to be watched slowly." />
        <div className="reels">
          {REELS.map((r, i) => (
            <Reveal as="figure" key={r.clip} delay={i * 60} className="reel-card">
              <LoopVideo name={r.clip} /><span className="tag tag--float">{r.tag}</span><span className="reel-card__live"><i />Loop</span>
              <figcaption><Deva>{r.hi}</Deva><b>{r.title}</b></figcaption>
            </Reveal>
          ))}
        </div>
      </section>

      <PhotoStrip items={PHOTO_ROW} />

      <section className="wrap sec sec--tight">
        <Reveal className="tour">
          <div className="tour__media"><Img k="sound" /><span className="tag tag--float">Interactive viewport</span></div>
          <div className="tour__copy">
            <Eyebrow>Spatial Telepresence</Eyebrow><h2 className="h2">Walk Through the Sanctuary <em>From Anywhere in the World.</em></h2>
            <p className="lede">Experience the microclimate, acoustic reflections and natural materials of PRĀNA's shalas through our guided video tour.</p>
            <ul className="tour__points">{TOUR_POINTS.map(([t, d]) => <li key={t}><Icon name="headphones" size={18} /><div><b>{t}</b><span>{d}</span></div></li>)}</ul>
            <div className="promo__actions"><Button to="/contact#booking" variant="terra" icon="arrow-right">Book Private Studio Tour</Button></div>
          </div>
        </Reveal>
      </section>

      <section className="wrap sec sec--tight">
        <SectionHead center={false} eyebrow="Community & Sangha Dispatches" title="Moments from our" em="Community #PranaSanctuary">
          <a className="text-link" href={SITE.social[0].href} target="_blank" rel="noopener noreferrer">Follow @pranasanctuary on Instagram <Icon name="arrow-up-right" size={16} /></a></SectionHead>
        <div className="strip">{COMMUNITY_SHOTS.map((k, i) => <Reveal key={k} delay={i * 70}><Img k={k} /></Reveal>)}</div>
      </section>

      <VerseBand verse="nature" tone="gold" />

      <GifBand gif="bg-aarti" eyebrow="Evening on the ghat" title="Light a lamp" em="for the river." text="Join our Thursday walk to the Ganga aarti — free for students and retreat guests." actions={<Button to="/contact#booking" variant="peach" icon="arrow-right">Reserve a spot</Button>} />

      <section className="wrap sec" id="wall">
        <SectionHead eyebrow="Words on the wall" hi="दीवार पर लिखे शब्द" title="Lines our students" em="photograph the most." text="Painted by hand on the shala walls, a few lines to carry out of the door with you." />
        <div className="wall">{WALL.map((w, i) => <Reveal as="figure" key={i} delay={i * 80} className="wall__tile"><Img k={w.img} alt="" /><blockquote className="wall__line">{w.en.split('\n').map((l, j) => <span key={j}>{l}</span>)}</blockquote></Reveal>)}</div>
      </section>

      <VisitBlock img="rk-hills" />

      <CtaBand eyebrow="Your contemplative passage awaits" title="Experience the Sanctuary in Person" em="or from Anywhere on Earth."
        text="Secure an in-studio sanctuary mat or unlock unlimited high-fidelity access to our 4K video reels, masterclasses, and sound archives."
        actions={<><Button to="/contact#booking" variant="terra" size="lg">Reserve Today's Shala Mat</Button><Button to="/courses" variant="glass" size="lg">Explore Online Video Vault</Button></>} />

      {open >= 0 && <Lightbox items={visible} index={open} onClose={() => setOpen(-1)} onIndex={setOpen} />}
    </main>
  )
}
