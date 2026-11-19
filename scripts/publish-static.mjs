import { copyFile, readFile, mkdir, readdir, lstat, unlink, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'assets');
await mkdir(output, { recursive: true });
if ((await lstat(output)).isSymbolicLink()) throw new Error('assets must be a real directory');
const built = await readdir(path.join(root, 'dist/assets'));
for (const name of built) await copyFile(path.join(root, 'dist/assets', name), path.join(output, name));
await copyFile(path.join(root, 'dist/favicon.svg'), path.join(root, 'favicon.svg'));
const parts = JSON.parse(await readFile(path.join(root, 'parts.json'), 'utf8'));
for (const page of ['index.html', ...parts.map(part => part.page)]) {
  await copyFile(path.join(root, 'dist', page), path.join(root, page));
}
await writeFile(path.join(root, '.nojekyll'), '');
// Only remove stale Vite-generated bundles in the dedicated assets directory.
for (const name of await readdir(output)) {
  if (!built.includes(name) && /^(?:index|App|main)-[\w-]+\.(?:js|css)$/.test(name)) {
    await unlink(path.join(output, name));
  }
}
console.log('Published home, tutorial pages and assets.');
