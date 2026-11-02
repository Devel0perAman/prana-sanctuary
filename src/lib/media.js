import sources from '../data/media-sources.json'

let overrides = {}
/** Runtime overrides from /api/config (written by `npm run media` when photos are stored locally). */
export const setMediaOverrides = (o) => { overrides = o && typeof o === 'object' ? o : {} }
/** Registry entry → override → file named after the key (public/media/<key>.webp). A picture is never left blank. */
export const mediaUrl = (key) => overrides[key] || sources[key]?.url || (key ? `/media/${key}.webp` : '')
export const mediaAlt = (key) => sources[key]?.alt || String(key || '').replace(/^(rk|g|life|day|course|space|event|step)-/, '').replace(/-/g, ' ')
