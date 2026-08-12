// remark-ui-icon
// Renders inline UI-control markers in the manual into a small icon + label chip.
//
// Authoring syntax (markdown directive):
//   :ui[Save]{icon=download}     -> icon + "Save"
//   :ui[Settings]                -> icon looked up from the label ("settings")
//   :ui[the pencil]{icon=pencil} -> explicit icon, custom label
//
// The marker is a portable semantic annotation. On the website it renders as an
// open-licensed Lucide look-alike (SF Symbols are not licensed for web use). A
// future in-app renderer can map the same markers to real SF Symbols instead.
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { visit } from 'unist-util-visit';

const ICON_DIR = resolve(process.cwd(), 'node_modules/lucide-static/icons');

// Common control label -> Lucide icon name. Keeps most markers to just :ui[Label].
const LABEL_ICON = {
  save: 'download', add: 'plus', new: 'plus', delete: 'trash-2', remove: 'trash-2',
  edit: 'pencil', rename: 'pencil', settings: 'settings', search: 'search',
  compass: 'compass', measure: 'ruler', layers: 'layers', folder: 'folder',
  'new folder': 'folder-plus', 'create new folder': 'folder-plus', location: 'locate-fixed', 'current location': 'locate-fixed',
  route: 'route', cancel: 'x', close: 'x', done: 'check',
  undo: 'undo-2', redo: 'redo-2', photo: 'image', photos: 'image', camera: 'camera',
  offline: 'cloud-download', download: 'download', share: 'share-2', info: 'info',
  track: 'circle-dot',
  visibility: 'eye', hide: 'eye-hidden', import: 'file-input', export: 'file-output',
};
// Deliberately absent, on the same principle — a wrong icon is worse than none,
// so these render as text until he supplies artwork:
//   elevation / get elevation — mapped to Lucide's single-peak `mountain`; the
//     app's Get Elevation button draws mountain.2.
//   directions — mapped to Lucide's `navigation` arrow; the info-card button
//     draws arrow.triangle.turn.up.right.diamond.fill, and create-route.svg is
//     the sidebar tool's artwork, a different control.

// TopoKit's own icon artwork (the app's real glyphs) lives here and takes
// precedence over the Lucide look-alikes. Drop in more kebab-case .svg files
// to use them as :ui[Label]{icon=file-name}.
const CUSTOM_ICON_DIR = resolve(process.cwd(), 'src/assets/icons');

const iconCache = new Map();

/** True when his own artwork exists for this name, as a PNG mask or an SVG. */
function hasCustomIcon(name) {
  return (
    existsSync(resolve(CUSTOM_ICON_DIR, `${name}.png`)) ||
    existsSync(resolve(CUSTOM_ICON_DIR, `${name}.svg`))
  );
}

function inlineIcon(name) {
  if (!name) return '';
  if (iconCache.has(name)) return iconCache.get(name);
  let out = '';
  // PNG glyphs lifted from the app's own toolbar artwork are stored as alpha
  // masks and painted with currentColor, so they follow the light/dark theme.
  const maskFile = resolve(CUSTOM_ICON_DIR, `${name}.png`);
  if (existsSync(maskFile)) {
    const data = readFileSync(maskFile).toString('base64');
    // Single quotes inside the double-quoted style attribute: a double-quoted
    // url() would terminate the attribute and silently blank the mask.
    const url = `url(data:image/png;base64,${data})`;
    out =
      `<span class="ui-ctl__icon ui-ctl__icon--mask" aria-hidden="true" ` +
      `style="-webkit-mask-image:${url};mask-image:${url}"></span>`;
    iconCache.set(name, out);
    return out;
  }
  const customFile = resolve(CUSTOM_ICON_DIR, `${name}.svg`);
  if (existsSync(customFile)) {
    // Custom app icons are self-contained (own fills, strokes, clip paths):
    // keep their viewBox, namespace their ids so two icons on one page can't
    // collide, and swap hardcoded white for currentColor to follow the theme.
    const raw = readFileSync(customFile, 'utf8');
    const vb = (raw.match(/viewBox="([^"]+)"/) || [, '0 0 24 24'])[1];
    let inner = (raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/) || [, ''])[1].trim();
    inner = inner
      .replace(/id="([^"]+)"/g, `id="uic-${name}-$1"`)
      .replace(/url\(#([^)]+)\)/g, `url(#uic-${name}-$1)`)
      .replace(/#ffffff/gi, 'currentColor');
    out = `<svg class="ui-ctl__icon" viewBox="${vb}" width="1em" height="1em" aria-hidden="true">${inner}</svg>`;
  } else {
    const file = resolve(ICON_DIR, `${name}.svg`);
    if (existsSync(file)) {
      const raw = readFileSync(file, 'utf8');
      const inner = (raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/) || [, ''])[1].trim();
      out = `<svg class="ui-ctl__icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
    }
  }
  iconCache.set(name, out);
  return out;
}

function labelText(node) {
  let s = '';
  visit(node, (n) => { if (n.type === 'text' || n.type === 'inlineCode') s += n.value; });
  return s.trim();
}

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default function remarkUiIcon() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (!parent || index == null) return;
      if ((node.type === 'textDirective' || node.type === 'leafDirective') && node.name === 'ui') {
        const label = labelText(node);
        // Resolution order: an explicit icon=, then the label map, then his own
        // artwork under the kebab-cased label. That last step means :ui[Add Point]
        // finds add-point.svg on its own — before it was added, a bare chip for a
        // control he had already drawn rendered with no icon at all unless someone
        // remembered to type icon=add-point.
        const kebab = label.toLowerCase().replace(/\s+/g, '-');
        const iconName =
          node.attributes?.icon ||
          LABEL_ICON[label.toLowerCase()] ||
          (hasCustomIcon(kebab) ? kebab : null);
        const svg = inlineIcon(iconName);
        const html = `<span class="ui-ctl">${svg}<span class="ui-ctl__label">${escapeHtml(label)}</span></span>`;
        parent.children[index] = { type: 'html', value: html };
      }
    });
  };
}
