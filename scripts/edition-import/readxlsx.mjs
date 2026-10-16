// Minimal .xlsx reader (no dependencies): reads cell text from an unzipped workbook directory.
import fs from 'node:fs';

const decode = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&amp;/g, '&');

const colIndex = (ref) => [...ref].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) - 1;

export function openWorkbook(dir) {
  const ssPath = `${dir}/xl/sharedStrings.xml`;
  const shared = fs.existsSync(ssPath)
    ? [...fs.readFileSync(ssPath, 'utf8').matchAll(/<si>([\s\S]*?)<\/si>/g)]
        .map(m => [...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(t => decode(t[1])).join(''))
    : [];
  const workbook = fs.readFileSync(`${dir}/xl/workbook.xml`, 'utf8');
  const sheetNames = [...workbook.matchAll(/<sheet [^>]*name="([^"]+)"/g)].map(m => decode(m[1]));

  const readSheet = (i) => {
    const xml = fs.readFileSync(`${dir}/xl/worksheets/sheet${i}.xml`, 'utf8');
    return [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map(rm => {
      const row = [];
      for (const [, ref, attrs, inner = ''] of rm[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const type = (attrs.match(/t="(\w+)"/) || [])[1];
        let v = (inner.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
        if (type === 's') v = shared[+v];
        else if (type === 'inlineStr') v = [...inner.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x => decode(x[1])).join('');
        else if (v !== undefined) v = decode(v);
        row[colIndex(ref)] = v ?? '';
      }
      return row;
    });
  };
  return { sheetNames, readSheet };
}
