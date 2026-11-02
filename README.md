# PRĀNA Sanctuary — website

React 19 + esbuild front-end, zero-framework Node server (Razorpay, contact form, static hosting).
Pages: Home · About · Yoga Career · Online Courses · Gallery · Contact (+ Privacy / Terms / Refunds), shared Footer, floating WhatsApp button on every page.

## Run it
```bash
npm install            # react, react-dom, esbuild (+ optional nodemailer, playwright)
cp .env.example .env   # then fill in the values (see "What you must provide")
npm run build
npm start              # → http://localhost:8787  (serves site + API together)
# development with rebuild-on-save:  npm run dev
```
Needs Node ≥ 20.12.

## Tests
```bash
npm test               # 19 server tests: pricing, signature verification, webhook, validation, rate-limit, static
npm run build && npm run e2e   # browser test: all 6 pages × desktop/tablet/mobile, hero video, forms, WhatsApp, payment flow
```
`e2e` uses a fake Razorpay API and a stubbed `checkout.js`, so it needs no keys and no money moves. (`npx playwright install chromium` once.)

## What you must provide (nothing works "live" without these)
| Needed | Where | Without it |
|---|---|---|
| Razorpay **Key ID + Key Secret** (test first, then live — needs completed KYC) | `.env` | Checkout shows "online payments open soon" + WhatsApp enrol link. Site otherwise works. |
| Razorpay **webhook secret** + webhook URL registered in dashboard | `.env` + Razorpay dashboard | Payments still verify at checkout; webhook is the safety net if the browser closes mid-payment. |
| **WhatsApp number** | `.env` `WHATSAPP_NUMBER` | Button links to /contact instead of WhatsApp. |
| SMTP (Gmail app-password, Brevo, SES…) | `.env` | No emails; every enquiry/payment is still saved in `server/data/*.jsonl`. |
| **Real address/phone/email, prices, teacher names** | `src/data/site.js`, `src/data/content.js`, `shared/catalog.js` | Address is set to Tapovan, Rishikesh with a **placeholder phone (+91 98765 43210) and street line** — replace with your real details in `src/data/site.js` (also update map coordinates there). |
| **Real photos & hero footage** | `public/media/` | See below. |
| Course delivery | your video host / LMS | After payment the buyer gets a confirmation + the order is stored; **granting access to videos is manual** (no login system is included). |

## Media — please read
I could not download stock footage/photos (network is restricted where this was built). So:
* `public/media/hero.mp4` + `hero.webm` is an **original looping film generated from code** (misty valley, rising sun, meditating figure) — it is a real `<video>`, but **not live-action yoga**.
* All pictures in `public/media/*.webp` are **original illustrations in the Stitch palette**, not photographs. Every picture key is registered in `src/data/media-sources.json`, and any key without an entry falls back to `/media/<key>.webp`, so no image slot is left blank. To use real Rishikesh photos, drop files with the same names (e.g. `rk-bridge.webp`, `rk-aarti.webp`).

To use real royalty-free footage (Pexels, Mixkit, Pixabay — all free for commercial use; check each licence page): download a 10–20 s loop, then
```bash
ffmpeg -i yoga.mp4 -an -vf "scale=1280:-2" -c:v libx264 -crf 26 -preset slow -movflags +faststart public/media/hero.mp4
ffmpeg -i yoga.mp4 -an -vf "scale=1280:-2" -c:v libvpx-vp9 -crf 36 -b:v 0 public/media/hero.webm
ffmpeg -i yoga.mp4 -frames:v 1 public/media/hero-poster.jpg
```
For photos, drop a file with the **same name** (e.g. `g-shala.webp`, 1200×900) into `public/media/` — no code change. Keys → files are in `src/data/media-sources.json`. Keep `-sm.webp` (600 px) copies for fast mobile loads.

## Language, extra sections & animated backgrounds
The site is **English-first**. Hindi appears only in four places: the home hero line, two verse bands on the home page (`breath`, `lamp` in `src/data/extra.js`) and the footer mantra. All other Hindi labels are switched off (`Deva` in `src/components/ui.jsx` renders nothing unless `keep` is passed).
Rishikesh copy for the added sections (why Rishikesh, things to do nearby, stay & food, seasons, seva, international students, upcoming cohorts, travel FAQ) lives in `src/data/rishikesh.js`; the reusable blocks are in `src/components/Blocks.jsx`.
Animated backgrounds: GIFs (`public/media/bg-*.gif`) behind the footer, page heroes and the "GIF bands"; looping videos (`reel-*`, `ganga-aarti`, `bridge`, `ganga-dawn`, `deck`, `calm`, `bowls`) in film bands and the gallery. GIFs are hidden for visitors who prefer reduced motion.
Regenerate the new Rishikesh pictures/loops with `python3 scripts/make_media.py stills rk-bridge …` and `python3 scripts/make_media.py video2 bridge ganga-aarti ganga-dawn`.

## Easiest way to run (Windows)
Double-click **`start.bat`** — it installs packages the first time, builds the site, starts the server and opens your browser.
If port 8787 is busy the server automatically uses the next free port (8788, 8789 …) and prints the exact address. Set `STRICT_PORT=1` in `.env` to turn that off on a real server.

## Troubleshooting
- **Port busy** — handled automatically (see above). To free 8787 anyway: `netstat -ano | findstr :8787` then `taskkill /PID <pid> /F`.
- **Browser tests (`npm run e2e`)** use Microsoft Edge or Google Chrome if Playwright's own browser is not downloaded, so no extra download is needed on Windows. Run `npm run build` first.
- **`npm audit` needs internet** — it fails with `ENOTFOUND registry.npmjs.org` when your connection or DNS is down. Retry on a working connection; avoid `npm audit fix --force`.

## How payments are secured
1. Browser sends only `itemId` + buyer details. **Price lives on the server** (`shared/catalog.js`).
2. Server creates the Razorpay order, returns the public key id + order id.
3. After payment, the browser sends `order_id / payment_id / signature` to `/api/payments/verify`; server recomputes `HMAC-SHA256(order_id|payment_id, KEY_SECRET)` and compares in constant time. Only then is the order marked paid.
4. `/api/payments/webhook` (also available as `/api/razorpay/webhook`) independently verifies Razorpay's `X-Razorpay-Signature` on the raw body.
Memberships are **one payment per period** (30 days / 12 months), not auto-renewing subscriptions. Auto-debit needs Razorpay Subscriptions + plan IDs — not set up here.

## Deploy
Any Node host (Render, Railway, a VPS behind Nginx): `npm ci && npm run build && npm start`, set env vars in the host's dashboard, use HTTPS, set `TRUST_PROXY=1` behind a proxy. `server/data/` must be on persistent disk (or swap `server/lib/store.js` for a database).

## Project layout
```
src/pages/*         one file per page          src/components/*   Navbar, Footer, HeroVideo, CheckoutModal, ContactForm, WhatsAppButton, ui kit
src/data/*          all copy / prices / links  src/styles.css     design tokens + responsive layout
server/app.js       API + static server        shared/catalog.js  server-trusted prices
scripts/e2e.mjs     browser tests              scripts/make_media.py  regenerates the illustrations + hero film
```
