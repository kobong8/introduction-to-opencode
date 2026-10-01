import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests',timeout:30000,use:{baseURL:'http://127.0.0.1:4173',browserName:'chromium',channel:'msedge',headless:true},webServer:{command:'npm.cmd run dev -- --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:true},reporter:'list'});
