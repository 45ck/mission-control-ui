import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { missions } from '../data/missions';
import type { Mission, Stage, RiskTier } from '../data/missions';
import { aw } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { MissionCard } from '../components/mission/MissionCard';
import { FocusPanel } from '../components/mission/FocusPanel';
import { PageTransition } from '../components/shell/PageTransition';

type FilterStage = Stage | 'all';
type FilterRisk = RiskTier | 'all';

export function MissionHome() {
  const [selectedId, setSelectedId] = useState<string | null>(missions[0]?.id ?? null);
  const [searchParams, setSearchParams] = useSearchParams();
  const filterStage = (searchParams.get('stage') as FilterStage) ?? 'all';
  const filterRisk = (searchParams.get('risk') as FilterRisk) ?? 'all';

  const setFilterStage = (s: FilterStage) => {
    setSearchParams(
      (prev) => {
        if (s === 'all') {
          prev.delete('stage');
        } else {
          prev.set('stage', s);
        }
        return prev;
      },
      { replace: true },
    );
  };
  const setFilterRisk = (r: FilterRisk) => {
    setSearchParams(
      (prev) => {
        if (r === 'all') {
          prev.delete('risk');
        } else {
          prev.set('risk', r);
        }
        return prev;
      },
      { replace: true },
    );
  };

  const filtered = missions.filter((m) => {
    if (filterStage !== 'all' && m.stage !== filterStage) return false;
    if (filterRisk !== 'all' && m.riskTier !== filterRisk) return false;
    return true;
  });

  const riskOrder: Record<RiskTier, number> = { high: 0, medium: 1, low: 2 };
  const stageOrder: Record<Stage, number> = { escalation: 0, review: 1, execute: 2, plan: 3 };
  const sorted = [...filtered].sort((a, b) => {
    const sd = stageOrder[a.stage] - stageOrder[b.stage];
    if (sd !== 0) return sd;
    return riskOrder[a.riskTier] - riskOrder[b.riskTier];
  });

  const selected: Mission | null = missions.find((m) => m.id === selectedId) ?? null;

  const stages: FilterStage[] = ['all', 'plan', 'execute', 'review', 'escalation'];
  const risks: FilterRisk[] = ['all', 'low', 'medium', 'high'];

  return (
    <PageTransition>
      <TopBar breadcrumbs={[{ label: 'Missions' }, { label: 'Inbox' }]} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mission list */}
        <div className="flex w-[360px] shrink-0 flex-col border-r" style={{ borderColor: aw.line }}>
          {/* New Mission button */}
          <div className="border-b px-4 py-3" style={{ borderColor: aw.lineFaint }}>
            <Link
              to="/missions/new"
              className="aw-section aw-focus-ring flex w-full items-center justify-center gap-1 px-4 py-2.5 transition-colors"
              style={{ backgroundColor: aw.accent, color: aw.inverse }}
            >
              + NEW MISSION
            </Link>
          </div>

          {/* Filters */}
          <div className="border-b px-4 py-3" style={{ borderColor: aw.lineFaint }}>
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              FILTER BY STAGE
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {stages.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStage(s)}
                  className="aw-micro aw-focus-ring px-3 py-1 transition-colors"
                  style={{
                    backgroundColor: filterStage === s ? aw.plate : 'transparent',
                    color: filterStage === s ? aw.inverse : aw.textSoft,
                    border: `1px solid ${filterStage === s ? aw.plate : aw.lineDark}`,
                  }}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="aw-micro mt-3" style={{ color: aw.textSoft }}>
              FILTER BY RISK
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {risks.map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRisk(r)}
                  className="aw-micro aw-focus-ring px-3 py-1 transition-colors"
                  style={{
                    backgroundColor: filterRisk === r ? aw.plate : 'transparent',
                    color: filterRisk === r ? aw.inverse : aw.textSoft,
                    border: `1px solid ${filterRisk === r ? aw.plate : aw.lineDark}`,
                  }}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Mission cards */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {sorted.map((m) => (
                <MissionCard
                  key={m.id}
                  mission={m}
                  selected={m.id === selectedId}
                  onClick={() => setSelectedId(m.id)}
                />
              ))}
              {sorted.length === 0 && (
                <div className="aw-body py-8 text-center" style={{ color: aw.textSoft }}>
                  No missions match filters
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Focus panel */}
        <div className="flex-1 overflow-y-auto">
          <FocusPanel mission={selected} />
        </div>
      </div>
    </PageTransition>
  );
}
