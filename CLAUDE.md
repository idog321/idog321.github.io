# Project Rules

## Cross-browser compatibility is MANDATORY

Every CSS and HTML change MUST work on Safari, Firefox, AND Chrome. Do not ship Chrome-only code. Safari (WebKit) is the most common source of layout bugs in this project.

### Before writing any CSS:
1. Consider Safari/WebKit quirks first — it is the strictest engine
2. Avoid relying on `aspect-ratio` alone for sizing in complex position stacks — use explicit width/height
3. Percentage-based positioning inside flex items can be unreliable in Safari
4. Always ensure absolutely-positioned parents have explicit, resolvable dimensions
5. If unsure about a property's cross-browser support, check caniuse.com before using it
6. Do NOT use `z-index` for stacking — use DOM order instead (later elements paint on top)
7. Do NOT use `filter` on elements that need to participate in stacking with siblings — it creates stacking contexts that behave differently across browsers

### Before committing any CSS/HTML change:
1. Verify in Chrome (preview tool)
2. ALSO open Safari via computer-use and visually confirm the same page looks correct
3. If it looks different in Safari, fix it BEFORE committing — do not ship and hope for the best
