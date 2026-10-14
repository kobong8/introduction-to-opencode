import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  root: 'web',
  publicDir: '../public',
  plugins: [react()],
  base: './',
  build: { target: 'es2022', outDir: '../dist', emptyOutDir: true },
});
