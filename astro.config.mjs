// @ts-check
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import remarkDirective from 'remark-directive';
import remarkUiIcon from './src/plugins/remark-ui-icon.mjs';
import remarkPlatform from './src/plugins/remark-platform.mjs';
import remarkGlossary from './src/plugins/remark-glossary.mjs';
import remarkVersion from './src/plugins/remark-version.mjs';

// TopoKit documentation site.
// Starlight owns only the /manual/* routes. The marketing + legal pages
// (index.html, privacy.html, terms.html, support.html) are served verbatim
// from public/ so they remain pixel-identical to the current live site.
// astro build sets NODE_ENV=production; astro dev does not.
const DEV = process.env.NODE_ENV !== 'production';

export default defineConfig({
  site: 'https://topokit.ca',
  // Never appears in the built site; this just takes it off his screen too.
  devToolbar: { enabled: false },
  vite: {
    plugins: [
      {
        // The review widget. It used to live in public/, which meant it was
        // copied into the build and fetched by every visitor — 8KB of a tool
        // that only works on localhost. It now lives in scripts/ and is served
        // here, in dev only, so there is no version of the site that ships it.
        name: 'topokit:comment-widget-in-dev',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if ((req.url || '').split('?')[0] !== '/comment.js') return next();
            try {
              res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
              res.setHeader('Cache-Control', 'no-store');
              res.end(readFileSync(resolve('./scripts/comment-widget.js')));
            } catch {
              next();
            }
          });
        },
      },
      {
        // Every page in public/ — the home page, privacy, terms, support — is a
        // static file that GitHub Pages serves at its extensionless path. The
        // dev server does not: it routes an unmatched path through Starlight and
        // answers with Starlight's 404, so locally the site looked like the legal
        // pages had been replaced by "some Astro thing" while production was
        // fine the whole time. Serve them here exactly as Pages does.
        name: 'topokit:serve-static-pages-in-dev',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const path = (req.url || '').split('?')[0];
            // '/manual/', '/release-notes/' and friends are Astro's — a trailing
            // slash means a real route, never one of these files.
            if (path.endsWith('/') && path !== '/') return next();
            const name = path === '/' ? 'index.html' : path.replace(/^\//, '');
            const file = resolve('./public', name.endsWith('.html') ? name : `${name}.html`);
            if (!file.startsWith(resolve('./public'))) return next();
            try {
              const html = readFileSync(file);
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.setHeader('Cache-Control', 'no-store');
              res.end(html);
            } catch {
              next();
            }
          });
        },
      },
      {
        // Astro's dev image URL is path + dimensions, with nothing about the
        // file's contents in it. Re-shoot a screenshot and downscale it to the
        // same size and the URL is byte-identical, so Safari keeps serving the
        // old picture from cache and the new one looks like it never landed.
        // Dev only; the built site still gets normal caching.
        name: 'topokit:no-cache-dev-images',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url?.startsWith('/_image')) {
              // Astro's own handler sets a year-long Cache-Control after this
              // middleware runs, so setting it here is not enough — intercept
              // the setter and hold our value.
              const set = res.setHeader.bind(res);
              res.setHeader = (name, value) =>
                String(name).toLowerCase() === 'cache-control'
                  ? set(name, 'no-store, must-revalidate')
                  : set(name, value);
              set('Cache-Control', 'no-store, must-revalidate');
            }
            next();
          });
        },
      },
    ],
  },
  markdown: {
    // remarkDirective parses the :ui[Label]{icon=name} and :::ios/:::mac markers;
    // remarkUiIcon and remarkPlatform render them.
    // remarkGlossary runs last: by then :ui[…] chips and platform directives
    // are already html/container nodes, so it can't wrap a term inside one.
    remarkPlugins: [remarkDirective, remarkUiIcon, remarkPlatform, remarkVersion, remarkGlossary],
  },
  integrations: [
    // Starlight pulls in @astrojs/sitemap on its own, but only Astro's own
    // routes end up in it. The marketing and legal pages are static files in
    // public/, so Astro never sees them — customPages puts them in by hand.
    // Declaring the integration here also replaces Starlight's default copy,
    // which is the only way to pass it options.
    sitemap({
      customPages: [
        'https://topokit.ca/',
        'https://topokit.ca/privacy',
        'https://topokit.ca/terms',
        'https://topokit.ca/support',
      ],
    }),
    starlight({
      title: 'TopoKit',
      // Brand wordmark replaces the text title; black on light, white on dark.
      logo: {
        light: './src/assets/brand/wordmark_for_light_background.png',
        dark: './src/assets/brand/wordmark_for_dark_background.png',
        replacesTitle: true,
      },
      favicon: '/Images/Logo/Logo.svg',
      description:
        'The official TopoKit manual — Field GIS for iPhone and macOS. Projects, layers, rasters, tiles, elevation, GPS.',
      customCss: ['./src/styles/topokit.css'],
      components: {
        // Puts the Mac / iPhone / All platform toggle in the header, beside
        // the search box. SocialIcons is the header slot right of search.
        SocialIcons: './src/components/SocialIcons.astro',
        // Starlight's own version hardcodes timeZone: 'UTC', so an evening
        // commit displays as the next day. Ours formats in local time.
        LastUpdated: './src/components/LastUpdated.astro',
      },
      head: [
        {
          // Apply the saved platform choice before first paint (no flash).
          tag: 'script',
          content:
            "try{var p=localStorage.getItem('topokit-platform');if(p==='ios'||p==='mac')document.documentElement.setAttribute('data-platform',p);var v=localStorage.getItem('topokit-version');if(v==='1.1.1')document.documentElement.setAttribute('data-manual-version',v)}catch(e){}",
        },
        {
          // Starlight declares twitter:card = summary_large_image on every page
          // and shipped no image to go in it, so every shared link rendered a
          // blank card. Absolute URL: a share crawler has no page context.
          tag: 'meta',
          attrs: { property: 'og:image', content: 'https://topokit.ca/Images/og-card.jpg' },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:image', content: 'https://topokit.ca/Images/og-card.jpg' },
        },
        {
          // Glossary chips: hover or tap a GIS term for its definition.
          tag: 'script',
          attrs: { src: '/glossary.js', defer: true },
        },
        // Inline commenting while reviewing: select text on any chapter and a
        // Comment button appears; notes land in notes/MANUAL-COMMENTS.md via
        // scripts/comment-server.mjs. Dev only — the built site never
        // references it, and scripts/ is not copied into dist.
        ...(DEV
          ? [{ tag: 'script', attrs: { src: '/comment.js', defer: true } }]
          : []),
      ],
      // The docs header title links back to '/', which serves public/index.html.
      pagination: true,
      // Per-chapter "Last updated" date, read from each file's git history, so
      // it can never drift from reality the way a hand-typed date would.
      lastUpdated: true,
      // No "edit this page" link: the repo is public, but the manual is his
      // alone and an edit link invites pull requests he does not want.
      editLink: undefined,
      // Order matters more than grouping here. The two chapters that define
      // vocabulary — interface (the app's nouns) and glossary (the GIS ones) —
      // come before the chapters that spend it, so cross-references point
      // backward to something already read instead of forward to something
      // not yet met.
      sidebar: [
        {
          label: 'Start here',
          items: [
            'manual',
            'manual/interface',
            'manual/getting-started',
            'manual/map-tools',
            'manual/file-formats',
          ],
        },
        {
          label: 'Working with data',
          items: [
            'manual/projects-and-files',
            'manual/layer-tree',
            'manual/points-lines-polygons',
            'manual/measurement',
            'manual/vector-import-export',
            'manual/raster-overlays',
            'manual/tile-layers',
          ],
        },
        {
          label: 'In the field',
          items: [
            'manual/gps-and-track-recording',
            'manual/elevation',
            'manual/directions-and-routing',
          ],
        },
        {
          label: 'Reference',
          items: ['manual/ui-settings-styling', 'manual/glossary'],
        },
      ],
    }),
  ],
});
