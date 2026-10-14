import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests',
  timeout:30000,
  use:{baseURL:'http://127.0.0.1:4173',browserName:'chromium',channel:'msedge',headless:true},
  webServer:{
    command:process.platform==='win32'?'.venv/Scripts/python.exe run.py --port 4173':'.venv/bin/python run.py --port 4173',
    url:'http://127.0.0.1:4173/healthz',
    reuseExistingServer:false,
  },
  reporter:'list',
});
