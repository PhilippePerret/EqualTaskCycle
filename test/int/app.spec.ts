import { test, expect, _electron as electron, type ElectronApplication  } from '@playwright/test';

let electronApp: ElectronApplication;

test.beforeAll(async () => {
  electronApp = await electron.launch({ args: ['.'] });
  await electronApp.firstWindow();
});

test.afterAll(async () => {
  await electronApp.close();
});

test('app load', async () => {
  const window = await electronApp.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  const title = await window.title();
  expect(title).toBeTruthy();
});

test('display work section', async () => {
  const window = await electronApp.firstWindow();
  const workSection = window.locator('#work');
  await expect(workSection).toBeVisible();
});

// Pour faire l'essai d'un échec
test('display bad section', async () => {
  const window = await electronApp.firstWindow();
  await window.locator('.btn-help-toggle').click();
  const workSection = window.locator('#help');
  await expect(workSection).toBeVisible();
})