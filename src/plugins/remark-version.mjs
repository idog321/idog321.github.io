// remark-version
// Version-scoped content, for the 1.1 / 1.1.1 toggle.
//
// 1.1 is what the App Store ships. 1.1.1 is the beta: a fourth base-map option
// (No Map), UTM search reading N/S as the hemisphere, points no longer hidden by
// a faded or offline-only layer, and feature attributes exported to GPX and KML.
// A reader on 1.1 should not be told about behaviour they do not have, so the
// sentences that differ are scoped rather than duplicated into a second manual.
//
// Authoring syntax (markdown directives), deliberately the same shape as
// remark-platform's, so there is one idiom to learn:
//   :v111[, and :ui[No Map]{icon=map-no-map}]   -> only in 1.1.1
//   :v11[ and ]                                 -> only in 1.1
//   :::v111 ... :::                             -> a whole block
//   - :v111[…]                                  -> a whole list item
//
// Visibility is CSS-driven: the toggle stamps data-manual-version on <html> and
// topokit.css hides what does not match. Default is 1.1 — the released version —
// so a reader who has never touched the toggle sees the app they actually have.
import { visit } from 'unist-util-visit';

// Directive name -> the version it belongs to.
const VERSIONS = new Map([
  ['v11', '1.1'],
  ['v111', '1.1.1'],
]);

export default function remarkVersion() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        (node.type === 'containerDirective' || node.type === 'textDirective') &&
        VERSIONS.has(node.name)
      ) {
        const data = node.data || (node.data = {});
        const isBlock = node.type === 'containerDirective';
        data.hName = isBlock ? 'div' : 'span';
        data.hProperties = {
          className: isBlock ? 'version-block' : 'version-inline',
          'data-version': VERSIONS.get(node.name),
        };
      }
      // A list item that is entirely one directive scopes the whole bullet:
      // the attribute moves to the <li> and the span is unwrapped, so the
      // marker hides too instead of leaving an empty bullet. ::: cannot be
      // used inside a list without breaking it. Same trick as remark-platform.
      if (node.type === 'listItem' && node.children.length === 1) {
        const para = node.children[0];
        if (para.type === 'paragraph' && para.children.length === 1) {
          const only = para.children[0];
          if (only.type === 'textDirective' && VERSIONS.has(only.name)) {
            const data = node.data || (node.data = {});
            data.hProperties = {
              ...(data.hProperties || {}),
              'data-version': VERSIONS.get(only.name),
            };
            para.children = only.children;
          }
        }
      }
    });
  };
}
