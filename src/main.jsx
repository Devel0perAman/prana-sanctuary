import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import { Router } from './lib/router.jsx'
import { ConfigCtx } from './lib/config.jsx'
import { api } from './lib/api.js'
import { setMediaOverrides } from './lib/media.js'

const DEFAULTS = { paymentsEnabled: false, whatsappNumber: '', whatsappMessage: '', heroVideoUrl: '', razorpayKeyId: null }

// Runtime config (WhatsApp number, hero video, local media manifest, whether payments are on) comes from the server's .env —
// no rebuild needed to change it. If the API is slow/unreachable we render anyway with safe defaults.
const config = await api.config().catch(() => ({}))
setMediaOverrides(config.media)

createRoot(document.getElementById('root')).render(
  <ConfigCtx.Provider value={{ ...DEFAULTS, ...config }}><Router><App /></Router></ConfigCtx.Provider>,
)
