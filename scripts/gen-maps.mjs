#!/usr/bin/env node
// Generates public/maps/index.html from src/data/maps.json, the way
// gen-release-notes.mjs generates the release notes from ReleaseNotes.swift.
// Edit maps.json and run `npm run maps`; edits to index.html are lost.
//
// Unlike the release notes, the source lives in this repo, so `npm run build`
// runs this too and the live page can never lag the data. The generated page is
// still committed, because the dev server serves public/ as it is on disk.
//
// maps.json: { "intro": [...], "countries": [{id, name, note}], "sources": [...] }.
// A source carries: id, country, jurisdiction (null for nationwide), scope
// (national | regional | local), name, publisher, kind (file | xyz | wms),
// formats, cost (free | paid), price, licence {name, url, note}, links
// [{label, url}], coverage, what (one sentence), steps [], addresses
// [{label, url}], notes, preview, previewAlt, checked.
//
// The page is a directory: each country lists its nationwide sources, then one
// collapsed row per province or state holding that area's sources. Each source
// shows its name, a facts line and one sentence; the steps, addresses and notes
// sit behind a Details toggle. Inline text may use **bold**, `code` and
// [text](https://…), nothing else.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'src', 'data', 'maps.json'), 'utf8'));

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const inline = (s) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\[([^\]]+)\]\((https?:[^)]+|mailto:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

const kindWord = { file: 'Files', xyz: 'Tile service', wms: 'WMS' };

const factsLine = (s) => {
  const parts = [esc(s.publisher), esc((s.formats || []).join(', '))];
  parts.push(s.cost === 'free' ? 'Free' : 'Paid' + (s.price ? ', ' + esc(s.price) : ''));
  if (s.licence && s.licence.name) {
    const name = s.licence.url
      ? `<a href="${esc(s.licence.url)}" target="_blank" rel="noopener">${esc(s.licence.name)}</a>`
      : esc(s.licence.name);
    parts.push(name + (s.licence.note ? ', ' + esc(s.licence.note) : ''));
  }
  for (const l of s.links || []) parts.push(`<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`);
  return parts.join(' · ');
};

// A mailto link that opens an email with a few lines filled in. The site has
// no server, so the email is the form.
const mailto = (subject, body) =>
  'mailto:support@topokit.ca?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

// The details toggle names the action it leads to.
const detailsLabel = (s) => (s.kind === 'file' ? (s.cost === 'free' ? 'How to download' : 'How to buy') : 'How to add this service');

const reportLink = (s) => mailto(
  'Maps: problem with ' + s.name,
  'Entry: ' + s.name + '\nhttps://topokit.ca/maps/#' + s.id + '\n\nWhat is wrong:\n'
);

// Short names people type into the filter. Searches of three letters or fewer
// match whole words only, so "wa" finds Washington and Western Australia but
// not "water".
const ABBR = {
  'British Columbia': 'bc', 'Alberta': 'ab', 'Saskatchewan': 'sk', 'Manitoba': 'mb', 'Ontario': 'on', 'Québec': 'qc quebec',
  'New Brunswick': 'nb', 'Nova Scotia': 'ns', 'Prince Edward Island': 'pe pei', 'Newfoundland and Labrador': 'nl newfoundland labrador',
  'Yukon': 'yt yk', 'Northwest Territories': 'nt nwt', 'Nunavut': 'nu',
  'Alabama': 'al', 'Alaska': 'ak', 'Arizona': 'az', 'Arkansas': 'ar', 'California': 'ca', 'Colorado': 'co', 'Connecticut': 'ct',
  'Delaware': 'de', 'District of Columbia': 'dc', 'Florida': 'fl', 'Georgia': 'ga', 'Hawaii': 'hi', 'Idaho': 'id', 'Illinois': 'il',
  'Indiana': 'in', 'Iowa': 'ia', 'Kansas': 'ks', 'Kentucky': 'ky', 'Louisiana': 'la', 'Maine': 'me', 'Maryland': 'md',
  'Massachusetts': 'ma', 'Michigan': 'mi', 'Minnesota': 'mn', 'Mississippi': 'ms', 'Missouri': 'mo', 'Montana': 'mt',
  'Nebraska': 'ne', 'Nevada': 'nv', 'New Hampshire': 'nh', 'New Jersey': 'nj', 'New Mexico': 'nm', 'New York': 'ny',
  'North Carolina': 'nc', 'North Dakota': 'nd', 'Ohio': 'oh', 'Oklahoma': 'ok', 'Oregon': 'or', 'Pennsylvania': 'pa',
  'Rhode Island': 'ri', 'South Carolina': 'sc', 'South Dakota': 'sd', 'Tennessee': 'tn', 'Texas': 'tx', 'Utah': 'ut',
  'Vermont': 'vt', 'Virginia': 'va', 'Washington': 'wa', 'West Virginia': 'wv', 'Wisconsin': 'wi', 'Wyoming': 'wy',
  'New South Wales': 'nsw', 'Victoria': 'vic', 'Queensland': 'qld', 'South Australia': 'sa', 'Western Australia': 'wa',
  'Tasmania': 'tas', 'Northern Territory': 'nt', 'Australian Capital Territory': 'act canberra',
  'Northern Ireland': 'ni',
};
const COUNTRY_WORDS = {
  ca: 'canada', us: 'united states usa us america', au: 'australia', nz: 'new zealand nz aotearoa',
  uk: 'united kingdom uk britain great britain', ie: 'ireland',
};

// A sample with no file in public/Images/maps/ is left off rather than shipped
// as a broken image; the run lists them at the end.
const missing = new Set();

const sourceHtml = (s) => {
  const terms = [s.name, s.publisher, s.coverage, s.jurisdiction, ABBR[s.jurisdiction], COUNTRY_WORDS[s.country],
    (s.formats || []).join(' '), s.cost, kindWord[s.kind], s.what]
    .filter(Boolean).join(' ').toLowerCase();
  let h = `<article class="map-source" id="${esc(s.id)}" data-key="${esc(s.key || s.id)}" data-terms="${esc(terms)}" data-cost="${esc(s.cost)}" data-kind="${esc(s.kind)}">\n`;
  h += `<h4>${esc(s.name)}</h4>\n`;
  h += `<p class="map-meta">${factsLine(s)}</p>\n`;
  if (s.preview && !existsSync(join(root, 'public', 'Images', 'maps', s.preview))) {
    missing.add(s.preview);
  } else if (s.preview) {
    h += `<img class="map-preview" src="/Images/maps/${esc(s.preview)}" width="480" height="320" alt="${esc(s.previewAlt || s.name)}" loading="lazy">\n`;
  }
  if (s.what) h += `<p>${inline(s.what)}</p>\n`;
  h += `<details class="map-more"><summary>${detailsLabel(s)}</summary>\n`;
  if (s.steps && s.steps.length) {
    h += '<ol>\n';
    for (const st of s.steps) h += `<li>${inline(st)}</li>\n`;
    h += '</ol>\n';
  }
  if (s.addresses && s.addresses.length) {
    h += '<ul class="map-addresses">\n';
    for (const a of s.addresses) h += `<li>${esc(a.label)}: <code>${esc(a.url)}</code></li>\n`;
    h += '</ul>\n';
  }
  if (s.notes) h += `<p>${inline(s.notes)}</p>\n`;
  h += `<p class="map-report"><a href="${esc(reportLink(s))}">Report a problem with this entry</a></p>\n`;
  h += '</details>\n';
  h += '</article>\n';
  return h;
};

const summaryLine = (sources) => {
  const files = sources.filter((s) => s.kind === 'file').length;
  const services = sources.length - files;
  const paid = sources.filter((s) => s.cost !== 'free').length;
  const bits = [];
  if (files) bits.push(files === 1 ? '1 file source' : `${files} file sources`);
  if (services) bits.push(services === 1 ? '1 service' : `${services} services`);
  if (paid) bits.push(paid === 1 ? '1 paid' : `${paid} paid`);
  return bits.join(', ');
};

let body = '';
for (const c of data.countries) {
  const all = data.sources.filter((s) => s.country === c.id);
  if (!all.length) continue;
  body += `<h2 class="map-country" id="${esc(c.id)}">${esc(c.name)}</h2>\n`;
  const national = all.filter((s) => !s.jurisdiction);
  if (national.length) {
    body += `<h3 class="map-group">Nationwide</h3>\n`;
    for (const s of national) body += sourceHtml(s);
  }
  // A source that crosses a border (alsoIn) is listed under each area it covers.
  const juris = [...new Set(all.flatMap((s) => (s.jurisdiction ? [s.jurisdiction] : []).concat(s.alsoIn || [])))].sort((a, b) => a.localeCompare(b));
  for (const j of juris) {
    // Province- or state-wide sources first, then local ones (a park, a trail,
    // a regional district); otherwise the order of maps.json.
    const rank = { national: 0, regional: 1, local: 2 };
    const list = all.filter((s) => s.jurisdiction === j || (s.alsoIn || []).includes(j))
      .map((s) => (s.jurisdiction === j ? s : { ...s, key: s.id, id: s.id + '-' + j.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))
      .map((s, i) => [s, i])
      .sort((a, b) => ((rank[a[0].scope] ?? 1) - (rank[b[0].scope] ?? 1)) || (a[1] - b[1]))
      .map(([s]) => s);
    const jid = (c.id + '-' + j).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    body += `<details class="map-jurisdiction" id="${jid}">\n<summary><h3 class="map-jurisdiction-name">${esc(j)}</h3><span class="map-jurisdiction-count">${summaryLine(list)}</span></summary>\n`;
    for (const s of list) body += sourceHtml(s);
    body += '</details>\n';
  }
  if (c.note) body += `<p class="map-country-note">${inline(c.note)}</p>\n`;
}

const jump = data.countries
  .filter((c) => data.sources.some((s) => s.country === c.id))
  .map((c) => `<a href="#${esc(c.id)}">${esc(c.name)}</a>`)
  .concat(data.contribute ? [`<a href="#contribute">${esc(data.contribute.heading)}</a>`] : [])
  .join(' · ');

// The closing section: a panel of three buttons that each open a prepared
// email. The first link in maps.json is the filled one.
let contribute = '';
if (data.contribute) {
  const c = data.contribute;
  contribute += `    <section class="map-contribute" id="contribute">\n`;
  contribute += `      <h2>${esc(c.heading)}</h2>\n`;
  contribute += `      <p>${inline(c.text)}</p>\n`;
  contribute += '      <div class="map-contribute-links">\n' +
    c.links.map((l, i) => `        <a${i === 0 ? ' class="map-contribute-primary"' : ''} href="${esc(mailto(l.subject, l.body))}">${esc(l.label)}</a>\n`).join('') +
    '      </div>\n';
  if (c.fallback) contribute += `      <p class="map-contribute-fallback">${inline(c.fallback)}</p>\n`;
  contribute += '    </section>\n';
}

const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(data.title || 'Maps')} — TopoKit</title>
  <meta name="description" content="${esc(data.description)}">
  <meta name="color-scheme" content="light dark">
  <link rel="canonical" href="https://topokit.ca/maps/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="TopoKit">
  <meta property="og:url" content="https://topokit.ca/maps/">
  <meta property="og:title" content="${esc(data.title || 'Maps')} — TopoKit">
  <meta property="og:description" content="${esc(data.description)}">
  <meta property="og:image" content="https://topokit.ca/Images/og-card.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://topokit.ca/Images/og-card.jpg">
  <link rel="stylesheet" href="/style.css">
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png">
  <!-- Generated by scripts/gen-maps.mjs from src/data/maps.json.
       Edit the JSON and re-run \`npm run maps\`; edits here are lost. -->
</head>
<body>

  <!-- Navigation -->
  <nav class="nav">
    <div class="nav-inner">
      <a href="/" class="nav-logo">
        <picture>
          <img class="logo-wordmark" src="/Images/Logo/wordmark_for_light_background.png" alt="TopoKit" height="28">
        </picture>
      </a>
      <ul class="nav-links">
        <li><a href="/release-notes/">Release notes</a></li>
        <li><a href="/support">Support</a></li>
      </ul>
      <a href="/manual/" class="nav-cta">Manual</a>
    </div>
  </nav>

  <main class="legal-page maps-page">
    <h1>Maps</h1>
${data.intro.map((p) => `    <p class="map-intro">${inline(p)}</p>`).join('\n')}

    <form class="map-filter" role="search" onsubmit="return false">
      <input type="search" id="map-filter-text" placeholder="Search by place, map type or publisher" aria-label="Filter the list" autocomplete="off">
      <label><input type="checkbox" id="map-filter-free" checked> Free</label>
      <label><input type="checkbox" id="map-filter-paid" checked> Paid</label>
      <label><input type="checkbox" id="map-filter-files" checked> Files</label>
      <label><input type="checkbox" id="map-filter-services" checked> Services</label>
    </form>
    <p class="map-jump">${jump} · <span class="map-count">${data.sources.length} sources</span></p>
    <p class="map-empty" hidden>No maps found. Try a different place or search term.</p>

${body}
${contribute}${data.outro ? `    <p class="map-outro">${inline(data.outro)}</p>\n` : ''}  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-inner">
      <div>
        <div class="footer-brand">TopoKit</div>
        <div class="footer-copy">© 2026 Nikolay Senilov. All rights reserved.</div>
      </div>
      <ul class="footer-links">
        <li><a href="/manual/">Manual</a></li>
        <li><a href="/release-notes/">Release notes</a></li>
        <li><a href="/maps/">Maps</a></li>
        <li><a href="https://www.youtube.com/@TopoKitGIS">YouTube</a></li>
        <li><a href="/support">Support</a></li>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Use</a></li>
      </ul>
    </div>
  </footer>

  <script>
    // The list is complete without this. With it, the box narrows the list to
    // sources whose name, publisher, area or format contains the text, the
    // boxes hide free, paid, file or service sources, and a province or state
    // row opens itself when something inside it matches a typed filter.
    (function () {
      var text = document.getElementById('map-filter-text');
      var boxes = {
        free: document.getElementById('map-filter-free'),
        paid: document.getElementById('map-filter-paid'),
        files: document.getElementById('map-filter-files'),
        services: document.getElementById('map-filter-services')
      };
      var sources = Array.prototype.slice.call(document.querySelectorAll('.map-source'));
      var rows = Array.prototype.slice.call(document.querySelectorAll('.map-jurisdiction'));
      var groups = Array.prototype.slice.call(document.querySelectorAll('.map-group'));
      var countries = Array.prototype.slice.call(document.querySelectorAll('.map-country'));
      var count = document.querySelector('.map-count');
      var empty = document.querySelector('.map-empty');
      function allowed(s) {
        var cost = s.getAttribute('data-cost'), kind = s.getAttribute('data-kind');
        if (cost === 'free' ? !boxes.free.checked : !boxes.paid.checked) return false;
        if (kind === 'file' ? !boxes.files.checked : !boxes.services.checked) return false;
        return true;
      }
      function apply() {
        var q = text.value.trim().toLowerCase(), shownKeys = {}, allKeys = {};
        // Three letters or fewer match whole words only ("wa", "bc", "nsw").
        var qq = q.replace(/[^a-z0-9]/g, '');
        var word = q && q.length <= 3 && qq
          ? new RegExp('(^|[^a-z0-9])' + qq + '($|[^a-z0-9])')
          : null;
        sources.forEach(function (s) {
          var terms = s.getAttribute('data-terms');
          var hit = !q || (word ? word.test(terms) : terms.indexOf(q) !== -1);
          s.hidden = !(hit && allowed(s));
          allKeys[s.getAttribute('data-key')] = 1;
          if (!s.hidden) shownKeys[s.getAttribute('data-key')] = 1;
        });
        rows.forEach(function (r) {
          var any = r.querySelector('.map-source:not([hidden])') !== null;
          r.hidden = !any;
          if (q && any) r.open = true;
        });
        groups.forEach(function (g) {
          var el = g.nextElementSibling, any = false;
          while (el && el.classList.contains('map-source')) { if (!el.hidden) any = true; el = el.nextElementSibling; }
          g.hidden = !any;
        });
        countries.forEach(function (h) {
          var el = h.nextElementSibling, any = false;
          while (el && !el.classList.contains('map-country')) {
            if ((el.classList.contains('map-source') || el.classList.contains('map-jurisdiction')) && !el.hidden) any = true;
            if (el.classList.contains('map-country-note')) el.hidden = true;
            el = el.nextElementSibling;
          }
          h.hidden = !any;
          var n = h.nextElementSibling;
          while (n && !n.classList.contains('map-country')) { if (n.classList.contains('map-country-note')) n.hidden = !any; n = n.nextElementSibling; }
        });
        var shown = Object.keys(shownKeys).length, total = Object.keys(allKeys).length;
        if (count) count.textContent = shown === total ? total + ' sources' : shown + ' of ' + total + ' sources';
        if (empty) empty.hidden = shown !== 0;
      }
      text.addEventListener('input', apply);
      Object.keys(boxes).forEach(function (k) { boxes[k].addEventListener('change', apply); });
    })();

    // A link to one entry (the report emails carry one) points inside a closed
    // province or state row. Not every browser opens a <details> for its
    // fragment, so open the rows around the target and scroll to it.
    (function () {
      function reveal() {
        var t = location.hash && document.getElementById(location.hash.slice(1));
        if (!t || !t.closest('details:not([open])')) return;
        for (var d = t.closest('details'); d; d = d.parentElement.closest('details')) d.open = true;
        t.scrollIntoView();
      }
      reveal();
      window.addEventListener('hashchange', reveal);
    })();
  </script>
</body>
</html>
`;

writeFileSync(join(root, 'public', 'maps', 'index.html'), page);
console.log(`public/maps/index.html: ${data.sources.length} sources in ${data.countries.length} countries`);
if (missing.size) console.log(`Left off ${missing.size} sample(s) with no file in public/Images/maps/: ${[...missing].join(', ')}`);
