// Every src="/..." or poster="/..." in the site must name a file committed under
// public/. Astro checks markdown images but not raw <video> tags, so on 16 October
// a front-page commit deleted sixteen manual recordings the chapters still embedded,
// and the build shipped them as 404s. Checked against git, not the disk: an
// untracked copy on this machine is exactly what hides the gap until it is live.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const tracked = execFileSync('git', ['ls-files', 'src', 'public'], { encoding: 'utf8' }).split('\n');
const shipped = new Set(tracked.filter((f) => f.startsWith('public/')));

let bad = 0;
for (const f of tracked.filter((f) => /\.(md|mdx|astro|html)$/.test(f))) {
  for (const [, url] of readFileSync(f, 'utf8').matchAll(/\b(?:src|poster)="(\/[^"]*)"/g)) {
    const path = `public${decodeURI(url.replace(/[?#].*/, ''))}`;
    if (!shipped.has(path)) {
      console.log(`NOT IN GIT  ${f}: ${path}`);
      bad++;
    }
  }
}

if (bad) console.log(`\n${bad} embed(s) name a file that is not committed; they would 404 on topokit.ca.`);
process.exit(bad ? 1 : 0);
