import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { createTaskServer } from './server.mjs';

async function withServer(database, run) {
  const server = createTaskServer(database);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await run((route, method = 'GET', body) => fetch(base + route, {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    }));
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

test('add, complete and reopen a task', async () => {
  const folder = mkdtempSync(join(tmpdir(), 'opencode-tasks-'));
  const database = join(folder, 'test.db');
  let saved;
  try {
    await withServer(database, async request => {
      assert.equal((await request('/')).status, 200);
      assert.deepEqual(await (await request('/api/tasks')).json(), []);
      assert.equal((await request('/api/tasks', 'POST', { title: ' ' })).status, 422);
      const created = await request('/api/tasks', 'POST', { title: ' 책 읽기 ' });
      assert.equal(created.status, 201);
      const item = await created.json();
      assert.equal(item.title, '책 읽기');
      assert.equal(item.completed, false);
      assert.equal((await request('/api/tasks/999', 'PATCH', { completed: true })).status, 404);
      const response = await request(`/api/tasks/${item.id}`, 'PATCH', { completed: true });
      assert.equal(response.status, 200);
      saved = await response.json();
      assert.equal(saved.completed, true);
    });
    await withServer(database, async request => {
      assert.deepEqual(await (await request('/api/tasks')).json(), [saved]);
    });
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
});
