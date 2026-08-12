// Refuse to run a build while the dev server is up.
//
// astro dev and astro build share .astro/data-store.json, which caches RENDERED
// HTML. Building (or clearing the cache) while the dev server runs pulls that
// file out from under it: the server keeps serving whatever it had in memory and
// stops picking up edits, so the page Nikolay is reading silently freezes at an
// old revision while the source and dist/ are both correct.
//
// That wasted most of a day. This makes it fail loudly instead.
const PORT = 4321;

// An HTTP probe, not a port bind: astro dev binds ::1, so binding 127.0.0.1
// succeeds and the guard silently passes. Ask the server if it is there.
const inUse = await fetch(`http://localhost:${PORT}/`, {
  signal: AbortSignal.timeout(1500),
})
  .then(() => true)
  .catch(() => false);

if (inUse) {
  console.error(`
  The dev server is running on :${PORT}.

  Building now would overwrite .astro/data-store.json underneath it, and the
  dev server would keep serving stale pages without any error — the exact
  failure that kept showing old headings in the browser.

  Either:
    - verify against the dev server instead:  curl -s localhost:4321/manual/...
    - or stop the dev server first, then build.
`);
  process.exit(1);
}
