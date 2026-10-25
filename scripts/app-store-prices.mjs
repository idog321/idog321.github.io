// Pulls TopoKit's prices for every App Store storefront from Apple and writes public/prices.json,
// which the front page reads to show the visitor's own currency.
//
// Two public sources, no keys:
//   1. The lookup API (itunes.apple.com/lookup?id=…&country=XX): which storefronts sell the app, the
//      storefront's currency, and the app's own price ("Free" from 1.2 on).
//   2. The App Store web product page (apps.apple.com/xx/app/id…): its JSON carries the Information
//      shelf, whose "In-App Purchases" item lists each purchase's name and price in that storefront's
//      currency. That is the only public place the Monthly and Unlock Forever prices appear.
//
// Runs before `astro build` (see package.json). A storefront that fails to fetch keeps whatever the
// committed prices.json already had for it, so a bad network day never blanks the page's prices.
//
//   node scripts/app-store-prices.mjs                          # TopoKit, every storefront
//   node scripts/app-store-prices.mjs --app 1201979492 --storefronts ca,us --out /tmp/x.json   # a test

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const APP = opt('--app', '6761090144');
const OUT = opt('--out', 'public/prices.json');
const ONLY = opt('--storefronts', '');
const CONCURRENCY = 3;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';

// Every storefront Apple runs, as ISO country codes. The lookup drops the ones that don't sell the app.
const ALL = ('AF AL DZ AO AI AG AR AM AU AT AZ BS BH BB BY BE BZ BJ BM BT BO BA BW BR VG BN BG BF KH CM CA CV KY TD CL CN CO CR CI HR CY CZ CD DK DM DO EC EG SV EE SZ FJ FI FR GA GM GE DE GH GR GD GT GW GY HN HK HU IS IN ID IQ IE IL IT JM JP JO KZ KE KR XK KW KG LA LV LB LR LY LT LU MO MG MW MY MV ML MT MR MU MX FM MD MN ME MS MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS ST SA SN RS SC SL SG SK SI SB ZA ES LK SR SE CH TW TJ TZ TH TO TT TN TR TM TC UG UA AE GB US UY UZ VU VE VN YE ZM ZW').split(' ');

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Apple answers 429 when the product pages are asked for too quickly; back off and ask again.
async function get(url, accept) {
  for (let attempt = 1; ; attempt++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en', 'Accept': accept || '*/*' } });
    if (r.ok) return r.text();
    if (r.status === 429 && attempt < 6) { await sleep(2500 * attempt); continue; }
    throw new Error(`${r.status} ${url}`);
  }
}

async function lookup(cc) {
  const d = JSON.parse(await get(`https://itunes.apple.com/lookup?id=${APP}&country=${cc.toLowerCase()}`, 'application/json'));
  const a = d.results && d.results[0];
  return a ? { currency: a.currency, app: a.formattedPrice, url: a.trackViewUrl } : null;
}

// The Information shelf of the product page, out of its serialized JSON.
async function purchases(cc) {
  const html = await get(`https://apps.apple.com/${cc.toLowerCase()}/app/id${APP}`, 'text/html');
  const m = /<script[^>]*id="serialized-server-data"[^>]*>([\s\S]*?)<\/script>/.exec(html);
  if (!m) throw new Error(`no product data for ${cc}`);
  const json = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'"));
  const find = (o) => {
    if (o && typeof o === 'object') {
      if (o.shelfMapping) return o;
      for (const v of Object.values(o)) { const r = find(v); if (r) return r; }
    }
    return null;
  };
  const page = find(json);
  if (!page) throw new Error(`no shelves for ${cc}`);
  const info = (page.shelfMapping.information && page.shelfMapping.information.items) || [];
  const item = info.find((it) => /in.app purchases/i.test(it.title || ''));
  const iap = {};
  for (const row of (item && item.items) || []) if (row.leadingText && row.trailingText) iap[row.leadingText] = row.trailingText;
  return iap;
}

async function one(cc, previous) {
  try {
    const l = await lookup(cc);
    if (!l) return [cc, null];
    let iap = {};
    try { iap = await purchases(cc); } catch (e) { iap = (previous && previous.iap) || {}; process.stderr.write(`  ${cc}: product page failed (${e.message}); kept the previous purchases\n`); }
    if (!Object.keys(iap).length && previous && previous.iap && Object.keys(previous.iap).length) iap = previous.iap; // not on the store page yet: keep the seed
    return [cc, { currency: l.currency, app: l.app, iap }];
  } catch (e) {
    process.stderr.write(`  ${cc}: ${e.message}; kept the previous row\n`);
    return [cc, previous || null];
  }
}

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')).storefronts || {} : {};
const codes = ONLY ? ONLY.toUpperCase().split(',') : ALL;
const storefronts = {};
let i = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (i < codes.length) {
    const cc = codes[i++];
    const [k, row] = await one(cc, previous[cc]);
    if (row) storefronts[k] = row;
    await sleep(400);
  }
}));
const withIap = Object.values(storefronts).filter((s) => Object.keys(s.iap).length).length;
writeFileSync(OUT, JSON.stringify({ app: APP, generated: new Date().toISOString(), storefronts: Object.fromEntries(Object.entries(storefronts).sort()) }, null, 1) + '\n');
console.log(`prices: ${Object.keys(storefronts).length} storefronts, ${withIap} with in-app purchase prices → ${OUT}`);
