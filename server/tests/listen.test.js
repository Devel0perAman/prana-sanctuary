import { test } from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import net from 'node:net'
import { listenWithFallback } from '../lib/listen.js'

const freePort = () => new Promise((r) => { const s = net.createServer().listen(0, () => { const p = s.address().port; s.close(() => r(p)) }) })
const hold = (port) => new Promise((r) => { const s = net.createServer().listen(port, () => r(s)) })

test('uses the wanted port when it is free', async () => {
  const p = await freePort(); const srv = http.createServer()
  assert.equal(await listenWithFallback(srv, p), p); srv.close()
})

test('falls back to the next free port when the wanted one is busy', async () => {
  const p = await freePort(); const blocker = await hold(p); const srv = http.createServer()
  const used = await listenWithFallback(srv, p)
  assert.ok(used > p && used <= p + 20, `used ${used}`); srv.close(); blocker.close()
})

test('strict mode and exhausted retries still report EADDRINUSE', async () => {
  const p = await freePort(); const blocker = await hold(p)
  await assert.rejects(listenWithFallback(http.createServer(), p, { strict: true }), { code: 'EADDRINUSE' })
  await assert.rejects(listenWithFallback(http.createServer(), p, { tries: 0 }), { code: 'EADDRINUSE' })
  blocker.close()
})
