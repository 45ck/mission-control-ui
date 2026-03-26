import { describe, it, expect } from 'vitest';
import { missions } from './missions.js';

describe('completed missions data', () => {
  const completedMissions = missions.filter((m) => m.stage === 'completed');

  it('has at least 2 completed missions', () => {
    expect(completedMissions.length).toBeGreaterThanOrEqual(2);
  });

  it('completed missions have unique IDs', () => {
    const ids = completedMissions.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('completed missions have artifactIds arrays', () => {
    for (const m of completedMissions) {
      expect(Array.isArray(m.artifactIds)).toBe(true);
      expect(m.artifactIds!.length).toBeGreaterThan(0);
    }
  });

  it('completed missions have verificationState "passing"', () => {
    for (const m of completedMissions) {
      expect(m.verificationState).toBe('passing');
    }
  });

  it('completed missions have all required Mission fields', () => {
    for (const m of completedMissions) {
      expect(typeof m.id).toBe('string');
      expect(typeof m.title).toBe('string');
      expect(typeof m.goal).toBe('string');
      expect(typeof m.scopeBoundary).toBe('string');
      expect(Array.isArray(m.risks)).toBe(true);
      expect(Array.isArray(m.acceptanceCriteria)).toBe(true);
      expect(typeof m.owner).toBe('string');
      expect(m.stage).toBe('completed');
    }
  });

  it('at least one completed mission goal contains markdown formatting', () => {
    const hasMarkdown = completedMissions.some(
      (m) => m.goal.includes('**') || m.goal.includes('###') || m.goal.includes('`'),
    );
    expect(hasMarkdown).toBe(true);
  });
});

describe('missions with markdown content', () => {
  it('MSN-003 goal contains markdown formatting', () => {
    const msn003 = missions.find((m) => m.id === 'MSN-003');
    expect(msn003).toBeDefined();
    expect(msn003!.goal).toMatch(/\*\*|###|`/);
  });
});
