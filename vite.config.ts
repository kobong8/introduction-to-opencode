import parts from './parts.json';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  root: 'web',
  publicDir: '../public',
  plugins: [react()],
  resolve: { alias: { '/src': fileURLToPath(new URL('./src', import.meta.url)) } },
  base: './',
  build: { rollupOptions: { input: ['index.html', ...parts.map(part => part.page)].map(page => fileURLToPath(new URL(`./web/${page}`, import.meta.url))) }, target: 'es2022', outDir: '../dist', emptyOutDir: true },
});
