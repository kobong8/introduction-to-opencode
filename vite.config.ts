import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  root: 'web',
  publicDir: '../public',
  plugins: [react()],
  resolve: { alias: { '/src': fileURLToPath(new URL('./src', import.meta.url)) } },
  base: './',
  build: { target: 'es2022', outDir: '../dist', emptyOutDir: true },
});
