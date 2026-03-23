import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface EvalScores {
  visualHierarchy: number; // 1-5: clear heading/content/action hierarchy
  consistency: number; // 1-5: matches design system (aw tokens, typography)
  informationDensity: number; // 1-5: appropriate density, not cluttered/sparse
  actionClarity: number; // 1-5: buttons/links clearly actionable
  stateVisibility: number; // 1-5: current state obvious (active tab, selected item)
  errorPrevention: number; // 1-5: guardrails visible, disabled states clear
}

export interface EvalResult {
  screenshot: string;
  scores: EvalScores;
  issues: string[];
  strengths: string[];
  overall: number;
}

export interface EvalReport {
  timestamp: string;
  results: EvalResult[];
  summary: {
    totalScreenshots: number;
    averageOverall: number;
    lowestScore: { screenshot: string; dimension: string; score: number } | null;
    passCount: number;
    failCount: number;
  };
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------
function buildPrompt(pageName: string, pageLabel: string): string {
  return `You are evaluating a screenshot of a UI page called "${pageLabel}" (${pageName}).

This is part of "Mission Control", an agent supervision dashboard with a sci-fi/military aesthetic using the "aw" design token system (muted grays, sharp borders, monospace-style typography).

Score each dimension from 1 (poor) to 5 (excellent):

1. **Visual Hierarchy** (1-5): Is there a clear heading → content → action hierarchy? Are primary actions prominent?
2. **Consistency** (1-5): Does it match the design system? Consistent typography, spacing, border styles?
3. **Information Density** (1-5): Is density appropriate? Not too cluttered, not too sparse for a dashboard?
4. **Action Clarity** (1-5): Are buttons and interactive elements clearly distinguishable from static content?
5. **State Visibility** (1-5): Is the current state obvious? Active nav item, selected filters, verification status?
6. **Error Prevention** (1-5): Are there guardrails? Disabled states for invalid actions? Confirmation for destructive actions?

Also provide:
- **issues**: A list of specific UI/UX problems (empty array if none)
- **strengths**: A list of things done well (at least 1)
- **overall**: A composite score from 1-5 (can differ from the average of dimensions)

Respond with ONLY a JSON object matching this exact schema:
{
  "scores": {
    "visualHierarchy": <number>,
    "consistency": <number>,
    "informationDensity": <number>,
    "actionClarity": <number>,
    "stateVisibility": <number>,
    "errorPrevention": <number>
  },
  "issues": [<string>, ...],
  "strengths": [<string>, ...],
  "overall": <number>
}`;
}

// ---------------------------------------------------------------------------
// Evaluate a single screenshot
// ---------------------------------------------------------------------------
export async function evaluateScreenshot(
  client: Anthropic,
  screenshotPath: string,
  pageName: string,
  pageLabel: string,
): Promise<EvalResult> {
  const imageData = fs.readFileSync(screenshotPath);
  const base64 = imageData.toString('base64');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/png', data: base64 },
          },
          {
            type: 'text',
            text: buildPrompt(pageName, pageLabel),
          },
        ],
      },
    ],
  });

  const text = response.content.find((block) => block.type === 'text')?.text ?? '{}';

  // Extract JSON from the response (handle markdown fences)
  const jsonMatch = /\{[\s\S]*\}/.exec(text);
  if (!jsonMatch) {
    throw new Error(`Failed to parse evaluation response for ${pageName}: ${text}`);
  }

  const parsed = JSON.parse(jsonMatch[0]) as {
    scores: EvalScores;
    issues: string[];
    strengths: string[];
    overall: number;
  };

  return {
    screenshot: pageName,
    scores: parsed.scores,
    issues: parsed.issues,
    strengths: parsed.strengths,
    overall: parsed.overall,
  };
}

// ---------------------------------------------------------------------------
// Generate report
// ---------------------------------------------------------------------------
export function generateReport(results: EvalResult[]): EvalReport {
  const totalScreenshots = results.length;
  const averageOverall =
    totalScreenshots > 0 ? results.reduce((sum, r) => sum + r.overall, 0) / totalScreenshots : 0;

  // Find the lowest individual dimension score
  let lowestScore: EvalReport['summary']['lowestScore'] = null;
  const dimensions = [
    'visualHierarchy',
    'consistency',
    'informationDensity',
    'actionClarity',
    'stateVisibility',
    'errorPrevention',
  ] as const;

  for (const result of results) {
    for (const dim of dimensions) {
      const score = result.scores[dim];
      if (!lowestScore || score < lowestScore.score) {
        lowestScore = { screenshot: result.screenshot, dimension: dim, score };
      }
    }
  }

  const failCount = results.filter((r) => {
    return dimensions.some((d) => r.scores[d] < 2);
  }).length;

  return {
    timestamp: new Date().toISOString(),
    results,
    summary: {
      totalScreenshots,
      averageOverall: Math.round(averageOverall * 100) / 100,
      lowestScore,
      passCount: totalScreenshots - failCount,
      failCount,
    },
  };
}

// ---------------------------------------------------------------------------
// Markdown report
// ---------------------------------------------------------------------------
export function toMarkdown(report: EvalReport): string {
  const lines: string[] = [
    '# Screenshot Evaluation Report',
    '',
    `**Generated**: ${report.timestamp}`,
    `**Screenshots evaluated**: ${report.summary.totalScreenshots}`,
    `**Average overall score**: ${report.summary.averageOverall}/5`,
    `**Pass/Fail**: ${report.summary.passCount} passed, ${report.summary.failCount} failed`,
    '',
  ];

  if (report.summary.lowestScore) {
    const ls = report.summary.lowestScore;
    lines.push(`**Lowest score**: ${ls.screenshot} — ${ls.dimension}: ${ls.score}/5`, '');
  }

  lines.push('## Results', '');
  lines.push(
    '| Page | Overall | Hierarchy | Consistency | Density | Actions | State | Errors |',
    '|------|---------|-----------|-------------|---------|---------|-------|--------|',
  );

  for (const r of report.results) {
    const s = r.scores;
    lines.push(
      `| ${r.screenshot} | **${r.overall}** | ${s.visualHierarchy} | ${s.consistency} | ${s.informationDensity} | ${s.actionClarity} | ${s.stateVisibility} | ${s.errorPrevention} |`,
    );
  }

  lines.push('');

  for (const r of report.results) {
    lines.push(`### ${r.screenshot}`, '');

    if (r.issues.length > 0) {
      lines.push('**Issues:**');
      for (const issue of r.issues) {
        lines.push(`- ${issue}`);
      }
      lines.push('');
    }

    if (r.strengths.length > 0) {
      lines.push('**Strengths:**');
      for (const strength of r.strengths) {
        lines.push(`- ${strength}`);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Collect screenshot files
// ---------------------------------------------------------------------------
export function collectScreenshots(screenshotDir: string): string[] {
  if (!fs.existsSync(screenshotDir)) return [];
  return fs
    .readdirSync(screenshotDir)
    .filter((f) => f.endsWith('.png'))
    .map((f) => path.join(screenshotDir, f))
    .sort();
}
