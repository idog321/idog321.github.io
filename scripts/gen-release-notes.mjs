// gen-release-notes — builds the website's release notes page from the app's own
// release notes, so the two can never disagree.
//
//   npm run release-notes
//
// The source of truth is TopoKit/Models/ReleaseNotes.swift, the array that feeds
// the in-app What's New sheet. He already prepends a VersionRelease there when he
// cuts a release; this turns that same array into public/release-notes/index.html.
//
// It writes a plain page, not an Astro one. Release notes are about the app, not
// about how to use it, so they belong beside privacy and terms rather than inside
// the manual — same shell, same stylesheet, same nav and footer.
//
// The output is release-notes/index.html rather than release-notes.html so the
// published URL keeps its trailing slash: it is already in the sitemap and Google
// has already crawled it.
//
// Deliberately NOT a build step. The app lives in a sibling repo that a CI runner
// checking out this one will not have, so a build that reached across for it would
// pass here and fail there. Run it locally when the app's notes change; the
// generated HTML is committed and is what ships.
//
// Titles keep the app's Title Case rather than the manual's sentence case: these
// are his shipped words, quoted, and rewriting them would defeat the point.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const SOURCE =
  process.argv[2] || resolve(process.cwd(), '../TopoKit/TopoKit/Models/ReleaseNotes.swift');
const OUT = resolve(process.cwd(), 'public/release-notes/index.html');

// Versions that exist only as a beta. Clear an entry the day it reaches the
// App Store — nothing detects this, because the app repo has no notion of
// "shipped", only of what the current build is.
const UNRELEASED = new Set(['1.1.1']);

if (!existsSync(SOURCE)) {
  console.error(`Cannot find the app's release notes:\n  ${SOURCE}\n`);
  console.error('Pass the path as an argument if the app repo lives somewhere else.');
  console.error(`Leaving ${OUT} untouched.`);
  process.exit(1);
}

// Swift string literals, escapes and all — 1.1.1's title carries \"No Map\".
const STR = String.raw`"((?:[^"\\]|\\.)*)"`;
const unescapeSwift = (s) => s.replace(/\\(["\\])/g, '$1');

// The page is written as HTML now, so every value has to be escaped rather than
// trusted — one stray & in a release note would otherwise break the markup.
const esc = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Typographic quotes, which the markdown pipeline used to apply for free.
    .replace(/"([^"]*)"/g, '\u201c$1\u201d');

const raw = readFileSync(SOURCE, 'utf8');
const releases = [];

for (const chunk of raw.split('VersionRelease(').slice(1)) {
  const version = new RegExp(`version:\\s*${STR}`).exec(chunk);
  if (!version) continue;
  const items = [
    ...chunk.matchAll(
      new RegExp(`ReleaseNoteItem\\(\\s*title:\\s*${STR},\\s*description:\\s*${STR}\\s*\\)`, 'g')
    ),
  ].map((m) => ({ title: unescapeSwift(m[1]), description: unescapeSwift(m[2]) }));
  if (items.length) releases.push({ version: unescapeSwift(version[1]), items });
}

if (!releases.length) {
  console.error(`Parsed no releases out of ${SOURCE}. The file's shape must have changed.`);
  console.error(`Leaving ${OUT} untouched.`);
  process.exit(1);
}

const body = releases
  .map((r) => {
    const beta = UNRELEASED.has(r.version);
    const id = `version-${r.version.replace(/\./g, '-')}`;
    return (
      `      <h2 class="release-version" id="${id}">Version ${esc(r.version)}` +
      (beta ? ` <span class="release-beta">Beta</span>` : '') +
      `</h2>\n` +
      (beta ? `      <p class="release-unreleased">Not on the App Store yet.</p>\n` : '') +
      r.items
        .map(
          (i) =>
            `      <h3 class="release-item">${esc(i.title)}</h3>\n` +
            `      <p>${esc(i.description)}</p>`
        )
        .join('\n')
    );
  })
  .join('\n\n');

// Absolute asset paths: this page sits one directory deep, so the relative ones
// the other static pages use would resolve inside /release-notes/.
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Release notes — TopoKit</title>
  <meta name="description" content="What changed in each version of TopoKit, newest first.">
  <meta name="color-scheme" content="light dark">
  <link rel="canonical" href="https://topokit.ca/release-notes/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="TopoKit">
  <meta property="og:url" content="https://topokit.ca/release-notes/">
  <meta property="og:title" content="TopoKit — Release notes">
  <meta property="og:description" content="What changed in each version of TopoKit, newest first.">
  <meta property="og:image" content="https://topokit.ca/Images/og-card.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://topokit.ca/Images/og-card.jpg">
  <link rel="stylesheet" href="/style.css">
  <link rel="icon" type="image/svg+xml" href="/Images/Logo/Logo.svg">
  <!-- Generated by scripts/gen-release-notes.mjs from the app's ReleaseNotes.swift.
       Edit the Swift file and re-run \`npm run release-notes\`; edits here are lost. -->
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

  <main class="legal-page release-notes">
    <h1>Release notes</h1>
    <p class="last-updated">Every TopoKit release, newest first. The same notes appear in the app under Settings, in What&rsquo;s New.</p>

${body}
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-inner">
      <div>
        <div class="footer-brand">TopoKit</div>
        <div class="footer-copy">&copy; 2026 Nikolay Senilov. All rights reserved.</div>
      </div>
      <ul class="footer-links">
        <li><a href="/manual/">Manual</a></li>
        <li><a href="/release-notes/">Release notes</a></li>
        <li><a href="/support">Support</a></li>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Use</a></li>
      </ul>
    </div>
  </footer>

</body>
</html>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html);

const counts = releases.map((r) => `${r.version} (${r.items.length})`).join(', ');
console.log(`Wrote ${OUT}`);
console.log(`  ${releases.length} releases: ${counts}`);
