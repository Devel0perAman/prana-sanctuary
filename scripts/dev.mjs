// `npm run dev`: rebuild on change + restart the server when SERVER CODE changes.
// Note: server/data/ (orders, messages) is deliberately NOT watched — writing a form submission
// there must never restart the server (that caused "EADDRINUSE" on Windows).
import { spawn } from 'node:child_process'
const run = (args) => spawn(process.execPath, args, { stdio: 'inherit' })
const kids = [
  run(['scripts/build.mjs', '--watch']),
  run(['--watch-path=server/app.js', '--watch-path=server/index.js', '--watch-path=server/lib', '--watch-path=shared', 'server/index.js']),
]
const stop = () => kids.forEach((k) => k.kill()); process.on('SIGINT', stop); process.on('SIGTERM', stop)
