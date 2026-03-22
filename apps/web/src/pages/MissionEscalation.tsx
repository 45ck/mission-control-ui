import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { missions } from '../data/missions';
import { escalations } from '../data/escalations';
import { agentSessions } from '../data/agent-sessions';
import { aw } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { EscalationHeader } from '../components/escalation/EscalationHeader';
import { ReplayTimeline } from '../components/escalation/ReplayTimeline';
import { ConsequencePanel } from '../components/escalation/ConsequencePanel';

export function MissionEscalation() {
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

  const mEscalations = escalations.filter((e) => e.missionId === mission.id);
  const mSessions = agentSessions.filter((s) => s.missionId === mission.id);
  const primaryEscalation = mEscalations[0];

  if (!primaryEscalation) {
    return (
      <>
        <TopBar missionId={mission.id} breadcrumbs={['Missions', mission.title, 'Escalation']} />
        <div className="flex h-full items-center justify-center">
          <span className="aw-body text-[11px]" style={{ color: aw.textSoft }}>
            No escalations for this mission.
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar missionId={mission.id} breadcrumbs={['Missions', mission.title, 'Escalation']} />

      <EscalationHeader escalation={primaryEscalation} />

      <div className="flex flex-1 overflow-hidden">
        {/* Center: issue detail + replay */}
        <div className="flex-1 overflow-y-auto p-6 pb-16">
          <Link
            to="/missions"
            className="mb-4 inline-flex items-center gap-1 aw-micro text-[8px] transition-colors hover:text-[var(--color-aw-text-strong)]"
            style={{ color: aw.textSoft }}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to missions
          </Link>

          {/* Issue detail */}
          <div className="border p-4" style={{ borderColor: aw.lineDark }}>
            <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
              ISSUE DETAIL
            </div>
            <div className="aw-body mt-2 text-[10px] leading-relaxed" style={{ color: aw.text }}>
              {primaryEscalation.detail}
            </div>
          </div>

          {/* Replay timeline */}
          <div className="mt-6">
            <ReplayTimeline sessions={mSessions} />
          </div>

          {/* Other escalations */}
          {mEscalations.length > 1 && (
            <div className="mt-6">
              <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
                RELATED ESCALATIONS ({mEscalations.length - 1})
              </div>
              <div className="mt-2 space-y-3">
                {mEscalations.slice(1).map((esc) => (
                  <div key={esc.id} className="border p-3" style={{ borderColor: aw.lineDark }}>
                    <div className="aw-section text-[9px]" style={{ color: aw.textStrong }}>
                      {esc.title}
                    </div>
                    <div className="aw-body mt-1 text-[8px]" style={{ color: aw.text }}>
                      {esc.summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: consequences */}
        <div
          className="w-[300px] shrink-0 overflow-y-auto border-l p-4 pb-16"
          style={{ borderColor: aw.line }}
        >
          <ConsequencePanel options={primaryEscalation.options} />
        </div>
      </div>
    </>
  );
}
