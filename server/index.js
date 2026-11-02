import http from 'node:http'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from './lib/env.js'
import { createRazorpayClient } from './lib/razorpay.js'
import { createStore } from './lib/store.js'
import { createMailer } from './lib/mailer.js'
import { createApp } from './app.js'
import { listenWithFallback } from './lib/listen.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const env = loadEnv(root)

const hasKeys = env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET && !env.RAZORPAY_KEY_SECRET.includes('replace_me')
const razorpay = hasKeys ? createRazorpayClient({ keyId: env.RAZORPAY_KEY_ID, keySecret: env.RAZORPAY_KEY_SECRET }) : null
if (!razorpay) console.warn('[payments] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set → checkout is disabled (site still works).')
if (razorpay && env.NODE_ENV === 'production' && env.RAZORPAY_KEY_ID.startsWith('rzp_test_')) console.warn('[payments] Running in production with TEST keys.')
if (razorpay && !env.RAZORPAY_WEBHOOK_SECRET) console.warn('[payments] RAZORPAY_WEBHOOK_SECRET not set → webhook endpoint will reject events.')

const handler = createApp({
  env, razorpay,
  store: createStore(path.join(root, 'server', 'data')),
  mailer: await createMailer(env),
  distDir: path.join(root, 'dist'),
  publicDir: path.join(root, 'public'),
})

const wanted = env.PORT === undefined || env.PORT === '' ? 8787 : Number(env.PORT)
const server = http.createServer(handler)
try {
  const port = await listenWithFallback(server, Number.isInteger(wanted) && wanted >= 0 ? wanted : 8787, { strict: env.STRICT_PORT === '1' })
  if (port !== wanted) console.warn(`[server] Port ${wanted} was busy, so the site is using port ${port} instead.`)
  console.log(`PRĀNA Sanctuary → http://localhost:${port}`)
  if (env.OPEN_BROWSER === '1' && process.platform === 'win32') spawn('cmd', ['/c', 'start', '', `http://localhost:${port}`], { stdio: 'ignore', detached: true }).unref()
} catch (e) {
  if (e.code === 'EADDRINUSE') console.error(`\n[server] Port ${wanted} is already in use. Free it (Windows: netstat -ano | findstr :${wanted}  then  taskkill /PID <pid> /F) or set another PORT in .env.\n`)
  else console.error('[server]', e)
  process.exit(1)
}
