#!/usr/bin/env node
/**
 * Create manuscript entries linking already-uploaded Media Library images to posts.
 *
 * Input CSV columns: No., Mar'ashi, Nasiri  (one row per post/section; cells hold
 * comma-separated image refs like "AH-images-16, AH- images-17" or "pict0021, pict0-165").
 *
 * Only creates entries for (section, library) pairs that have no entry yet.
 * Existing entries are never modified — differences are reported instead.
 *
 * Usage:
 *   node --env-file=.env.strapi scripts/link-manuscript-images.mjs scripts/manuscript-list.csv [--apply] [--only 1.8,1.9] [--library marashi|nasiri]
 */
import fs from 'node:fs';

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const csvPath = args[0];
const APPLY = args.includes('--apply');
const ONLY = opt('--only')?.split(',').map(s => s.trim());
const ONLY_LIB = opt('--library');
const BASE = (process.env.STRAPI_URL || 'https://cms.nahjalbalaghah.org').replace(/\/$/, '');
const TOKEN = process.env.STRAPI_TOKEN;
const EDITION = 'Qutbuddin';

if (!csvPath) { console.error('Usage: node --env-file=.env.strapi scripts/link-manuscript-images.mjs <file.csv> [--apply]'); process.exit(1); }
if (!TOKEN) { console.error('STRAPI_TOKEN not set (use --env-file=.env.strapi)'); process.exit(1); }

const LIBRARIES = [
  {
    key: 'marashi', column: 1, label: "Mar'ashi",
    // "AH-images275-AH-images-276", "*****-AH-images-337", "AH-images-223-****" -> every number is a page
    parse: (cell) => (cell.match(/\d+/g) || []).map(Number),
    fileName: (n) => `Qum_Mar'ashi Library 3827_469 AH-images-${String(n).padStart(3, '0')}.jpg`,
    owns: (name) => name.startsWith("Qum_Mar'ashi Library 3827"),
  },
  {
    key: 'nasiri', column: 2, label: 'Nasiri',
    // "pict0021", "pict0-165", "pict080", "pict00105", "oict0159", "pict0-191-pict0-192"
    parse: (cell) => (cell.replace(/[a-z]+0*-?/gi, ' ').match(/\d+/g) || []).map(Number),
    fileName: (n) => `PICT${String(n).padStart(4, '0')}.JPG`,
    owns: (name) => /^PICT\d+\.JPG$/i.test(name),
  },
].filter(l => !ONLY_LIB || l.key === ONLY_LIB);

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
    const r = await strapi('GET', `${path}${path.includes('?') ? '&' : '?'}pagination[page]=${page}&pagination[pageSize]=100`);
    out.push(...r.data);
    if (page >= r.meta.pagination.pageCount) return out;
  }
}

// --- CSV ---
const splitCells = (line) => {
  const out = []; let f = '', q = false;
  for (const c of line) { if (c === '"') q = !q; else if (c === ',' && !q) { out.push(f); f = ''; } else f += c; }
  out.push(f); return out.map(s => s.trim());
};
const normSection = (s) => {
  if (/^\?+$/.test(s)) return '0.1'; // introduction row
  if (/\.\d{5,}$/.test(s)) return String(+(+s).toFixed(3)).replace(/^(\d+\.\d*?)0*$/, '$1'); // Excel float artifacts
  return s;
};
const rows = {}; // section -> { marashi: [n], nasiri: [n] }
for (const line of fs.readFileSync(csvPath, 'utf8').replace(/^﻿/, '').trim().split(/\r?\n/).slice(1)) {
  const cells = splitCells(line);
  const section = normSection(cells[0]);
  const row = rows[section] ??= {};
  for (const lib of LIBRARIES) {
    const list = row[lib.key] ??= [];
    for (const n of lib.parse(cells[lib.column] || '')) if (!list.includes(n)) list.push(n);
  }
}

// --- Strapi state ---
console.log('Loading Media Library, manuscripts, posts, editions…');
const media = await strapi('GET', '/api/upload/files?fields[0]=name');
const mediaByName = new Map();
for (const f of media) (mediaByName.get(f.name) ?? mediaByName.set(f.name, []).get(f.name)).push(f);

const manuscripts = await fetchAll('/api/manuscripts?fields[0]=section&populate[files][fields][0]=name');
const existing = new Map(); // `${section}|${lib}` -> [entry]
for (const m of manuscripts) for (const lib of LIBRARIES) {
  if ((m.files || []).some(f => lib.owns(f.name))) {
    const k = `${String(m.section).trim()}|${lib.key}`;
    (existing.get(k) ?? existing.set(k, []).get(k)).push(m);
  }
}

const editions = (await strapi('GET', '/api/editions')).data;
const edition = editions.find(e => e.title === EDITION);
if (!edition) throw new Error(`Edition "${EDITION}" not found`);

const posts = await fetchAll('/api/posts?fields[0]=sermonNumber&populate[editions][fields][0]=title');
const postBySection = new Map();
for (const p of posts) {
  const s = String(p.sermonNumber ?? '').trim();
  if (!s) continue;
  const eds = Array.isArray(p.editions) ? p.editions : p.editions ? [p.editions] : [];
  const isQutbuddin = eds.some(e => e.title === EDITION);
  const cur = postBySection.get(s);
  if (!cur || (isQutbuddin && !cur.isQutbuddin)) postBySection.set(s, { documentId: p.documentId, isQutbuddin });
}
console.log(`  ${media.length} files, ${manuscripts.length} manuscript entries, ${posts.length} posts`);

// --- Plan ---
const plan = [], skipped = [], problems = [];
for (const [section, row] of Object.entries(rows)) {
  if (ONLY && !ONLY.includes(section)) continue;
  for (const lib of LIBRARIES) {
    const nums = row[lib.key] || [];
    if (!nums.length) continue;
    if (existing.has(`${section}|${lib.key}`)) { skipped.push(`${section} ${lib.label}`); continue; }
    const fileIds = [];
    for (const n of nums) {
      const hits = mediaByName.get(lib.fileName(n)) || [];
      if (hits.length !== 1) { problems.push(`${section} ${lib.label}: ${lib.fileName(n)} found ${hits.length}x`); continue; }
      fileIds.push(hits[0].id);
    }
    if (!fileIds.length) continue;
    const post = postBySection.get(section);
    if (!post) problems.push(`${section} ${lib.label}: no post with sermonNumber ${section} (entry created without post link)`);
    plan.push({ section, lib, nums, fileIds, post });
  }
}

for (const p of plan) console.log(`CREATE ${p.section.padEnd(6)} ${p.lib.label.padEnd(9)} pages [${p.nums.join(' ')}]${p.post ? '' : '  (no post)'}`);
console.log(`\n${plan.length} to create (${LIBRARIES.map(l => `${l.label}: ${plan.filter(p => p.lib === l).length}`).join(', ')}), ${skipped.length} skipped (entry already exists)`);
if (problems.length) console.log(`\nWarnings (${problems.length}):\n  ` + problems.join('\n  '));

if (!APPLY) { console.log('\nDRY RUN — pass --apply to write.'); process.exit(0); }

// --- Apply ---
let ok = 0; const failed = []; const created = [];
const queue = [...plan];
await Promise.all(Array.from({ length: 4 }, async () => {
  for (let p; (p = queue.shift());) {
    try {
      const r = await strapi('POST', '/api/manuscripts?status=published', {
        data: {
          section: p.section,
          files: p.fileIds,
          editions: [edition.documentId],
          ...(p.post && { post: p.post.documentId }),
        },
      });
      created.push({ section: p.section, library: p.lib.label, documentId: r.data.documentId });
      if (++ok % 50 === 0) console.log(`  …${ok}/${plan.length}`);
    } catch (e) { failed.push(`${p.section} ${p.lib.label}: ${e.message}`); }
  }
}));
const logPath = `scripts/manuscript-import-log-${Date.now()}.json`;
fs.writeFileSync(logPath, JSON.stringify(created, null, 2));
console.log(`\nCreated ${ok}/${plan.length}. Log of created entries: ${logPath}`);
if (failed.length) console.log(`Failed (${failed.length}):\n  ` + failed.join('\n  '));
