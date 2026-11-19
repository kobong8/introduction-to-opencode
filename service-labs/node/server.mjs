import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { pathToFileURL } from 'node:url';

const publicFiles = existsSync(new URL('./public/', import.meta.url)) ? './public/' : '../shared/';
const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
]);

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }).end(JSON.stringify(data));
}

async function jsonBody(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 4096) return null;
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks)); } catch { return null; }
}

export function createTaskServer(database = new URL('./tasks.db', import.meta.url)) {
  const db = new DatabaseSync(database);
  db.exec('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, title TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0)');
  const list = db.prepare('SELECT * FROM tasks ORDER BY id');
  const add = db.prepare('INSERT INTO tasks (title) VALUES (?)');
  const update = db.prepare('UPDATE tasks SET completed = ? WHERE id = ?');
  const get = db.prepare('SELECT * FROM tasks WHERE id = ?');
  const task = row => ({ ...row, completed: Boolean(row.completed) });

  const server = createServer(async (req, res) => {
    try {
      const pathname = new URL(req.url, 'http://localhost').pathname;
      const asset = assets.get(pathname);
      if (req.method === 'GET' && asset) {
        const [filename, type] = asset;
        res.writeHead(200, { 'Content-Type': type }).end(readFileSync(new URL(publicFiles + filename, import.meta.url)));
      } else if (req.method === 'GET' && pathname === '/api/tasks') {
        send(res, 200, list.all().map(task));
      } else if (req.method === 'POST' && pathname === '/api/tasks') {
        const data = await jsonBody(req);
        const title = typeof data?.title === 'string' ? data.title.trim() : '';
        if (!title || Array.from(title).length > 100) return send(res, 422, { detail: '할 일은 1~100자로 입력하세요.' });
        send(res, 201, task(get.get(add.run(title).lastInsertRowid)));
      } else if (req.method === 'PATCH' && /^\/api\/tasks\/\d+$/.test(pathname)) {
        const id = Number(pathname.split('/').at(-1));
        const data = await jsonBody(req);
        if (typeof data?.completed !== 'boolean') return send(res, 422, { detail: '완료 상태를 확인하세요.' });
        if (!update.run(Number(data.completed), id).changes) return send(res, 404, { detail: '할 일을 찾을 수 없습니다.' });
        send(res, 200, task(get.get(id)));
      } else {
        send(res, 404, { detail: '페이지를 찾을 수 없습니다.' });
      }
    } catch (error) {
      console.error(error);
      if (!res.headersSent) send(res, 500, { detail: '서버 오류' });
      else res.end();
    }
  });
  server.once('close', () => db.close());
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.argv[2] || 3000);
  createTaskServer().listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}`));
}
