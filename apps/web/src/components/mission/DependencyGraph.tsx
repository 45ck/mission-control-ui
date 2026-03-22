import { useState } from 'react';
import type { Mission } from '../../data/missions';
import { aw } from '../../theme/tokens';

const stageStroke: Record<string, string> = {
  plan: aw.plate,
  execute: aw.plateDark,
  review: aw.accentStrong,
  escalation: aw.accent,
  completed: aw.textSoft,
};

interface NodeLayout {
  mission: Mission;
  x: number;
  y: number;
}

function computeLayout(missions: Mission[]): NodeLayout[] {
  const ids = new Set(missions.map((m) => m.id));
  const layers = new Map<string, number>();

  function getLayer(id: string): number {
    const cached = layers.get(id);
    if (cached !== undefined) return cached;

    const m = missions.find((mi) => mi.id === id);
    if (!m) return 0;

    const deps = (m.blockedBy ?? []).filter((d) => ids.has(d));
    if (deps.length === 0) {
      layers.set(id, 0);
      return 0;
    }

    const maxDep = Math.max(...deps.map((d) => getLayer(d)));
    const layer = maxDep + 1;
    layers.set(id, layer);
    return layer;
  }

  missions.forEach((m) => getLayer(m.id));

  const byLayer = new Map<number, Mission[]>();
  missions.forEach((m) => {
    const layer = layers.get(m.id) ?? 0;
    const arr = byLayer.get(layer) ?? [];
    arr.push(m);
    byLayer.set(layer, arr);
  });

  const nodes: NodeLayout[] = [];
  byLayer.forEach((group, layer) => {
    group.forEach((m, idx) => {
      nodes.push({
        mission: m,
        x: layer * 200,
        y: idx * 80,
      });
    });
  });

  return nodes;
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + '\u2026' : text;
}

export function DependencyGraph({ missions }: { missions: Mission[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hasDeps = missions.some((m) => m.blocks?.length ?? m.blockedBy?.length);
  if (!hasDeps) {
    return (
      <div className="aw-body-sm py-4 text-center" style={{ color: aw.textSoft }}>
        No dependencies
      </div>
    );
  }

  const nodes = computeLayout(missions);
  if (nodes.length === 0) return null;

  const nodeWidth = 160;
  const nodeHeight = 50;
  const padding = 20;

  const maxX = Math.max(...nodes.map((n) => n.x)) + nodeWidth + padding;
  const maxY = Math.max(...nodes.map((n) => n.y)) + nodeHeight + padding;

  const posMap = new Map<string, { x: number; y: number }>();
  nodes.forEach((n) => posMap.set(n.mission.id, { x: n.x, y: n.y }));

  const edges: { from: { x: number; y: number }; to: { x: number; y: number } }[] = [];
  nodes.forEach((n) => {
    const blocksIds = n.mission.blocks ?? [];
    blocksIds.forEach((targetId) => {
      const target = posMap.get(targetId);
      if (target) {
        edges.push({
          from: { x: n.x + nodeWidth, y: n.y + nodeHeight / 2 },
          to: { x: target.x, y: target.y + nodeHeight / 2 },
        });
      }
    });
    // Also draw edges from blockedBy perspective to catch all relationships
    const blockedByIds = n.mission.blockedBy ?? [];
    blockedByIds.forEach((sourceId) => {
      const source = posMap.get(sourceId);
      if (source) {
        // Check if this edge already exists from the blocks side
        const alreadyExists = edges.some(
          (e) =>
            e.from.x === source.x + nodeWidth &&
            e.from.y === source.y + nodeHeight / 2 &&
            e.to.x === n.x &&
            e.to.y === n.y + nodeHeight / 2,
        );
        if (!alreadyExists) {
          edges.push({
            from: { x: source.x + nodeWidth, y: source.y + nodeHeight / 2 },
            to: { x: n.x, y: n.y + nodeHeight / 2 },
          });
        }
      }
    });
  });

  const hoveredMission = hoveredId ? missions.find((m) => m.id === hoveredId) : null;
  const hoveredNode = hoveredId ? posMap.get(hoveredId) : null;

  return (
    <svg
      viewBox={`${-padding} ${-padding} ${maxX + padding} ${maxY + padding}`}
      width={maxX + padding}
      height={maxY + padding}
      style={{ maxWidth: '100%' }}
    >
      {/* Edges */}
      {edges.map((edge, i) => {
        const midX = (edge.from.x + edge.to.x) / 2;
        const d = `M ${edge.from.x} ${edge.from.y} L ${midX} ${edge.from.y} L ${midX} ${edge.to.y} L ${edge.to.x} ${edge.to.y}`;
        return <path key={i} d={d} fill="none" stroke={aw.lineDark} strokeWidth={1.5} />;
      })}

      {/* Nodes */}
      {nodes.map((n) => {
        const stroke = stageStroke[n.mission.stage] ?? aw.plate;
        return (
          <g
            key={n.mission.id}
            transform={`translate(${n.x}, ${n.y})`}
            onMouseEnter={() => setHoveredId(n.mission.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ cursor: 'default' }}
          >
            <rect
              width={nodeWidth}
              height={nodeHeight}
              rx={4}
              fill={aw.paperTop}
              stroke={stroke}
              strokeWidth={1.5}
            />
            <text
              x={8}
              y={18}
              fill={aw.textSoft}
              style={{ fontSize: 9, fontFamily: 'Rajdhani, sans-serif', fontWeight: 500 }}
            >
              {n.mission.id}
            </text>
            <text
              x={8}
              y={35}
              fill={aw.textStrong}
              style={{ fontSize: 11, fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
            >
              {truncate(n.mission.title, 20)}
            </text>
          </g>
        );
      })}

      {/* Tooltip */}
      {hoveredMission && hoveredNode && (
        <g transform={`translate(${hoveredNode.x}, ${hoveredNode.y - 30})`}>
          <rect
            width={Math.min(hoveredMission.title.length * 6.5 + 16, 280)}
            height={22}
            rx={3}
            fill={aw.plateDark}
          />
          <text
            x={8}
            y={15}
            fill={aw.inverse}
            style={{ fontSize: 11, fontFamily: 'IBM Plex Sans Condensed, sans-serif' }}
          >
            {hoveredMission.title}
          </text>
        </g>
      )}
    </svg>
  );
}
