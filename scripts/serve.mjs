// serve.mjs — Minimal static server for local development and CI (no deps).
// Mirrors GitHub Pages: serves files from the repo root, "/" → index.html,
// unknown paths → 404.html with status 404.
//
//   node scripts/serve.mjs            → http://localhost:3000
//   PORT=4000 node scripts/serve.mjs

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^([/\\])+/, '');
  let file = join(ROOT, clean);
  if (!file.startsWith(ROOT + sep) && file !== ROOT) return null; // path traversal guard
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    await stat(file);
    return file;
  } catch {
    return null;
  }
}

export function startServer(port = PORT) {
  const server = createServer(async (req, res) => {
    const file = await resolveFile(req.url || '/');
    const target = file ?? join(ROOT, '404.html');
    try {
      const body = await readFile(target);
      res.writeHead(file ? 200 : 404, {
        'Content-Type': TYPES[extname(target).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(body);
    } catch {
      res.writeHead(500).end('Server error');
    }
  });
  return new Promise((ok) => server.listen(port, () => ok(server)));
}

// Run directly: `node scripts/serve.mjs`
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startServer().then(() => console.log(`Sirviendo ${ROOT} en http://localhost:${PORT}`));
}
