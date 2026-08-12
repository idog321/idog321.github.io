// remark-glossary
// Makes GIS jargon self-explaining: the first time a chapter uses a glossary
// term, it becomes a hoverable/tappable chip that shows the definition inline.
//
// Definitions come from glossary.md itself — it stays the single source of
// truth, so editing an entry there updates every chapter. Entries look like:
//     **Term** — definition text
//     **[Term](/link/)** — definition text
//
// Only the FIRST occurrence per page is wrapped, so a chapter that says
// "raster" forty times gets one chip, not forty.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { visit } from 'unist-util-visit';

const GLOSSARY = resolve(process.cwd(), 'src/content/docs/manual/glossary.md');

// Terms too generic to auto-match: they appear constantly in ordinary prose
// and a chip on them is noise, not help. 'route' arrives as an alias of
// "Waypoint / route / track" and was chipping the plain word in nine chapters —
// "draws the route on the map" popped a GPX-format definition.
const SKIP = new Set(['track', 'raster', 'route']);

// Never wrap inside these — a chip in a heading breaks anchors, and one inside
// a link or code span produces nested interactive elements.
const OPAQUE = new Set(['heading', 'link', 'linkReference', 'inlineCode', 'code', 'html', 'definition']);

const stripMd = (s) =>
  s
    // :ui[Label]{icon=x} and :ios[…]/:mac[…] directives render as chips on the
    // glossary page, but a hover bubble is plain text — reduce them to their
    // label, or the raw directive syntax shows verbatim in every bubble.
    .replace(/:[a-z][\w-]*\[([^\]]*)\](\{[^}]*\})?/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Single-asterisk emphasis too: the bubble is plain text, so an unstripped
    // *word* is painted with its asterisks.
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

const escAttr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function loadTerms() {
  let raw;
  try {
    raw = readFileSync(GLOSSARY, 'utf8');
  } catch {
    return [];
  }
  const terms = [];
  // The optional paren group after the bold is a file-extension note outside
  // the term — `**GPX** (`.gpx`) — …`. Six format entries carry one; requiring
  // the em-dash immediately after the bold silently dropped all six as terms.
  for (const m of raw.matchAll(/^\*\*(.+?)\*\*(?:\s+\([^()\n]*\))?\s+—\s+(.+)$/gm)) {
    const label = stripMd(m[1]);
    // Entries close with a "See [Chapter](/link/)." pointer for readers who are
    // in the glossary. A hover chip strips the link, so that sentence would show
    // as a dead instruction on every chip in the manual — drop it from the chip.
    const def = stripMd(m[2]).replace(/\s*See [^.]*\.\s*$/, '');
    // "CRS (coordinate reference system)" -> match on "CRS"
    // "Waypoint / track" -> two aliases
    // "Orthometric vs ellipsoidal height" -> two aliases
    const head = label.replace(/\s*\(.*?\)\s*/g, ' ').trim();
    for (const alias of head.split(/\s+\/\s+|\s+vs\s+/i)) {
      const a = alias.trim();
      // 3-letter terms are allowed only when they are all-caps acronyms (GPX, WMS,
      // CRS, DEM). Those are exactly the jargon a newcomer needs, and being all-caps
      // they cannot collide with ordinary prose the way a short lowercase word would.
      const longEnough = a.length >= 4 || (a.length >= 3 && a === a.toUpperCase());
      if (longEnough && !SKIP.has(a.toLowerCase())) terms.push({ alias: a, def });
    }
  }
  // Longest first so "Web Mercator" wins over a bare "Mercator" substring.
  return terms.sort((a, b) => b.alias.length - a.alias.length);
}

export default function remarkGlossary() {
  const terms = loadTerms();

  return (tree, file) => {
    // The glossary page defines these words; chipping them there is circular.
    if (String(file.history?.[0] || '').endsWith('glossary.md')) return;
    if (!terms.length) return;

    const used = new Set();

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || OPAQUE.has(parent.type) || index === null) return;

      // Pick the match that occurs EARLIEST in this node, not the first term that
      // happens to match anywhere: terms are sorted longest-first, so a long term
      // late in the string used to beat a short term early in it, and the early one
      // never got another look (only the tail is re-visited after a split).
      let best = null;
      for (const { alias, def } of terms) {
        if (used.has(alias)) continue;
        const re = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(s|es)?\\b`, 'i');
        const m = re.exec(node.value);
        if (!m) continue;
        if (!best || m.index < best.m.index || (m.index === best.m.index && alias.length > best.alias.length)) {
          best = { alias, def, m };
        }
      }

      {
        const { alias, def, m } = best || {};
        if (!best) return;
        used.add(alias);
        const before = node.value.slice(0, m.index);
        const hit = m[0];
        const after = node.value.slice(m.index + hit.length);

        const chip = {
          type: 'html',
          value:
            // A <span>, not a <button>: browsers blockify form controls, so a
            // button cannot be display:inline and its taller box inflated every
            // line it appeared on — visible as double spacing in table cells.
            `<span class="gloss" role="button" tabindex="0" data-def="${escAttr(def)}" ` +
            `aria-label="${escAttr(alias)}: ${escAttr(def)}">${hit}</span>`,
        };

        const replacement = [];
        if (before) replacement.push({ type: 'text', value: before });
        replacement.push(chip);
        if (after) replacement.push({ type: 'text', value: after });
        parent.children.splice(index, 1, ...replacement);
        // Re-visit the tail so later terms can still match in `after`.
        return index + replacement.length - 1;
      }
    });
  };
}
