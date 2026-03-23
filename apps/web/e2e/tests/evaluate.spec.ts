import { test, expect } from '@playwright/test';
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  evaluateScreenshot,
  generateReport,
  toMarkdown,
  collectScreenshots,
} from '../helpers/evaluate';
import { routes } from '../helpers/routes';

const screenshotDir = path.resolve(import.meta.dirname, '..', 'screenshots');
const evaluationsDir = path.resolve(import.meta.dirname, '..', 'evaluations');

test('@evaluate AI screenshot evaluation', async () => {
  // Ensure screenshots exist
  const screenshots = collectScreenshots(screenshotDir);
  expect(
    screenshots.length,
    'No screenshots found — run smoke/interaction tests first',
  ).toBeGreaterThan(0);

  // Build name → label lookup from routes
  const routeMap = new Map(routes.map((r) => [r.name, r.label]));

  // Initialize Anthropic client (uses ANTHROPIC_API_KEY env var)
  const client = new Anthropic();

  // Evaluate each screenshot
  const results = [];
  for (const screenshotPath of screenshots) {
    const fileName = path.basename(screenshotPath, '.png');
    const label = routeMap.get(fileName) ?? fileName;

    console.log(`Evaluating: ${fileName} (${label})`);

    const result = await evaluateScreenshot(client, screenshotPath, fileName, label);
    results.push(result);

    console.log(`  Overall: ${result.overall}/5 | Issues: ${result.issues.length}`);
  }

  // Generate report
  const report = generateReport(results);

  // Write outputs
  fs.mkdirSync(evaluationsDir, { recursive: true });
  fs.writeFileSync(path.join(evaluationsDir, 'report.json'), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(evaluationsDir, 'report.md'), toMarkdown(report));

  console.log(`\nReport written to e2e/evaluations/`);
  console.log(`Average overall: ${report.summary.averageOverall}/5`);
  console.log(`Pass: ${report.summary.passCount}, Fail: ${report.summary.failCount}`);

  // Fail if any page scores below 2/5 on any dimension
  const dimensions = [
    'visualHierarchy',
    'consistency',
    'informationDensity',
    'actionClarity',
    'stateVisibility',
    'errorPrevention',
  ] as const;

  const failures: string[] = [];
  for (const result of results) {
    for (const dim of dimensions) {
      const score = result.scores[dim];
      if (score < 2) {
        failures.push(`${result.screenshot}: ${dim} = ${score}/5`);
      }
    }
  }

  if (failures.length > 0) {
    console.error('\nFailing dimensions:');
    for (const f of failures) console.error(`  - ${f}`);
  }

  expect(failures, 'Pages scored below 2/5 on at least one dimension').toHaveLength(0);
});
