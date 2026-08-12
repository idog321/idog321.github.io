// Compare a manual chapter against its committed version and report every
// fact-shaped token that disappeared. A cut is meant to remove prose, not facts;
// an earlier editing pass on this manual silently paraphrased away real UI strings,
// so every deletion gets checked mechanically rather than trusted.
//
//   node scripts/fact-diff.mjs <ref> <file>...
//
// Tokens tracked: numbers with units, "quoted UI strings", :ui[chips], **bold
// labels**, `code spans`, and internal links. Losing one is not automatically
// wrong — a deleted passage takes its facts with it — but each one must be a
// deliberate call, so they are all printed.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const [ref, ...files] = process.argv.slice(2);
if (!ref || !files.length) {
  console.error('usage: node scripts/fact-diff.mjs <git-ref> <file>...');
  process.exit(2);
}

const PATTERNS = {
  number: /\b\d[\d,]*(?:\.\d+)?\s?(?:px|pt|m|km|ft|mi|MB|GB|KB|s|ms|%|°|x|×)?\b/g,
  quoted: /"[^"\n]{2,60}"/g,
  chip: /:ui\[[^\]]+\]/g,
  bold: /\*\*[^*\n]{2,60}\*\*/g,
  code: /`[^`\n]{1,60}`/g,
  link: /\]\((\/manual\/[^)]*)\)/g,
};

const grab = (text, re) => {
  const out = new Map();
  for (const m of text.matchAll(re)) {
    const k = (m[1] ?? m[0]).trim();
    out.set(k, (out.get(k) ?? 0) + 1);
  }
  return out;
};

let lostTotal = 0;
for (const file of files) {
  const before = execSync(`git show ${ref}:${file}`, { encoding: 'utf8', maxBuffer: 1 << 26 });
  const after = readFileSync(file, 'utf8');
  const w = (s) => s.split(/\s+/).filter(Boolean).length;

  const lost = [];
  for (const [kind, re] of Object.entries(PATTERNS)) {
    const b = grab(before, new RegExp(re.source, re.flags));
    const a = grab(after, new RegExp(re.source, re.flags));
    for (const [tok, n] of b) {
      const gone = n - (a.get(tok) ?? 0);
      if (gone > 0) lost.push({ kind, tok, gone });
    }
  }

  console.log(`\n${'='.repeat(72)}`);
  console.log(`${file}`);
  console.log(`  ${w(before)} → ${w(after)} words  (−${w(before) - w(after)})`);
  console.log('='.repeat(72));

  if (!lost.length) {
    console.log('  no fact-shaped tokens lost');
    continue;
  }
  const byKind = {};
  for (const l of lost) (byKind[l.kind] ??= []).push(l);
  for (const kind of Object.keys(PATTERNS)) {
    const items = byKind[kind];
    if (!items) continue;
    console.log(`\n  ${kind.toUpperCase()} (${items.length})`);
    for (const i of items) console.log(`    − ${i.tok}${i.gone > 1 ? `  ×${i.gone}` : ''}`);
  }
  lostTotal += lost.length;
}

console.log(`\n${lostTotal} fact-shaped token(s) removed across ${files.length} file(s). Review each.`);
