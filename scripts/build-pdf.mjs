// Builds a single PDF of the whole manual, styled like the site (dark theme,
// orange accents, UI chips), one chapter per page break. Run against a running
// `npm run preview` server:  node scripts/build-pdf.mjs
import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import { writeFileSync } from 'node:fs';

const BASE = process.env.PDF_BASE || 'http://localhost:4321';
// Sidebar order (matches astro.config.mjs groups).
const PAGES = [
  'manual/', 'manual/getting-started/', 'manual/interface/', 'manual/map-tools/',
  'manual/file-formats/', 'manual/projects-and-files/', 'manual/layer-tree/',
  'manual/points-lines-polygons/', 'manual/vector-import-export/',
  'manual/raster-overlays/', 'manual/tile-layers/', 'manual/elevation/',
  'manual/measurement/', 'manual/gps-and-track-recording/',
  'manual/directions-and-routing/', 'manual/ui-settings-styling/', 'manual/glossary/',
];

const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
const merged = await PDFDocument.create();

for (const slug of PAGES) {
  const page = await browser.newPage();
  // Light theme prints reliably in every PDF viewer (dark backgrounds don't).
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await page.goto(`${BASE}/${slug}`, { waitUntil: 'networkidle0', timeout: 60000 });
  // Force light theme, show everything (All mode), and load any lazy images.
  await page.evaluate(async () => {
    document.documentElement.dataset.theme = 'light';
    try { localStorage.setItem('starlight-theme', 'light'); } catch {}
    document.documentElement.removeAttribute('data-platform');
    document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
    await Promise.all(
      [...document.images].filter((i) => !i.complete).map(
        (i) => new Promise((r) => { i.onload = i.onerror = r; })
      )
    );
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  });
  await page.emulateMediaType('print');
  const buf = await page.pdf({
    printBackground: true,
    format: 'A4',
    margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' },
  });
  const doc = await PDFDocument.load(buf);
  const copied = await merged.copyPages(doc, doc.getPageIndices());
  copied.forEach((p) => merged.addPage(p));
  await page.close();
  console.log(`  ✓ ${slug}`);
}

await browser.close();
const out = new URL('../TopoKit-Manual.pdf', import.meta.url).pathname;
writeFileSync(out, await merged.save());
console.log(`\nWrote ${out} (${merged.getPageCount()} pages)`);
