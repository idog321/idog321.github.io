# Project Rules

## This repo is public, and its history is permanent

Everything committed here is world-readable forever, including anything later
deleted. The working notes — the app's fix list, the manual audits, his review
comments, the publishing plans — live in `notes/`, which is gitignored, and are
backed up with full history in the private `topokit-docs-archive` repo.

- Never commit anything from `notes/`, and never quote its contents into a
  chapter, a commit message, or a comment in the source.
- Defects still go to `notes/APP-IDEAS.md`, not the manual. That rule is
  unchanged; only the path moved.
- `main` publishes itself. A push to `main` builds and deploys to topokit.ca,
  so a broken commit on `main` is a broken live site, not a broken build.

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
2. Then ASK Nikolay to look at it in Safari. Do not try to drive or screenshot
   Safari yourself — `do JavaScript` needs "Allow JavaScript from Apple Events"
   turned on in his Safari settings, and `screencapture -l` needs screen
   recording. Both are his machine's settings, not yours to change, and
   AppleScript navigation replaces whatever tab he is reading. Just ask.
3. If it looks different in Safari, fix it BEFORE committing — do not ship and hope for the best

## Verify on the dev server, not the build

Astro 5 caches **rendered HTML** in `.astro/data-store.json` at the project root.
Clearing `node_modules/.astro` alone does NOT clear it, and neither does restarting
the dev server. A remark-plugin or markdown change can therefore be correct in
`dist/` and stale in the browser — which is what Nikolay is actually looking at.

- `npm run dev` now clears both caches before starting. Use it, not `astro dev`.
- After changing anything under `src/plugins/`, verify against
  `curl http://localhost:4321/...`, never against `dist/`.
- `grep dist/` proving a change landed means nothing about what is on screen.

## Images: sizing only, and no layout cleverness

No shadows, no borders, no rounded corners on Nikolay's artwork — he prepares it
deliberately. One float is deliberate — the iPhone overview in `interface.md` — and it works
because it is the only image in its section. Never float an image in a section
that has a second one: the second drops past the whole float and leaves a gap
the height of the first, which shipped once.

## `grep -c` counts lines, not occurrences

A duplicated sentence shipped after being reported fixed because the check was
`grep -c "phrase" file`, which returned 1 — both copies were on the same line.
Use `grep -o "phrase" file | wc -l`, or count in python. Same trap applies to
verifying a replacement landed exactly once.

## Every new image needs a height cap, and now gets one by default

A portrait phone screenshot scaled to the text column is over 1000px tall and
swallows the page. `.sl-markdown-content img` now caps `max-height: 34rem`
alongside the existing `max-width: 100%`, so the browser fits within whichever
binds — a wide window capture by the column, a tall phone capture by its height.
Per-file rules still override it (attribute selectors are more specific). Do not
go back to adding a rule per screenshot; if one needs a different size, add a
rule, but the default means a new image can never arrive un-capped.

## A re-shot screenshot can be cached under the same URL

Astro's dev image URL is the file path plus its dimensions — nothing about the
contents. Re-shoot a screenshot, downscale it to the same size, and the URL is
byte-identical while the bytes are not, so Safari keeps serving the old picture
and the new one looks like it never landed. Reloading the page does nothing:
the page was never stale.

`astro.config.mjs` now forces `Cache-Control: no-store` on `/_image` in dev, so
this should not recur. If it ever does, the tell is that `curl` on the image URL
returns the right picture while the browser shows the old one — check the bytes
before blaming the markdown. Cmd-Option-R clears an already-cached copy.

## Restarting the dev server freezes Nikolay's open tab

`./manual.sh` restarts kill Astro's live-reload socket. His Safari tab keeps
showing the HTML it already had and silently stops picking up edits — it looks
exactly like "the change didn't land". This has cost time more than once.

- Don't restart the server out of habit. Edits to markdown, CSS and `public/`
  are picked up live; only `astro.config.mjs`, files under `src/plugins/`, and
  new `src/components/*.astro` need one.
- When a restart is genuinely needed, say so in the reply: "reload the tab".

## Never build while the dev server is running

`astro dev` and `astro build` share `.astro/data-store.json`, which caches
**rendered HTML**. Building — or clearing that cache — while the dev server is up
pulls the file out from under it. The server keeps serving what it had in memory
and silently stops picking up edits, so Nikolay's browser freezes at an old
revision while both the source file and `dist/` are correct. This is what caused
"it's still showing the old heading" repeatedly.

- `npm run build` now refuses if anything answers on :4321 (`scripts/guard-dev.mjs`).
- Verify against the dev server, with `curl -s localhost:4321/manual/...`.
  Checking `dist/` proves nothing about what is on screen.
- Do not `rm -rf .astro` while the dev server is running. Stop it, clear, restart.
