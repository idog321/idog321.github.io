// Validate every internal /manual/... link in the manual: the target chapter must
// exist, and any #anchor must match a real heading in it. A wrong anchor is worse
// than no link — it silently drops the reader at the top of the page.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/content/docs/manual';
const files = readdirSync(DIR).filter((f) => f.endsWith('.md'));

// slug: lowercase, drop anything that isn't a letter/digit/space/hyphen, spaces -> hyphens.
// Matches Starlight's GitHub-style heading slugs for the headings this manual uses.
const slug = (h) =>
  h
    .replace(/`/g, '')
    .replace(/\*\*/g, '')
    .replace(/:ui\[([^\]]*)\][^\s]*/g, '$1')
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const anchors = new Map(); // '/manual/foo/' -> Set of anchors
for (const f of files) {
  const route = f === 'index.md' ? '/manual/' : `/manual/${f.slice(0, -3)}/`;
  const heads = [...readFileSync(join(DIR, f), 'utf8').matchAll(/^#{2,6} (.+)$/gm)].map((m) =>
    slug(m[1]),
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
