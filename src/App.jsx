import { Routes } from './lib/router.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Career from './pages/Career.jsx'
import Courses from './pages/Courses.jsx'
import Gallery from './pages/Gallery.jsx'
import Contact from './pages/Contact.jsx'
import Legal from './pages/Legal.jsx'
import NotFound from './pages/NotFound.jsx'

const routes = {
  '/': Home, '/about': About, '/yoga-career': Career, '/courses': Courses, '/gallery': Gallery, '/contact': Contact,
  '/privacy': () => <Legal page="privacy" />, '/terms': () => <Legal page="terms" />, '/refunds': () => <Legal page="refunds" />,
}

export default function App() {
  return (
    <>
      <Navbar />
      <div className="page"><Routes routes={routes} fallback={NotFound} /></div>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
