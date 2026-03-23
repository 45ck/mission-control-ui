import { test, expect } from '@playwright/test';
import * as path from 'node:path';

const screenshotDir = path.resolve(import.meta.dirname, '..', 'screenshots');

function ssPath(name: string) {
  return path.join(screenshotDir, `${name}.png`);
}

// ---------------------------------------------------------------------------
// Help modal
// ---------------------------------------------------------------------------
test('@screenshot Help modal open', async ({ page }) => {
  await page.goto('/missions', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Help button is fixed bottom-left with title="Help"
  await page.locator('button[title="Help"]').click();

  // Wait for the modal to animate in
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible({ timeout: 3_000 });

  await page.screenshot({ path: ssPath('help-modal-open'), fullPage: true });
});

// ---------------------------------------------------------------------------
// Command palette
// ---------------------------------------------------------------------------
test('@screenshot Command palette open', async ({ page }) => {
  await page.goto('/missions', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Click the search icon in the TopBar
  const searchButton = page.locator('button').filter({ has: page.locator('svg.lucide-search') });
  await searchButton.first().click();

  // Command palette input should appear
  const input = page.locator('input[placeholder="Search missions, pages..."]');
  await expect(input).toBeVisible({ timeout: 3_000 });

  await page.screenshot({ path: ssPath('command-palette-open'), fullPage: true });
});

// ---------------------------------------------------------------------------
// Notification center
// ---------------------------------------------------------------------------
test('@screenshot Notification center open', async ({ page }) => {
  await page.goto('/missions', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Click the bell icon button
  const bellButton = page.locator('button').filter({ has: page.locator('svg.lucide-bell') });
  await bellButton.first().click();

  // Notification dropdown with "NOTIFICATIONS" header
  await expect(page.getByText('NOTIFICATIONS')).toBeVisible({ timeout: 3_000 });

  await page.screenshot({ path: ssPath('notification-center-open'), fullPage: true });
});

// ---------------------------------------------------------------------------
// Mission filter by stage
// ---------------------------------------------------------------------------
test('@screenshot Mission filter by EXECUTE stage', async ({ page }) => {
  await page.goto('/missions', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Click the EXECUTE filter chip
  await page.locator('button', { hasText: /^EXECUTE$/ }).click();
  await page.waitForTimeout(300);

  await page.screenshot({ path: ssPath('mission-home-filter-execute'), fullPage: true });
});

// ---------------------------------------------------------------------------
// Mission filter by risk
// ---------------------------------------------------------------------------
test('@screenshot Mission filter by HIGH risk', async ({ page }) => {
  await page.goto('/missions', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Click the HIGH risk filter chip
  await page.locator('button', { hasText: /^HIGH$/ }).click();
  await page.waitForTimeout(300);

  await page.screenshot({ path: ssPath('mission-home-filter-high-risk'), fullPage: true });
});

// ---------------------------------------------------------------------------
// Mission sort by title
// ---------------------------------------------------------------------------
test('@screenshot Mission sort by title', async ({ page }) => {
  await page.goto('/missions', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Change the sort dropdown to "Title A-Z"
  await page.locator('select').selectOption('title');
  await page.waitForTimeout(300);

  await page.screenshot({ path: ssPath('mission-home-sort-title'), fullPage: true });
});

// ---------------------------------------------------------------------------
// Workflow Kanban — completed column visible
// ---------------------------------------------------------------------------
test('@screenshot Workflow Kanban completed column', async ({ page }) => {
  await page.goto('/workflows/WF-001', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Verify the COMPLETED column header is visible
  await expect(page.getByText('COMPLETED')).toBeVisible();

  await page.screenshot({ path: ssPath('workflow-kanban-completed'), fullPage: true });
});

// ---------------------------------------------------------------------------
// Create form validation
// ---------------------------------------------------------------------------
test('@screenshot Mission create form validation', async ({ page }) => {
  await page.goto('/missions/new', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Submit the form empty to trigger validation
  await page.locator('button', { hasText: 'CREATE MISSION' }).click();
  await page.waitForTimeout(300);

  // Validation errors should appear
  await expect(page.getByText('Title is required')).toBeVisible();
  await expect(page.getByText('Goal is required')).toBeVisible();

  await page.screenshot({ path: ssPath('mission-create-validation'), fullPage: true });
});

// ---------------------------------------------------------------------------
// Create form filled
// ---------------------------------------------------------------------------
test('@screenshot Mission create form filled', async ({ page }) => {
  await page.goto('/missions/new', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Fill in the form fields
  await page.locator('#mission-title').fill('Upgrade database to PostgreSQL 17');
  await page
    .locator('#mission-goal')
    .fill('Migrate from PostgreSQL 15 to 17 with zero downtime using logical replication.');
  await page
    .locator('#mission-scope')
    .fill('Production database only. Do not modify staging or dev environments.');
  await page.locator('#mission-risk-tier').selectOption('high');
  await page.locator('#mission-owner').fill('Alice Nakamura');

  // Add an acceptance criterion
  await page.locator('#mission-criterion').fill('Zero downtime during migration');
  await page.locator('#mission-criterion').press('Enter');

  // Add a risk
  await page.locator('#mission-risk').fill('Replication lag during switchover');
  await page.locator('#mission-risk').press('Enter');

  await page.waitForTimeout(300);
  await page.screenshot({ path: ssPath('mission-create-filled'), fullPage: true });
});

// ---------------------------------------------------------------------------
// Toast notification (via review approval)
// ---------------------------------------------------------------------------
test('@screenshot Toast success notification', async ({ page }) => {
  // MSN-005 has verificationState: 'passing' and is in review stage — approve is enabled
  await page.goto('/missions/MSN-005/review', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Click the Reject button (always enabled, shows toast)
  const rejectButton = page.locator('button').filter({ hasText: 'Reject' });
  await rejectButton.click();

  // Wait for toast to appear
  await page.waitForTimeout(500);

  await page.screenshot({ path: ssPath('toast-success'), fullPage: true });
});

// ---------------------------------------------------------------------------
// Escalation option select + confirmation
// ---------------------------------------------------------------------------
test('@screenshot Escalation option selected', async ({ page }) => {
  await page.goto('/missions/MSN-001/escalation', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Click the first consequence option to select it
  const _firstOption = page.locator('button').filter({ hasText: 'DECISION OPTIONS' }).first();
  // The options are in the ConsequencePanel — click the first option button
  const _optionButtons = page.locator('[class*="border-l-"] button').first();

  // Fall back to finding the first option in the DECISION OPTIONS section
  const decisionSection = page.getByText('DECISION OPTIONS');
  await expect(decisionSection).toBeVisible();

  // Click the first decision option card
  const options = page.locator('button.aw-focus-ring.aw-card-hover');
  if ((await options.count()) > 0) {
    await options.first().click();
    await page.waitForTimeout(400);
  }

  await page.screenshot({ path: ssPath('escalation-option-selected'), fullPage: true });
});
