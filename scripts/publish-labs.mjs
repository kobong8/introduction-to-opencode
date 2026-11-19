import { readFile, writeFile } from 'node:fs/promises';
import { zipSync } from 'fflate';

const root = new URL('../service-labs/', import.meta.url);
const shared = ['README.md', '.gitignore', 'index.html', 'app.js'];
const runtimes = {
  python: ['app.py', 'requirements.txt', 'test_service.py'],
  node: ['server.mjs', 'test.mjs'],
};
for (const [runtime, files] of Object.entries(runtimes)) {
  const folder = `todo-${runtime}`;
  const entries = {};
  for (const file of shared) {
    const path = file.endsWith('.html') || file.endsWith('.js') ? `public/${file}` : file;
    entries[`${folder}/${path}`] = await readFile(new URL(`shared/${file}`, root));
  }
  for (const file of [...files, 'install.ps1', 'start.ps1', 'test.ps1']) {
    entries[`${folder}/${file}`] = await readFile(new URL(`${runtime}/${file}`, root));
  }
  // Fix archive timestamps so the same source builds the same download.
  const archive = zipSync(entries, { mtime: new Date(2026, 0, 1), level: 6 });
  await writeFile(new URL(`../assets/${folder}.zip`, import.meta.url), archive);
}
