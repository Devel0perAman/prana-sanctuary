import { useConfig } from '../lib/config.jsx'
import Icon from './Icon.jsx'

/** Floating WhatsApp button, fixed bottom-right on every page. Number/message come from server .env via /api/config. */
export default function WhatsAppButton() {
  const { whatsappNumber, whatsappMessage } = useConfig()
  const href = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage || '')}` : '/contact'
  return (
    <a className="wa" href={href} target={whatsappNumber ? '_blank' : undefined} rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
      <span className="wa__label">Chat with us</span>
      <span className="wa__icon"><Icon name="whatsapp" size={30} /></span>
    </a>
  )
}
