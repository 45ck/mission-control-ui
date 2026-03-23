import { test, expect } from '@playwright/test';
import * as path from 'node:path';
import { routes } from '../helpers/routes';

const screenshotDir = path.resolve(import.meta.dirname, '..', 'screenshots');

for (const route of routes) {
  test(`@screenshot ${route.label} — ${route.path}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(route.path, { waitUntil: 'networkidle' });

    // Wait for framer-motion animations to settle
    await page.waitForTimeout(600);

    // Assert the page rendered visible content (not blank)
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();

    // For pages inside AppShell, verify the nav loaded
    const isFullscreen = route.name === 'live-view';
    const isErrorPage = route.name === '404' || route.name === 'mission-not-found';

    if (!isFullscreen && !isErrorPage) {
      // AppShell left nav should be visible
      const nav = page.locator('nav');
      await expect(nav).toBeVisible({ timeout: 5_000 });
    }

    // Capture full-page screenshot
    await page.screenshot({
      path: path.join(screenshotDir, `${route.name}.png`),
      fullPage: true,
    });

    // Assert no console errors (filter out known benign ones)
    const realErrors = consoleErrors.filter(
      (e) =>
        !e.includes('Download the React DevTools') &&
        !e.includes('React Router Future Flag Warning'),
    );
    expect(realErrors, `Console errors on ${route.path}`).toHaveLength(0);
  });
}
