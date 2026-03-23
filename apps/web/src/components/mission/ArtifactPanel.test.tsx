import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArtifactPanel } from './ArtifactPanel.js';
import type { Artifact } from '../../data/artifacts.js';

const mkArtifact = (overrides: Partial<Artifact> & Pick<Artifact, 'id' | 'type'>): Artifact => ({
  missionId: 'MSN-001',
  title: `Artifact ${overrides.id}`,
  content: 'test-content',
  createdAt: '2026-03-22T00:00:00Z',
  ...overrides,
});

const sampleArtifacts: Artifact[] = [
  mkArtifact({ id: 'A1', type: 'markdown', title: 'Summary', content: '# Hello' }),
  mkArtifact({ id: 'A2', type: 'image', title: 'Diagram', content: 'https://example.com/img.png' }),
  mkArtifact({ id: 'A3', type: 'video', title: 'Demo', content: 'https://example.com/vid.mp4' }),
  mkArtifact({ id: 'A4', type: 'html', title: 'Trace', content: '<p>trace</p>' }),
];

describe('ArtifactPanel', () => {
  it('returns null for empty artifact list', () => {
    const { container } = render(<ArtifactPanel artifacts={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders ARTIFACTS section label', () => {
    render(<ArtifactPanel artifacts={sampleArtifacts} />);
    expect(screen.getByText('ARTIFACTS')).toBeInTheDocument();
  });

  it('renders a gallery card for each artifact', () => {
    render(<ArtifactPanel artifacts={sampleArtifacts} />);
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Diagram')).toBeInTheDocument();
    expect(screen.getByText('Demo')).toBeInTheDocument();
    expect(screen.getByText('Trace')).toBeInTheDocument();
  });

  it('selects the first artifact by default', () => {
    render(<ArtifactPanel artifacts={sampleArtifacts} />);
    // The first artifact is markdown type — MarkdownViewer renders "Hello" heading
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('switches viewer when clicking a different artifact card', () => {
    render(<ArtifactPanel artifacts={sampleArtifacts} />);

    // Click the image artifact card
    fireEvent.click(screen.getByText('Diagram'));

    // Should render an <img> for the image artifact
    const img = screen.getByAltText('Diagram');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('https://example.com/img.png');
  });

  it('renders an image viewer for image type', () => {
    const imageOnly = [
      mkArtifact({
        id: 'I1',
        type: 'image',
        title: 'Photo',
        content: 'https://example.com/photo.png',
      }),
    ];
    render(<ArtifactPanel artifacts={imageOnly} />);
    expect(screen.getByAltText('Photo')).toBeInTheDocument();
  });

  it('renders a video viewer for video type', () => {
    const videoOnly = [
      mkArtifact({
        id: 'V1',
        type: 'video',
        title: 'Clip',
        content: 'https://example.com/clip.mp4',
      }),
    ];
    render(<ArtifactPanel artifacts={videoOnly} />);
    const video = document.querySelector('video');
    expect(video).not.toBeNull();
    const source = video!.querySelector('source');
    expect(source?.getAttribute('src')).toBe('https://example.com/clip.mp4');
  });

  it('renders an iframe for html type', () => {
    const htmlOnly = [
      mkArtifact({ id: 'H1', type: 'html', title: 'Report', content: '<h1>Hi</h1>' }),
    ];
    render(<ArtifactPanel artifacts={htmlOnly} />);
    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe!.getAttribute('srcdoc')).toBe('<h1>Hi</h1>');
    expect(iframe!.getAttribute('title')).toBe('Report');
  });

  it('renders MarkdownViewer for markdown type', () => {
    const mdOnly = [
      mkArtifact({ id: 'M1', type: 'markdown', title: 'Notes', content: '## Notes Section' }),
    ];
    render(<ArtifactPanel artifacts={mdOnly} />);
    expect(screen.getByText('Notes Section')).toBeInTheDocument();
  });
});
