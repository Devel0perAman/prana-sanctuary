import fs from 'node:fs'
import path from 'node:path'

/** Load .env (Node >= 20.12) without any dependency. Real env vars win. */
export function loadEnv(root) {
  const file = path.join(root, '.env')
  if (fs.existsSync(file) && typeof process.loadEnvFile === 'function') {
    try { process.loadEnvFile(file) } catch (e) { console.warn('[env] could not read .env:', e.message) }
  }
  return process.env
}
