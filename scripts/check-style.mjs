// Enforce the mechanical rules in STYLE.md across every chapter.
//
//   npm run lint:style
//
// The point of this file is that Nikolay should not have to notice a rule being
// broken for a second time. Every pattern here is one he already pointed at by
// hand. When a new rule arrives, add it here as well as to STYLE.md.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/content/docs/manual';

// A sentence repeated back-to-back on ONE line. `grep -c` counts lines, so this
// shape reports clean and has now shipped twice — see CLAUDE.md.
export function duplicatedSentences(text) {
  const hits = [];
  text.split('\n').forEach((line, i) => {
    // Not anchored to a capital: a double-applied replacement often repeats a
    // mid-sentence clause, which is how an em-dashed aside shipped twice.
    for (const m of line.matchAll(/(\S[^.!?]{25,200}[.!?])\s*(?=\1)/g)) {
      hits.push({ line: i + 1, text: m[1] });
    }
  });
  return hits;
}

const RULES = [
  {
    id: 'renamed-term',
    why: 'One name per control. It is the "tool card".',
    re: /\b(toolbar card|drawing card|measurement toolbar|floating toolbar)\b/gi,
  },
  {
    id: 'euphemism',
    why: 'Say the operation. Import, export, delete — not a friendly paraphrase.',
    re: /\b(bring(?:ing)? in your own|bring your data|move data in and out|move your data in and out|get(?:ting)? data in|getting your data out|take your data with you)\b/gi,
  },
  {
    id: 'author-placeholder',
    why: 'A note to the author shipped in the reader\'s prose.',
    re: /\[(author|TODO|TK|FIXME|insert|needs? )[^\]]{0,90}\]/gi,
  },
  {
    id: 'awkward-phrasing',
    why: 'Say it the obvious way: "without a signal", not "with no signal".',
    re: /\b(with no signal|without signal|filtered clean)\b/gi,
  },
  {
    id: 'filler',
    why: 'Delete rather than soften — the sentence survives without it.',
    re: /\b(if you like|worth noting|worth knowing|it'?s worth|of course|needless to say|as you would expect)\b/gi,
  },
  {
    id: 'manual-talking-about-itself',
    why: 'Start on the subject, not on a description of the chapter.',
    re: /\b(this (?:chapter|page|section) (?:covers|takes you|walks|is the|names)|if you skim only|the rest of this chapter)\b/gi,
  },
  {
    id: 'figurative',
    why: 'Matter of fact. Software does not travel, sit under, or bite.',
    re: /\b(never travels|a file you hold|sit under your data|that bite|the quick one)\b/gi,
  },
  {
    id: 'ai-tell',
    why: 'Vocabulary that reads as machine-written.',
    re: /\b(seamless(?:ly)?|robust|leverage|utilise|utilize|delve|ensure that|in order to)\b/gi,
  },
  {
    id: 'lucide-standin',
    why: 'Use his SVG, not a generic icon, for a real TopoKit control.',
    // "layers" left this list 2026-08-06: Nikolay supplied his own layers.png,
    // so the name now resolves to his artwork rather than the Lucide stand-in.
    re: /icon=(locate-fixed|crosshair|keyboard|map-pin)\b/g,
  },
  {
    id: 'third-party-name',
    why: 'His rule, refined 2026-08-12: products UNRELATED to TopoKit never appear — say "your desktop GIS", "another app". Actual dependencies and format owners (PROJ, GDAL tools, Copernicus, Google Earth for KML) are fine WITH a link.',
    // Apple is the platform and stays. USGS is excluded only because the
    // layer-tree screenshot's alt text describes what his own capture shows.
    re: /\b(QGIS|ArcGIS|ESRI|Google Maps|Garmin|Strava|OpenStreetMap|OpenTopoMap|Mapbox|Avenza|CalTopo|Gaia GPS|onX)\b/g,
  },
  {
    id: 'bracketed-sentence',
    why: 'A whole sentence in brackets should be a sentence.',
    re: /\((?=[A-Z])[^)]{40,}?[.!?]\)/g,
  },
  {
    id: 'broken-fence',
    why: 'A ::: fence must start its own line, or it renders as literal text.',
    re: /^(?=.*[A-Za-z])[^:\n]+:::(ios|mac|platforms|legend)?\s*$/gm,
  },
  {
    id: 'agent-debris',
    why: 'Review commentary that leaked into shipping prose.',
    // The first pattern is the one that shipped: an instruction addressed to an
    // editor, mid-paragraph, referring to the prose around it. Nothing a manual
    // says to its reader talks about "the preceding sentence".
    re: /(Suggested text:|Suggested:|\bUphold\b|The fix is right|\.swift:\d|\b(the preceding|the above|the previous) (sentence|paragraph|line|bullet)\b|\[VERIFY:|\b(Delete|Cut|Reword|Rewrite) (it|this|that) (—|-|because|since)\b|\bUnbracket\b|\blet it stand\b|\bKeep the sentence\b|\b(Remove|Replace|Rewrite|Reword|Trim|Compress|Keep|Move) (the|this|that|both|its) (whole )?(bullet|sentence|paragraph|clause|heading|lead-in|aside|list item)s?\b)/g,
  },
];

let total = 0;
for (const file of readdirSync(DIR).filter((f) => f.endsWith('.md'))) {
  const text = readFileSync(join(DIR, file), 'utf8');
  const lines = text.split('\n');
  const hits = [];
  for (const rule of RULES) {
    for (const m of text.matchAll(rule.re)) {
      const line = text.slice(0, m.index).split('\n').length;
      hits.push({ rule, line, match: m[0], ctx: (lines[line - 1] || '').trim() });
    }
  }
  for (const d of duplicatedSentences(text)) {
    hits.push({
      rule: {
        id: 'duplicated-sentence',
        why: 'The same sentence twice in a row on one line. grep -c cannot see this.',
      },
      line: d.line,
      match: d.text.slice(0, 60) + '…',
      ctx: (lines[d.line - 1] || '').trim(),
    });
  }
  if (!hits.length) continue;
  console.log(`\n${file}`);
  for (const h of hits.sort((a, b) => a.line - b.line)) {
    console.log(`  ${h.line}:  [${h.rule.id}]  "${h.match}"`);
    console.log(`      ${h.ctx.slice(0, 110)}`);
    console.log(`      ${h.rule.why}`);
  }
  total += hits.length;
}

console.log(`\n${total} style violation(s). See STYLE.md.`);
process.exit(total ? 1 : 0);
