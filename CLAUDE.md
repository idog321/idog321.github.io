# Project Rules

## Cross-browser compatibility is MANDATORY

Every CSS and HTML change MUST work on Safari, Firefox, AND Chrome. Do not ship Chrome-only code. Safari (WebKit) is the most common source of layout bugs in this project.

Before writing any CSS:
1. Consider Safari/WebKit quirks first — it is the strictest engine
2. Avoid relying on `aspect-ratio` alone for sizing in complex position stacks — use explicit width/height
3. Percentage-based positioning inside flex items can be unreliable in Safari
4. Always ensure absolutely-positioned parents have explicit, resolvable dimensions
5. If unsure about a property's cross-browser support, check caniuse.com before using it
