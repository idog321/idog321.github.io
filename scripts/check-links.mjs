// Validate every internal /manual/... link in the manual: the target chapter must
// exist, and any #anchor must match a real heading in it. A wrong anchor is worse
// than no link — it silently drops the reader at the top of the page.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import GithubSlugger from 'github-slugger';

const DIR = 'src/content/docs/manual';
const files = readdirSync(DIR).filter((f) => f.endsWith('.md'));

// Astro builds heading ids with github-slugger, so the checker must too. A
// hand-rolled slug passed "storage-icloud" for "Storage & iCloud" while the
// page's real id is "storage--icloud" (the & is dropped, both spaces become
// hyphens), so every link to a Settings page would have landed at the top.
// Chips and bold render as their text; strip the markup the same way first.
const headingText = (h) =>
  h
    .replace(/`/g, '')
    .replace(/\*\*/g, '')
    .replace(/:ui\[([^\]]*)\][^\s]*/g, '$1')
    .replace(/:(?:ios|mac)\[([^\]]*)\]/g, '$1');

const anchors = new Map(); // '/manual/foo/' -> Set of anchors
for (const f of files) {
  const route = f === 'index.md' ? '/manual/' : `/manual/${f.slice(0, -3)}/`;
  // One slugger per file: a repeated heading gets "-1", as on the page.
  const slugger = new GithubSlugger();
  const heads = [...readFileSync(join(DIR, f), 'utf8').matchAll(/^#{2,6} (.+)$/gm)].map((m) =>
    slugger.slug(headingText(m[1])),
  );
  anchors.set(route, new Set(heads));
}

let bad = 0;
let total = 0;
for (const f of files) {
  const text = readFileSync(join(DIR, f), 'utf8');
  for (const m of text.matchAll(/\]\((\/manual\/[^)]*)\)/g)) {
    total++;
    const [path, frag] = m[1].split('#');
    const route = path.endsWith('/') ? path : `${path}/`;
    if (!anchors.has(route)) {
      console.log(`BROKEN CHAPTER  ${f}: ${m[1]}`);
      bad++;
    } else if (frag && !anchors.get(route).has(frag)) {
      console.log(`BROKEN ANCHOR   ${f}: ${m[1]}`);
      console.log(`                valid: ${[...anchors.get(route)].join(', ')}`);
      bad++;
    }
    if (route === (f === 'index.md' ? '/manual/' : `/manual/${f.slice(0, -3)}/`)) {
      console.log(`SELF-LINK       ${f}: ${m[1]}`);
      bad++;
    }
  }
}

console.log(`\n${total} internal links checked, ${bad} problem(s).`);
process.exit(bad ? 1 : 0);
