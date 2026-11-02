// Production/dev bundler (esbuild). Usage: node scripts/build.mjs [--watch]
import { build, context } from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const watch = process.argv.includes('--watch')
const prod = !watch

const options = {
  entryPoints: { app: path.join(root, 'src/main.jsx') },
  outdir: path.join(dist, 'assets'),
  entryNames: '[name]-[hash]',
  assetNames: '[name]-[hash]',
  bundle: true, format: 'esm', target: ['es2022'], jsx: 'automatic',
  minify: prod, sourcemap: prod ? false : 'inline', metafile: true, logLevel: 'info',
  loader: { '.svg': 'dataurl', '.woff2': 'file' },
  define: { 'process.env.NODE_ENV': JSON.stringify(prod ? 'production' : 'development') },
  plugins: [{
    name: 'emit-html',
    setup(b) {
      b.onEnd((r) => {
        if (r.errors.length) return
        const outs = Object.keys(r.metafile.outputs).map((f) => path.basename(f))
        const js = outs.find((f) => f.endsWith('.js')), css = outs.find((f) => f.endsWith('.css'))
        let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
        html = html.replace('</head>', `  ${css ? `<link rel="stylesheet" href="/assets/${css}" />` : ''}\n  <script type="module" src="/assets/${js}"></script>\n</head>`)
        fs.writeFileSync(path.join(dist, 'index.html'), html)
        // keep only the newest hashed bundle
        for (const f of fs.readdirSync(path.join(dist, 'assets'))) if (!outs.includes(f)) fs.rmSync(path.join(dist, 'assets', f), { force: true })
      })
    },
  }],
}

fs.rmSync(dist, { recursive: true, force: true }); fs.mkdirSync(path.join(dist, 'assets'), { recursive: true })
if (watch) { const ctx = await context(options); await ctx.watch(); console.log('[build] watching src/ …') }
else { const r = await build(options); const kb = Object.entries(r.metafile.outputs).map(([f, o]) => `${path.basename(f)} ${(o.bytes / 1024).toFixed(1)} kB`); console.log('[build] done:', kb.join(' · ')) }
