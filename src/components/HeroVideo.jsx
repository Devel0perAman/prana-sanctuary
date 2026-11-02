import { useEffect, useRef, useState } from 'react'
import { Img } from './ui.jsx'
import Icon from './Icon.jsx'
import { useConfig } from '../lib/config.jsx'
import { useMediaQuery } from '../lib/hooks.js'

/**
 * Full-bleed looping background video.
 *  - Poster image paints first (fast LCP) with a gentle Ken-Burns drift.
 *  - Video is attached only after the page is idle, skipped on Save-Data, and never autoplays under prefers-reduced-motion.
 *  - If the file is missing or fails, the poster simply stays — no broken UI.
 *  - Sources: HERO_VIDEO_URL (.env) → /media/hero.webm → /media/hero.mp4
 */
export default function HeroVideo() {
  const { heroVideoUrl } = useConfig()
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const ref = useRef(null)
  const [attach, setAttach] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const [userPaused, setUserPaused] = useState(false)

  useEffect(() => {
    const saveData = navigator.connection?.saveData
    if (saveData) return
    const go = () => setAttach(true)
    if ('requestIdleCallback' in window) { const id = requestIdleCallback(go, { timeout: 1500 }); return () => cancelIdleCallback(id) }
    const t = setTimeout(go, 400); return () => clearTimeout(t)
  }, [])

  useEffect(() => { if (reduced) { setUserPaused(true); ref.current?.pause() } }, [reduced])

  const toggle = () => {
    const v = ref.current; if (!v) return
    if (v.paused) { v.play().then(() => setUserPaused(false)).catch(() => {}) } else { v.pause(); setUserPaused(true) }
  }
  const showVideo = attach && !failed

  return (
    <div className="hero-media" aria-hidden={!showVideo || undefined}>
      <Img k="hero-poster" eager className="hero-media__poster" alt="" />
      {showVideo && (
        <video ref={ref} className={`hero-media__video${playing ? ' is-playing' : ''}`} autoPlay={!reduced} muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1}
          onPlaying={() => setPlaying(true)} onPause={() => setUserPaused(true)} onPlay={() => setUserPaused(false)}>
          {heroVideoUrl && <source src={heroVideoUrl} />}
          <source src="/media/hero.webm" type="video/webm" />
          {/* <video> never fires 'error' itself when <source> children fail — the LAST source's error means every source failed. */}
          <source src="/media/hero.mp4" type="video/mp4" onError={() => setFailed(true)} />
        </video>
      )}
      <div className="hero-media__shade" />
      {(playing || (reduced && showVideo)) && (
        <button type="button" className="hero-media__ctl" onClick={toggle} aria-label={userPaused ? 'Play background video' : 'Pause background video'}>
          <Icon name={userPaused ? 'play' : 'pause'} size={16} />
        </button>
      )}
    </div>
  )
}
