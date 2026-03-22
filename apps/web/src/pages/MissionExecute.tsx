import { useParams, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { missions } from '../data/missions';
import { agentSessions } from '../data/agent-sessions';
import { browserSessions } from '../data/browser-sessions';
import { terminalSessions } from '../data/terminal-sessions';
import { evidence } from '../data/evidence';
import { aw } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { MissionHeader } from '../components/mission/MissionHeader';
import { AgentSwimlane } from '../components/execute/AgentSwimlane';
import { BrowserSessionPane, TerminalSessionPane } from '../components/execute/SessionPane';
import { EvidenceRail } from '../components/evidence/EvidenceRail';

export function MissionExecute() {
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

  const mAgentSessions = agentSessions.filter((s) => s.missionId === mission.id);
  const mBrowserSessions = browserSessions.filter((s) => s.missionId === mission.id);
  const mTerminalSessions = terminalSessions.filter((s) => s.missionId === mission.id);
  const mEvidence = evidence.filter((e) => e.missionId === mission.id);

  return (
    <>
      <TopBar missionId={mission.id} breadcrumbs={['Missions', mission.title, 'Execute']} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: mini mission context */}
        <div
          className="w-[220px] shrink-0 overflow-y-auto border-r p-4 pb-16"
          style={{ borderColor: aw.line }}
        >
          <Link
            to="/missions"
            className="mb-3 inline-flex items-center gap-1 aw-micro text-[8px] transition-colors hover:text-[var(--color-aw-text-strong)]"
            style={{ color: aw.textSoft }}
          >
            <ArrowLeft className="h-3 w-3" />
            Missions
          </Link>

          <div className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
            {mission.id}
          </div>
          <div className="aw-section mt-1 text-[10px]" style={{ color: aw.textStrong }}>
            {mission.title}
          </div>
          <div className="aw-body mt-2 text-[8px]" style={{ color: aw.text }}>
            {mission.goal}
          </div>

          <div className="mt-4 border-t pt-3" style={{ borderColor: aw.lineFaint }}>
            <div className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
              SCOPE
            </div>
            <div className="aw-body mt-1 text-[8px]" style={{ color: aw.text }}>
              {mission.scopeBoundary}
            </div>
          </div>

          <div className="mt-4 border-t pt-3" style={{ borderColor: aw.lineFaint }}>
            <div className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
              ACCEPTANCE CRITERIA
            </div>
            <ul className="mt-1 space-y-1">
              {mission.acceptanceCriteria.map((c, i) => (
                <li key={i} className="aw-body text-[8px]" style={{ color: aw.text }}>
                  &bull; {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center: live work surface */}
        <div className="flex-1 overflow-y-auto p-5 pb-16">
          <MissionHeader mission={mission} />

          {/* Agent swimlanes */}
          <div className="mt-5">
            <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
              AGENT SESSIONS ({mAgentSessions.length})
            </div>
            <div className="mt-2 space-y-3">
              {mAgentSessions.map((s) => (
                <AgentSwimlane key={s.id} session={s} />
              ))}
            </div>
          </div>

          {/* Browser & terminal sessions */}
          {(mBrowserSessions.length > 0 || mTerminalSessions.length > 0) && (
            <div className="mt-5">
              <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
                SESSIONS
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {mBrowserSessions.map((s) => (
                  <BrowserSessionPane key={s.id} session={s} />
                ))}
                {mTerminalSessions.map((s) => (
                  <TerminalSessionPane key={s.id} session={s} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: verification/evidence rail */}
        <div
          className="w-[260px] shrink-0 overflow-y-auto border-l p-4 pb-16"
          style={{ borderColor: aw.line }}
        >
          <EvidenceRail items={mEvidence} />
        </div>
      </div>
    </>
  );
}
