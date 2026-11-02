// Start an http.Server on `port`; if it is busy, try the next ports (port+1 … port+tries).
// Resolves with the port actually used. Set STRICT_PORT=1 to disable the fallback (e.g. in production behind a proxy).
export function listenWithFallback(server, port, { tries = 20, strict = false } = {}) {
  return new Promise((resolve, reject) => {
    let attempt = 0
    const go = (p) => {
      const onError = (e) => {
        server.off('listening', onListening)
        if (e.code === 'EADDRINUSE' && !strict && attempt < tries && p !== 0) { attempt++; go(p + 1) } else reject(e)
      }
      const onListening = () => { server.off('error', onError); resolve(server.address().port) }
      server.once('error', onError); server.once('listening', onListening)
      server.listen(p)
    }
    go(port)
  })
}
