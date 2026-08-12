// Receives inline comments from public/comment.js and appends them to
// MANUAL-COMMENTS.md. Localhost only, dev only — nothing about this ships.
// Start it alongside the dev server; see .claude/launch.json.
import { appendFileSync, existsSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';

const PORT = 4399;
const FILE = 'MANUAL-COMMENTS.md';

if (!existsSync(FILE)) {
  writeFileSync(
    FILE,
    '# Inline comments on the manual\n\n' +
      'Written by the comment widget on the local docs site (select text → ✎ Comment).\n' +
      'Newest at the bottom. Claude reads this file; delete entries once they are handled.\n',
  );
}

createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.writeHead(204).end();
  if (req.method !== 'POST' || !req.url.startsWith('/note')) return res.writeHead(404).end();

  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    try {
      const { chapter, heading, quote, note } = JSON.parse(body);
      const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
      appendFileSync(
        FILE,
        `\n---\n\n### ${chapter}${heading ? ` — ${heading}` : ''}\n` +
          `<sub>${stamp}</sub>\n\n` +
          `> ${quote.replace(/\n+/g, '\n> ')}\n\n` +
          `**${note}**\n`,
      );
      console.log(`note saved: ${chapter}${heading ? ` — ${heading}` : ''}`);
      res.writeHead(200).end('ok');
    } catch (e) {
      console.error('bad note:', e.message);
      res.writeHead(400).end('bad request');
    }
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Manual comment server on http://localhost:${PORT} → ${FILE}`);
});
