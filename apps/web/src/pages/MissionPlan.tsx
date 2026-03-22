import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { missions } from '../data/missions';
import { evidence } from '../data/evidence';
import { aw } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { MissionHeader } from '../components/mission/MissionHeader';
import { EvidenceRail } from '../components/evidence/EvidenceRail';
import { PanelPins } from '../components/primitives/PanelPins';
import { CornerBracket } from '../components/primitives/CornerBracket';

export function MissionPlan() {
  const { id } = useParams<{ id: string }>();
  const mission = missions.find((m) => m.id === id);

  if (!mission) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="aw-section text-[14px]" style={{ color: aw.textSoft }}>
          Mission not found
        </span>
      </div>
    );
  }

  const missionEvidence = evidence.filter((e) => e.missionId === mission.id);

  return (
    <>
      <TopBar missionId={mission.id} breadcrumbs={['Missions', mission.title, 'Plan']} />

      <div className="flex flex-1 overflow-hidden">
        {/* Center: Plan content */}
        <div className="flex-1 overflow-y-auto p-6 pb-16">
          <Link
            to="/missions"
            className="mb-4 inline-flex items-center gap-1 aw-micro text-[8px] transition-colors hover:text-[var(--color-aw-text-strong)]"
            style={{ color: aw.textSoft }}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to missions
          </Link>

          <MissionHeader mission={mission} />

          {/* Goal section */}
          <div className="relative mt-6 border p-4" style={{ borderColor: aw.lineDark }}>
            <CornerBracket side="left" />
            <CornerBracket side="right" />
            <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
              MISSION GOAL
            </div>
            <div className="aw-body mt-2 text-[11px]" style={{ color: aw.text }}>
              {mission.goal}
            </div>
          </div>

          {/* Scope boundary */}
          <div className="relative mt-4 border p-4" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
              SCOPE BOUNDARY
            </div>
            <div className="aw-body mt-2 text-[11px]" style={{ color: aw.text }}>
              {mission.scopeBoundary}
            </div>
          </div>

          {/* Acceptance criteria */}
          <div className="relative mt-4 border p-4" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
              ACCEPTANCE CRITERIA
            </div>
            <ul className="mt-2 space-y-1.5">
              {mission.acceptanceCriteria.map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 aw-body text-[10px]"
                  style={{ color: aw.text }}
                >
                  <span
                    className="mt-[3px] inline-block h-[5px] w-[5px] shrink-0 rounded-full"
                    style={{ backgroundColor: aw.lineInk }}
                  />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="relative mt-4 border p-4" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-micro text-[8px]" style={{ color: aw.accentStrong }}>
              IDENTIFIED RISKS
            </div>
            <ul className="mt-2 space-y-1.5">
              {mission.risks.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 aw-body text-[10px]"
                  style={{ color: aw.text }}
                >
                  <span
                    className="mt-[3px] inline-block h-[5px] w-[5px] shrink-0 rotate-45"
                    style={{ backgroundColor: aw.accent }}
                  />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Approval CTA */}
          {mission.stage === 'plan' && (
            <div className="mt-6 flex items-center gap-3">
              <button
                className="aw-section px-4 py-2 text-[10px]"
                style={{
                  backgroundColor: aw.plateDark,
                  color: aw.inverse,
                }}
              >
                Approve Plan & Begin Execution
              </button>
              <button
                className="aw-section border px-4 py-2 text-[10px]"
                style={{ borderColor: aw.lineDark, color: aw.text }}
              >
                Request Changes
              </button>
            </div>
          )}
        </div>

        {/* Right rail: evidence + risk */}
        <div
          className="w-[280px] shrink-0 overflow-y-auto border-l p-4 pb-16"
          style={{ borderColor: aw.line }}
        >
          <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
            RISK & EVIDENCE SUMMARY
          </div>
          <div className="mt-3">
            {missionEvidence.length > 0 ? (
              <EvidenceRail items={missionEvidence} />
            ) : (
              <div className="aw-body py-4 text-center text-[9px]" style={{ color: aw.textSoft }}>
                No evidence gathered yet.
                <br />
                Evidence will appear once execution begins.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
