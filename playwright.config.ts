/**
 * Documentation : 
 * 
 *    https://playwright.dev/docs/intro
 * 
 *   Pour Electron spécifiquement :
 * 
 *    https://playwright.dev/docs/api/class-electron
 * 
 */
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  timeout: 30000,
  workers: 1, // un seul test à la fois
  use: {
    launchOptions: {
      env: {
        ...process.env,
        NODE_ENV: 'test'
      }
    }
  }
});