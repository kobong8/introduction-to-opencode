import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {target:'es2022', outDir:'backend/static', emptyOutDir:true},
  server: {proxy:{'/api':'http://127.0.0.1:8000'}},
});
