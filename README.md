# topokit.ca

The TopoKit website and user manual. TopoKit is a field GIS app for iPhone and
Mac — projects, vector and raster layers, offline maps, GPS recording and
elevation.

- **Site:** [topokit.ca](https://topokit.ca)
- **Manual:** [topokit.ca/manual](https://topokit.ca/manual/)
- **Release notes:** [topokit.ca/release-notes](https://topokit.ca/release-notes/)

## How it is put together

[Astro](https://astro.build) with [Starlight](https://starlight.astro.build).
Starlight owns `/manual/*` and `/release-notes/`; the marketing and legal pages
are plain HTML served verbatim from `public/`.

Three remark plugins in `src/plugins/` do the manual's specific work:

| Plugin | What it does |
|---|---|
| `remark-platform` | `:::ios` / `:::mac` content, shown by the header's platform toggle |
| `remark-ui-icon` | `:ui[Label]{icon=name}` renders the app's own button artwork inline |
| `remark-glossary` | the first use of a GIS term in a chapter becomes a hover definition, sourced from `glossary.md` |

## Working on it

```
./manual.sh          # dev server on :4321, plus the inline comment widget
./manual.sh check    # style and link gates
npm run build        # refuses while the dev server is up, on purpose
npm run release-notes # regenerate /release-notes/ from the app's ReleaseNotes.swift
```

`CLAUDE.md` carries the rules that keep changes from breaking things —
cross-browser constraints, image sizing, and the Astro caching traps that have
cost real time. Read it before touching CSS. `STYLE.md` and `LANGUAGE.md` govern
the manual's prose.

## Publishing

Pushing to `main` builds the site and deploys it to GitHub Pages
(`.github/workflows/deploy.yml`). Nothing is published by hand, and `dist/` is
never committed.
