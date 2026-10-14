import { copyFile, mkdir, readdir, lstat, unlink, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'assets');
await mkdir(output, { recursive: true });
if ((await lstat(output)).isSymbolicLink()) throw new Error('assets must be a real directory');
const built = await readdir(path.join(root, 'dist/assets'));
for (const name of built) await copyFile(path.join(root, 'dist/assets', name), path.join(output, name));
await copyFile(path.join(root, 'dist/favicon.svg'), path.join(root, 'favicon.svg'));
await copyFile(path.join(root, 'dist/index.html'), path.join(root, 'index.html'));
await writeFile(path.join(root, '.nojekyll'), '');
// Only remove stale Vite-generated bundles in the dedicated assets directory.
for (const name of await readdir(output)) {
  if (!built.includes(name) && /^(?:index|App)-[\w-]+\.(?:js|css)$/.test(name)) {
    await unlink(path.join(output, name));
  }
}
console.log('Published static files: index.html, favicon.svg, assets/, .nojekyll');
