import { useState } from 'react';
import { FileText, Film, Image, Code } from 'lucide-react';
import { aw } from '../../theme/tokens';
import { PanelPins } from '../primitives/PanelPins';
import { MarkdownViewer } from './MarkdownViewer';
import type { Artifact, ArtifactType } from '../../data/artifacts';

interface ArtifactPanelProps {
  artifacts: Artifact[];
}

const typeIcon: Record<ArtifactType, typeof FileText> = {
  markdown: FileText,
  video: Film,
  image: Image,
  html: Code,
};

export function ArtifactPanel({ artifacts }: ArtifactPanelProps) {
  const [selectedId, setSelectedId] = useState(artifacts[0]?.id ?? '');
  const selected = artifacts.find((a) => a.id === selectedId) ?? artifacts[0];

  if (artifacts.length === 0) return null;

  return (
    <div className="relative mt-3 border p-4" style={{ borderColor: aw.lineDark }}>
      <PanelPins corners="all" />

      {/* Section label */}
      <div className="aw-micro mb-3 text-[10px]" style={{ color: aw.textSoft }}>
        ARTIFACTS
      </div>

      {/* Gallery row */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {artifacts.map((artifact) => {
          const Icon = typeIcon[artifact.type];
          const isActive = artifact.id === selected?.id;
          return (
            <button
              key={artifact.id}
              className="flex w-[90px] shrink-0 flex-col items-center gap-1.5 rounded border p-2.5 transition-colors"
              style={{
                borderColor: isActive ? aw.accent : aw.lineFaint,
                backgroundColor: isActive ? aw.haze : 'transparent',
              }}
              onClick={() => setSelectedId(artifact.id)}
            >
              <Icon size={20} style={{ color: isActive ? aw.accent : aw.textSoft }} />
              <span
                className="aw-micro w-full truncate text-center text-[9px]"
                style={{ color: isActive ? aw.textStrong : aw.textSoft }}
              >
                {artifact.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Viewer area */}
      {selected && (
        <div className="mt-3 overflow-hidden rounded border" style={{ borderColor: aw.lineFaint }}>
          <ArtifactViewer artifact={selected} />
        </div>
      )}
    </div>
  );
}

// ── Viewer dispatcher ──────────────────────────────────────────

function ArtifactViewer({ artifact }: { artifact: Artifact }) {
  switch (artifact.type) {
    case 'image':
      return (
        <div className="flex items-center justify-center p-4" style={{ backgroundColor: aw.haze }}>
          <img
            src={artifact.content}
            alt={artifact.title}
            className="max-h-[400px] w-full object-contain"
            style={{ border: `1px solid ${aw.lineFaint}` }}
          />
        </div>
      );

    case 'video':
      return (
        <div className="p-4" style={{ backgroundColor: aw.haze }}>
          <video
            controls
            className="w-full"
            style={{ maxHeight: 400, border: `1px solid ${aw.lineFaint}` }}
            poster={artifact.thumbnail}
          >
            <source src={artifact.content} type="video/mp4" />
            <p className="aw-body text-[11px]" style={{ color: aw.textSoft }}>
              Video playback not supported
            </p>
          </video>
        </div>
      );

    case 'markdown':
      return (
        <div className="max-h-[400px] overflow-y-auto p-4">
          <MarkdownViewer content={artifact.content} />
        </div>
      );

    case 'html':
      return (
        <iframe
          srcDoc={artifact.content}
          sandbox="allow-same-origin"
          className="w-full border-0"
          style={{ height: 320, backgroundColor: '#fff' }}
          title={artifact.title}
        />
      );
  }
}
