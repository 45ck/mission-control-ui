import { describe, it, expect } from 'vitest';
import { artifacts } from './artifacts.js';
import { missions } from './missions.js';
import type { ArtifactType } from './artifacts.js';

describe('artifacts data', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(artifacts)).toBe(true);
    expect(artifacts.length).toBeGreaterThan(0);
  });

  it('every artifact has required fields with correct types', () => {
    const validTypes: ArtifactType[] = ['image', 'video', 'markdown', 'html'];

    for (const a of artifacts) {
      expect(typeof a.id).toBe('string');
      expect(a.id.length).toBeGreaterThan(0);
      expect(typeof a.missionId).toBe('string');
      expect(a.missionId.length).toBeGreaterThan(0);
      expect(validTypes).toContain(a.type);
      expect(typeof a.title).toBe('string');
      expect(a.title.length).toBeGreaterThan(0);
      expect(typeof a.content).toBe('string');
      expect(a.content.length).toBeGreaterThan(0);
      expect(typeof a.createdAt).toBe('string');
    }
  });

  it('has unique artifact IDs', () => {
    const ids = artifacts.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every missionId references a known mission', () => {
    const missionIds = new Set(missions.map((m) => m.id));
    for (const a of artifacts) {
      expect(missionIds.has(a.missionId)).toBe(true);
    }
  });

  it('every mission with artifactIds has matching artifacts', () => {
    const artifactIds = new Set(artifacts.map((a) => a.id));
    for (const m of missions) {
      if (m.artifactIds) {
        for (const aid of m.artifactIds) {
          expect(artifactIds.has(aid)).toBe(true);
        }
      }
    }
  });

  it('thumbnail is optional but when present is a non-empty string', () => {
    for (const a of artifacts) {
      if (a.thumbnail !== undefined) {
        expect(typeof a.thumbnail).toBe('string');
        expect(a.thumbnail.length).toBeGreaterThan(0);
      }
    }
  });

  it('createdAt values are valid ISO date strings', () => {
    for (const a of artifacts) {
      const date = new Date(a.createdAt);
      expect(date.getTime()).not.toBeNaN();
    }
  });
});
