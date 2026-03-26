import { describe, it, expect } from 'vitest';
import { artifacts } from './artifacts.js';
import { missions } from './missions.js';

describe('completed mission artifacts', () => {
  const completedMissions = missions.filter((m) => m.stage === 'completed');

  it('every completed mission artifactId has a matching artifact', () => {
    const artifactIds = new Set(artifacts.map((a) => a.id));
    for (const m of completedMissions) {
      for (const aid of m.artifactIds ?? []) {
        expect(artifactIds.has(aid)).toBe(true);
      }
    }
  });

  it('completed missions have artifacts of diverse types (video, image, markdown)', () => {
    const completedArtifactIds = completedMissions.flatMap((m) => m.artifactIds ?? []);
    const completedArtifacts = artifacts.filter((a) => completedArtifactIds.includes(a.id));
    const types = new Set(completedArtifacts.map((a) => a.type));

    expect(types.has('video')).toBe(true);
    expect(types.has('image')).toBe(true);
    expect(types.has('markdown')).toBe(true);
  });

  it('ART-007 is a video artifact for a completed mission', () => {
    const art = artifacts.find((a) => a.id === 'ART-007');
    expect(art).toBeDefined();
    expect(art!.type).toBe('video');
    expect(art!.missionId).toBe('MSN-006');
  });

  it('ART-008 is a markdown artifact for a completed mission', () => {
    const art = artifacts.find((a) => a.id === 'ART-008');
    expect(art).toBeDefined();
    expect(art!.type).toBe('markdown');
    expect(art!.missionId).toBe('MSN-006');
  });

  it('ART-009 is an image artifact for a completed mission', () => {
    const art = artifacts.find((a) => a.id === 'ART-009');
    expect(art).toBeDefined();
    expect(art!.type).toBe('image');
    expect(art!.missionId).toBe('MSN-006');
  });

  it('ART-010 is a markdown artifact for MSN-007', () => {
    const art = artifacts.find((a) => a.id === 'ART-010');
    expect(art).toBeDefined();
    expect(art!.type).toBe('markdown');
    expect(art!.missionId).toBe('MSN-007');
  });
});
