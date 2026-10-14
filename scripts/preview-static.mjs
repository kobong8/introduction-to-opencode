import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const portIndex = process.argv.indexOf('--port');
const port = portIndex < 0 ? 4173 : Number(process.argv[portIndex + 1]);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    pathname = pathname.replace(/^\/introduction-to-opencode(?=\/)/, '');
    if (pathname === '/') pathname = '/index.html';
    if (!/^\/(?:index\.html|favicon\.svg|assets\/[\w.-]+)$/.test(pathname)) {
      res.writeHead(404).end('Not found'); return;
    }
    const body = await readFile(path.join(root, pathname.slice(1)));
    res.writeHead(200, { 'Content-Type': types[path.extname(pathname)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Static preview: http://127.0.0.1:${port}/introduction-to-opencode/`));
