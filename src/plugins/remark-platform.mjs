// remark-platform
// Renders platform-scoped content markers for the Mac / iPhone / All toggle.
//
// Authoring syntax (markdown directives):
//   :::ios            -> <div class="platform-block" data-platform="ios">…</div>
//   ...block content
//   :::
//   :::mac ... :::    -> same, data-platform="mac"
//   :ios[tap More]    -> <span class="platform-inline" data-platform="ios">tap More</span>
//   :mac[right-click] -> same, data-platform="mac"
//
// Visibility is CSS-driven: the toggle stamps data-platform on <html>, and
// topokit.css hides non-matching content. In "All" mode, blocks show a small
// platform badge (CSS ::before) so readers can tell which platform is which.
// Screenshots follow the same rule: put the <img>/figure inside a block.
import { visit } from 'unist-util-visit';

const PLATFORMS = new Set(['ios', 'mac']);

export default function remarkPlatform() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        (node.type === 'containerDirective' || node.type === 'textDirective') &&
        PLATFORMS.has(node.name)
      ) {
        const data = node.data || (node.data = {});
        const isBlock = node.type === 'containerDirective';
        data.hName = isBlock ? 'div' : 'span';
        data.hProperties = {
          className: isBlock ? 'platform-block' : 'platform-inline',
          'data-platform': node.name,
        };
      }
      // ::::platforms wrapper around ios/mac blocks (and optionally a
      // ::::legend): the visible children sit side by side (CSS .platform-pair).
      if (node.type === 'containerDirective' && node.name === 'platforms') {
        const data = node.data || (node.data = {});
        data.hName = 'div';
        data.hProperties = { className: 'platform-pair' };
      }
      // ::::legend inside a platforms row: a single flex child holding the
      // numbered tool descriptions so they sit beside the diagram.
      if (node.type === 'containerDirective' && node.name === 'legend') {
        const data = node.data || (node.data = {});
        data.hName = 'div';
        data.hProperties = { className: 'figure-legend' };
      }
      // ::::beside — a figure and its prose side by side. Unlike a float this
      // makes them flex siblings, so a tall portrait screenshot cannot leave a
      // hole below a short paragraph the way a floated one does. The figure is
      // authored first and sits on the left; ::::beside{side=right} flips the
      // visual order only, so stacked (mobile) order still shows the figure first.
      if (node.type === 'containerDirective' && node.name === 'beside') {
        const data = node.data || (node.data = {});
        data.hName = 'div';
        const right = node.attributes?.side === 'right';
        data.hProperties = { className: right ? 'figure-beside figure-beside--right' : 'figure-beside' };
      }
      // A list item whose entire content is one :ios[...] / :mac[...] directive is
      // scoped to that platform: data-platform moves to the <li> and the wrapper
      // span is unwrapped, so the bullet itself hides instead of collapsing to an
      // empty marker. ::: cannot be used inside a list without breaking it.
      if (node.type === 'listItem' && node.children.length === 1) {
        const para = node.children[0];
        if (para.type === 'paragraph' && para.children.length === 1) {
          const only = para.children[0];
          if (only.type === 'textDirective' && PLATFORMS.has(only.name)) {
            const data = node.data || (node.data = {});
            data.hProperties = {
              ...(data.hProperties || {}),
              'data-platform': only.name,
            };
            para.children = only.children;
          }
        }
      }
      // A table row whose LAST cell is just "iPhone" or "Mac"/"macOS" is scoped
      // to that platform: the marker cell is dropped and data-platform moves to
      // the <tr>, so the whole row hides with the toggle instead of leaving a
      // row whose content no longer applies. Give such a table a trailing
      // header column with an empty label.
      if (node.type === 'table') {
        const [head, ...rows] = node.children;
        const lastIndex = (head?.children?.length ?? 0) - 1;
        if (lastIndex < 1) return;
        const headLast = head.children[lastIndex];
        if (headLast.children.length !== 0) return; // trailing column must be unlabelled
        for (const row of rows) {
          const cell = row.children[lastIndex];
          const text = cell ? toText(cell).trim().toLowerCase() : '';
          const platform = text === 'iphone' ? 'ios' : text === 'mac' || text === 'macos' ? 'mac' : null;
          if (!platform) continue;
          const data = row.data || (row.data = {});
          data.hProperties = { ...(data.hProperties || {}), 'data-platform': platform };
        }
        // Drop the marker column from every row, header included.
        for (const row of node.children) row.children.splice(lastIndex, 1);
        if (node.align) node.align.splice(lastIndex, 1);
      }
    });
  };
}

function toText(node) {
  if (node.value) return node.value;
  return (node.children || []).map(toText).join('');
}
