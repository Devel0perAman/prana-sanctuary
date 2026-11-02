import { Button, PageHero } from '../components/ui.jsx'
import { usePageMeta } from '../lib/hooks.js'
export default function NotFound() {
  usePageMeta('Page not found')
  return <main id="main"><PageHero eyebrow="404" title="This path has" em="dissolved into stillness."><p className="lede">The page you were looking for isn't here. Let's guide you back.</p><div className="page-hero__actions"><Button to="/" variant="primary">Return home</Button><Button to="/contact" variant="ghost">Contact us</Button></div></PageHero></main>
}
