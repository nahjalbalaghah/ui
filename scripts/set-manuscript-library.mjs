#!/usr/bin/env node
/**
 * Set the `library` relation on manuscript entries whose images all match a filename pattern.
 * The site infers a manuscript's library from this relation (or from the filenames), so entries
 * with generic filenames like PICT0032.JPG need it set to show up.
 *
 * Usage:
 *   node --env-file=.env.strapi scripts/set-manuscript-library.mjs --library "Naṣīrī" --files "^PICT\d+\.JPG$" [--only 1.25] [--apply]
 */
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const LIBRARY = opt('--library');
const FILES = opt('--files') && new RegExp(opt('--files'), 'i');
const ONLY = opt('--only')?.split(',');
const APPLY = args.includes('--apply');
const BASE = (process.env.STRAPI_URL || 'https://cms.nahjalbalaghah.org').replace(/\/$/, '');
const TOKEN = process.env.STRAPI_TOKEN;
if (!LIBRARY || !FILES || !TOKEN) { console.error('Need --library, --files and STRAPI_TOKEN'); process.exit(1); }

async function strapi(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : null;
}
async function fetchAll(path) {
  const out = [];
  for (let page = 1; ; page++) {
    const r = await strapi('GET', `${path}&pagination[page]=${page}&pagination[pageSize]=100`);
    out.push(...r.data);
    if (page >= r.meta.pagination.pageCount) return out;
  }
}

const libraries = await fetchAll('/api/libraries?fields[0]=name');
const library = libraries.find(l => l.name === LIBRARY);
if (!library) throw new Error(`Library "${LIBRARY}" not found. Available: ${libraries.map(l => l.name).join(', ')}`);

const manuscripts = await fetchAll('/api/manuscripts?fields[0]=section&populate[files][fields][0]=name&populate[library][fields][0]=name');
const targets = manuscripts.filter(m =>
  m.files?.length && m.files.every(f => FILES.test(f.name)) &&
  m.library?.documentId !== library.documentId &&
  (!ONLY || ONLY.includes(m.section)));
const conflicting = targets.filter(m => m.library);
console.log(`${targets.length} entries to set library = ${LIBRARY}` + (conflicting.length ? ` (${conflicting.length} currently have another library: ${conflicting.map(m => `${m.section}=${m.library.name}`).join(', ')})` : ''));
if (!APPLY) { console.log('DRY RUN — pass --apply to write.'); process.exit(0); }

let ok = 0; const failed = [];
const queue = [...targets];
await Promise.all(Array.from({ length: 4 }, async () => {
  for (let m; (m = queue.shift());) {
    try {
      await strapi('PUT', `/api/manuscripts/${m.documentId}?status=published`, { data: { library: library.documentId } });
      if (++ok % 100 === 0) console.log(`  …${ok}/${targets.length}`);
    } catch (e) { failed.push(`${m.section} ${m.documentId}: ${e.message}`); }
  }
}));
console.log(`Updated ${ok}/${targets.length}`);
if (failed.length) console.log(`Failed (${failed.length}):\n  ` + failed.join('\n  '));
