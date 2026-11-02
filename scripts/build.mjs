// Production/dev bundler (esbuild).
// Usage: node scripts/build.mjs [--watch]

import { build, context } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

const dist = path.join(root, 'dist');
const publicDir = path.join(root, 'public');
const assetsDir = path.join(dist, 'assets');

const watch = process.argv.includes('--watch');
const prod = !watch;

const options = {
  entryPoints: {
    app: path.join(root, 'src/main.jsx'),
  },

  outdir: assetsDir,
  entryNames: '[name]-[hash]',
  assetNames: '[name]-[hash]',

  bundle: true,
  format: 'esm',
  target: ['es2022'],
  jsx: 'automatic',

  minify: prod,
  sourcemap: prod ? false : 'inline',
  metafile: true,
  logLevel: 'info',

  loader: {
    '.svg': 'dataurl',
    '.woff2': 'file',
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify(
      prod ? 'production' : 'development'
    ),
  },

  plugins: [
    {
      name: 'emit-html-and-copy-public',

      setup(b) {
        b.onEnd((result) => {
          if (result.errors.length) {
            console.error('[build] Failed. Public files were not copied.');
            return;
          }

          // Copy public files into dist.
          // Example: public/media/hero-poster.webp
          // becomes: dist/media/hero-poster.webp
          if (fs.existsSync(publicDir)) {
            fs.cpSync(publicDir, dist, {
              recursive: true,
              force: true,
            });

            console.log('[build] Public files copied to dist/');
          }

          // Locate the generated JavaScript and CSS bundles.
          const outputs = Object.keys(
            result.metafile.outputs
          ).map((file) => path.basename(file));

          const js = outputs.find((file) => file.endsWith('.js'));
          const css = outputs.find((file) => file.endsWith('.css'));

          if (!js) {
            console.error('[build] JavaScript bundle not found.');
            return;
          }

          // Generate index.html using the current hashed filenames.
          let html = fs.readFileSync(
            path.join(root, 'index.html'),
            'utf8'
          );

          const headAssets = [
            css
              ? `<link rel="stylesheet" href="/assets/${css}" />`
              : '',
            `<script type="module" src="/assets/${js}"></script>`,
          ]
            .filter(Boolean)
            .join('\n  ');

          html = html.replace(
            '</head>',
            `  ${headAssets}\n</head>`
          );

          fs.writeFileSync(
            path.join(dist, 'index.html'),
            html
          );

          // Remove old hashed bundles.
          // Do not remove copied images or other public files.
          for (const file of fs.readdirSync(assetsDir)) {
            const filePath = path.join(assetsDir, file);

            if (
              fs.statSync(filePath).isFile() &&
              !outputs.includes(file)
            ) {
              fs.rmSync(filePath, { force: true });
            }
          }
        });
      },
    },
  ],
};

// Start with a clean output directory.
fs.rmSync(dist, {
  recursive: true,
  force: true,
});

fs.mkdirSync(assetsDir, {
  recursive: true,
});

if (watch) {
  const ctx = await context(options);

  await ctx.watch();

  console.log('[build] Watching src/ ...');
} else {
  const result = await build(options);

  const sizes = Object.entries(
    result.metafile.outputs
  ).map(([file, output]) => {
    return `${path.basename(file)} ${(output.bytes / 1024).toFixed(1)} kB`;
  });

  console.log('[build] Done:', sizes.join(' · '));
}