#!/usr/bin/env node
/**
 * Load an edition workbook (sheets "Section 1/2/3": Section | Number | Arabic | Translation | Headings)
 * as new posts for an existing edition, attached to the same post-bases as a reference edition.
 *
 * Numbers like "11.2.1" / "12.3" / "13.5" (leading "1" + type digit) are normalised to "1.2.1" / "2.3" / "3.5".
 * A row "N.M" is the post's title row (for single-paragraph posts it holds the full text);
 * rows "N.M.P" are paragraphs.
 *
 * Usage:
 *   node --env-file=.env.strapi scripts/edition-import/load-edition.mjs <workbook.xlsx> --edition "<title>" [--ref Qutbuddin] [--only 1.2,3.5] [--apply]
 *
 * Posts that already exist for the target edition are skipped, so re-running is safe.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { openWorkbook } from './readxlsx.mjs';

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const xlsx = args[0];
const EDITION = opt('--edition');
const REF = opt('--ref') || 'Qutbuddin';
const ONLY = opt('--only')?.split(',');
const APPLY = args.includes('--apply');
const BASE = (process.env.STRAPI_URL || 'https://cms.nahjalbalaghah.org').replace(/\/$/, '');
const TOKEN = process.env.STRAPI_TOKEN;
if (!xlsx || !EDITION || !TOKEN) {
  console.error('Usage: load-edition.mjs <workbook.xlsx> --edition <title> [--ref <title>] [--only ..] [--apply]  (STRAPI_TOKEN required)');
  process.exit(1);
}

async function strapi(method, p, body) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${BASE}${p}`, {
      method,
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    if (res.ok) return text ? JSON.parse(text) : null;
    if (res.status >= 500 && attempt < 3) { await new Promise(r => setTimeout(r, 1000 * attempt)); continue; }
    throw new Error(`${method} ${p} -> ${res.status}: ${text.slice(0, 400)}`);
  }
}
async function fetchAll(p) {
  const out = [];
  for (let page = 1; ; page++) {
    const r = await strapi('GET', `${p}&pagination[page]=${page}&pagination[pageSize]=100`);
    out.push(...r.data);
    if (page >= r.meta.pagination.pageCount) return out;
  }
}

// --- read workbook ---
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'edition-'));
// On Windows use the built-in bsdtar (Git Bash's GNU tar treats "C:" as a remote host)
const tar = process.platform === 'win32' ? path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
execFileSync(tar, ['-xf', path.resolve(xlsx), '-C', tmp]);
const wb = openWorkbook(tmp);
const TYPES = { 1: 'Oration', 2: 'Letter', 3: 'Saying' };
const posts = new Map();
const notes = [];
// Every "Section …" sheet is read; the type (1 Oration / 2 Letter / 3 Saying) comes from the Section column ("11", "12.0", …)
const sectionSheets = wb.sheetNames.map((n, i) => [n, i + 1]).filter(([n]) => /^section/i.test(n.trim()));
if (!sectionSheets.length) throw new Error(`No "Section" sheets. Sheets: ${wb.sheetNames.join(', ')}`);
for (const [sheetName, sheetIdx] of sectionSheets) {
  for (const row of wb.readSheet(sheetIdx).slice(1)) {
    const raw = String(row[1] ?? '').replace(/"/g, '').trim();
    if (!raw) continue;
    const t = +(String(row[0] ?? '').match(/^1?([123])(\.0)?$/) || [])[1];
    if (!t) { notes.push(`skipped "${raw}" in ${sheetName}: unknown Section "${row[0]}"`); continue; }
    const num = raw.startsWith(`1${t}.`) ? raw.slice(1) : raw;
    if (!/^\d+\.\d+(\.\d+)?$/.test(num) || +num.split('.')[0] !== t) { notes.push(`skipped bad number "${raw}" (Section ${row[0]})`); continue; }
    const ar = String(row[2] ?? '').trim(), en = String(row[3] ?? '').trim();
    const postNum = num.split('.').slice(0, 2).join('.');
    if (!ar && !en) { notes.push(`skipped empty row ${num}`); continue; }
    const post = posts.get(postNum) ?? posts.set(postNum, { type: TYPES[t], title: null, paragraphs: [] }).get(postNum);
    if (num === postNum) post.title = { ar, en };
    else if (post.paragraphs.some(p => p.number === num)) notes.push(`skipped duplicate paragraph ${num}`);
    else post.paragraphs.push({ number: num, ar, en });
  }
}
const parts = (n) => n.split('.').map(Number);
for (const p of posts.values()) p.paragraphs.sort((a, b) => parts(a.number)[2] - parts(b.number)[2]);

// --- Strapi state ---
const editions = (await strapi('GET', '/api/editions?pagination[pageSize]=100')).data;
const target = editions.find(e => e.title === EDITION), ref = editions.find(e => e.title === REF);
if (!target || !ref) throw new Error(`Edition not found. Available: ${editions.map(e => e.title).join(', ')}`);
const enc = encodeURIComponent;
const refPosts = await fetchAll(`/api/posts?filters[editions][title][$eq]=${enc(REF)}&fields[0]=sermonNumber&fields[1]=title&fields[2]=type&populate[post_base][fields][0]=documentId`);
const existing = new Set((await fetchAll(`/api/posts?filters[editions][title][$eq]=${enc(EDITION)}&fields[0]=sermonNumber`)).map(p => p.sermonNumber));
const refBy = new Map(refPosts.map(p => [p.sermonNumber, p]));

const plan = [], skipped = [];
for (const [num, p] of posts) {
  if (ONLY && !ONLY.includes(num)) continue;
  if (existing.has(num)) { skipped.push(`${num} (already loaded)`); continue; }
  const r = refBy.get(num);
  if (!r?.post_base) { skipped.push(`${num} (no ${REF} post / post-base to attach to)`); continue; }
  if (!p.title?.ar && !p.paragraphs.some(x => x.ar)) { skipped.push(`${num} (no Arabic in workbook)`); continue; }
  let title = p.title?.ar;
  if (!title) { title = r.title; notes.push(`${num}: no title row, using ${REF} title`); }
  plan.push({ num, p, r, title, titleEn: p.title?.en || '' });
}
console.log(`${posts.size} posts in workbook; ${plan.length} to create (${plan.reduce((a, x) => a + x.p.paragraphs.length, 0)} paragraphs); ${skipped.length} skipped`);
if (skipped.length) console.log('Skipped:\n  ' + skipped.join('\n  '));
if (notes.length) console.log('Notes:\n  ' + notes.join('\n  '));
if (!APPLY) { console.log('\nDRY RUN — pass --apply to write.'); process.exit(0); }

// --- apply ---
const log = [];
const logPath = `scripts/edition-import/import-log-${Date.now()}.json`;
let ok = 0; const failed = [];
const queue = [...plan];
await Promise.all(Array.from({ length: 3 }, async () => {
  for (let item; (item = queue.shift());) {
    const entry = { sermonNumber: item.num, paragraphs: [] };
    try {
      for (const para of item.p.paragraphs) {
        const r = await strapi('POST', '/api/paragraphs?status=published', { data: {
          arabic: para.ar, number: para.number, wasTitle: false,
          translations: para.en ? [{ type: 'en', text: para.en }] : [],
          editions: [target.documentId],
        } });
        entry.paragraphs.push(r.data.documentId);
      }
      const r = await strapi('POST', '/api/posts?status=published', { data: {
        title: item.title, type: item.r.type || item.p.type, sermonNumber: item.num,
        translations: item.titleEn ? [{ type: 'en', text: item.titleEn }] : [],
        paragraphs: entry.paragraphs, editions: [target.documentId], post_base: item.r.post_base.documentId,
      } });
      entry.post = r.data.documentId;
      if (++ok % 50 === 0) console.log(`  …${ok}/${plan.length}`);
    } catch (e) { failed.push(`${item.num}: ${e.message}`); }
    log.push(entry);
    fs.writeFileSync(logPath, JSON.stringify(log, null, 1));
  }
}));
console.log(`\nCreated ${ok}/${plan.length} posts. Log (post + paragraph documentIds): ${logPath}`);
if (failed.length) console.log(`Failed (${failed.length}):\n  ` + failed.join('\n  '));
