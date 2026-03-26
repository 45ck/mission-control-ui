import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Settings, Eye, Monitor } from 'lucide-react';
import { missions } from '../data/missions';
import { workflows } from '../data/workflows';
import { agentSessions } from '../data/agent-sessions';
import { browserSessions } from '../data/browser-sessions';
import { terminalSessions } from '../data/terminal-sessions';
import { evidence } from '../data/evidence';
import { fileTrees, codeFiles } from '../data/code-files';
import { aw, semantic } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { MissionHeader } from '../components/mission/MissionHeader';
import { AgentSwimlane } from '../components/execute/AgentSwimlane';
import { AgentChatPanel } from '../components/execute/AgentChatPanel';
import { AgentConfigPanel } from '../components/execute/AgentConfigPanel';
import { BrowserSessionPane, TerminalSessionPane } from '../components/execute/SessionPane';
import { EvidenceRail } from '../components/evidence/EvidenceRail';
import { CodeViewer } from '../components/workspace/CodeViewer';
import { PageTransition } from '../components/shell/PageTransition';
import { StageTabBar } from '../components/mission/StageTabBar';
import { useRecentMissions } from '../hooks/useRecentMissions';
import { LivePreview } from '../components/execute/LivePreview';

export function MissionExecute() {
  const { missionId, workflowId } = useParams<{ missionId: string; workflowId?: string }>();
  const mission = missions.find((m) => m.id === missionId);
  const workflow = workflowId ? workflows.find((w) => w.id === workflowId) : undefined;
  const [viewMode, setViewMode] = useState<'overview' | 'chat'>('overview');
  const [showConfig, setShowConfig] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { trackVisit } = useRecentMissions();
  useEffect(() => {
    if (missionId) trackVisit(missionId);
  }, [missionId, trackVisit]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setShowPreview((prev) => !prev);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!mission) {
    return (
      <PageTransition>
        <TopBar
          breadcrumbs={[
            { label: 'Missions', to: '/missions' },
            { label: missionId ?? 'Unknown' },
            { label: 'Execute' },
          ]}
        />
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <span className="aw-section" style={{ color: aw.textSoft }}>
            Mission not found
          </span>
          <Link
            to="/missions"
            className="aw-focus-ring inline-flex items-center gap-1 aw-micro transition-colors hover:text-[var(--color-aw-text-strong)]"
            style={{ color: aw.textSoft }}
          >
            Back to missions
          </Link>
        </div>
      </PageTransition>
    );
  }

  const mAgentSessions = agentSessions.filter((s) => s.missionId === mission.id);
  const mBrowserSessions = browserSessions.filter((s) => s.missionId === mission.id);
  const mTerminalSessions = terminalSessions.filter((s) => s.missionId === mission.id);
  const mEvidence = evidence.filter((e) => e.missionId === mission.id);

  const mFileTree = fileTrees[mission.id];
  const activeAgentCount = mAgentSessions.filter((s) => s.status === 'active').length;
  const activeTerminal = mTerminalSessions.find((s) => s.status === 'active');

  return (
    <PageTransition>
      <TopBar
        missionId={mission.id}
        currentStage="execute"
        breadcrumbs={
          workflow
            ? [
                { label: 'Workflows', to: '/workflows' },
                { label: workflow.title, to: `/workflows/${workflow.id}` },
                { label: mission.title, to: `/workflows/${workflowId}/missions/${missionId}` },
                { label: 'Execute' },
              ]
            : [
                { label: 'Missions', to: '/missions' },
                { label: mission.title, to: `/missions/${missionId}` },
                { label: 'Execute' },
              ]
        }
      />

      <StageTabBar missionId={mission.id} workflowId={workflowId} currentStage="execute" />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: mini mission context */}
        <div
          className="w-[260px] shrink-0 overflow-y-auto border-r p-5 pb-16"
          style={{ borderColor: aw.line }}
        >
          <Link
            to={
              workflowId
                ? `/workflows/${workflowId}/missions/${missionId}`
                : `/missions/${missionId}`
            }
            className="aw-focus-ring mb-3 inline-flex items-center gap-1 aw-micro transition-colors hover:text-[var(--color-aw-text-strong)]"
            style={{ color: aw.textSoft }}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to mission
          </Link>

          <div className="aw-micro" style={{ color: aw.textSoft }}>
            {mission.id}
          </div>
          <div className="aw-section mt-1" style={{ color: aw.textStrong }}>
            {mission.title}
          </div>
          <div className="aw-body-sm mt-2" style={{ color: aw.text }}>
            {mission.goal}
          </div>

          {mission.branch && (
            <div className="mt-3">
              <span
                className="aw-micro inline-block rounded border px-2 py-0.5 font-mono"
                style={{ borderColor: aw.lineDark, color: aw.textSoft }}
              >
                {mission.branch}
              </span>
            </div>
          )}

          <div className="mt-4 border-t pt-3" style={{ borderColor: aw.lineFaint }}>
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              SCOPE
            </div>
            <div className="aw-body-sm mt-1" style={{ color: aw.text }}>
              {mission.scopeBoundary}
            </div>
          </div>

          <div className="mt-4 border-t pt-3" style={{ borderColor: aw.lineFaint }}>
            <div className="aw-micro" style={{ color: aw.textSoft }}>
              ACCEPTANCE CRITERIA
            </div>
            <ul className="mt-1 space-y-1">
              {mission.acceptanceCriteria.map((c, i) => (
                <li key={i} className="aw-body-sm" style={{ color: aw.text }}>
                  &bull; {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center: live work surface */}
        <div className="relative flex-1 overflow-y-auto p-6 pb-16">
          {/* View toggle row + Live View button */}
          <div className="mb-4 flex items-center gap-2">
            <button
              className="aw-focus-ring aw-section-sm rounded px-3 py-1.5"
              style={{
                backgroundColor: viewMode === 'overview' ? aw.plate : 'transparent',
                color: viewMode === 'overview' ? aw.inverse : aw.textSoft,
              }}
              onClick={() => setViewMode('overview')}
            >
              OVERVIEW
            </button>
            <button
              className="aw-focus-ring aw-section-sm rounded px-3 py-1.5"
              style={{
                backgroundColor: viewMode === 'chat' ? aw.plate : 'transparent',
                color: viewMode === 'chat' ? aw.inverse : aw.textSoft,
              }}
              onClick={() => setViewMode('chat')}
            >
              CHAT
            </button>

            <Link
              to={
                workflowId
                  ? `/workflows/${workflowId}/missions/${mission.id}/live`
                  : `/missions/${mission.id}/live`
              }
              className="aw-section-sm aw-focus-ring ml-auto inline-flex items-center gap-1.5 rounded border px-3 py-1.5 transition-colors hover:bg-[var(--color-aw-haze)]"
              style={{ borderColor: aw.accent, color: aw.accent }}
            >
              <Eye className="h-3.5 w-3.5" />
              ENTER LIVE VIEW
            </Link>
            <button
              className="aw-focus-ring aw-section-sm inline-flex items-center gap-1.5 rounded border px-3 py-1.5 transition-colors hover:bg-[var(--color-aw-haze)]"
              style={{
                borderColor: showPreview ? aw.accentStrong : aw.lineDark,
                color: showPreview ? aw.accentStrong : aw.textSoft,
              }}
              onClick={() => setShowPreview((prev) => !prev)}
              aria-label="Toggle inline preview"
            >
              <Monitor className="h-3.5 w-3.5" />
              INLINE PREVIEW
            </button>
            <button
              className="aw-focus-ring rounded p-1.5"
              onClick={() => setShowConfig(true)}
              title="Configure Agent"
            >
              <Settings className="h-4 w-4" style={{ color: aw.textSoft }} />
            </button>
          </div>

          <MissionHeader mission={mission} />

          {viewMode === 'overview' ? (
            <>
              {/* Agent swimlanes */}
              <div className="mt-6">
                <div className="aw-micro" style={{ color: aw.textSoft }}>
                  AGENT SESSIONS ({mAgentSessions.length})
                </div>
                <div className="mt-3 space-y-4">
                  {mAgentSessions.map((s) => (
                    <AgentSwimlane key={s.id} session={s} />
                  ))}
                </div>
              </div>

              {/* Execute peek: agent log + code preview */}
              <div className="mt-6">
                <div className="aw-micro mb-3" style={{ color: aw.textSoft }}>
                  EXECUTE PREVIEW
                </div>
                <div
                  className="grid gap-px overflow-hidden rounded border"
                  style={{
                    gridTemplateColumns: '1fr 1fr',
                    borderColor: aw.lineDark,
                    height: '320px',
                  }}
                >
                  {/* Left: condensed agent log */}
                  <div className="overflow-y-auto p-3" style={{ backgroundColor: aw.haze }}>
                    <div className="aw-micro mb-2" style={{ color: aw.textSoft }}>
                      AGENT LOG
                    </div>
                    {mAgentSessions.length > 0 ? (
                      <div className="space-y-1.5">
                        {mAgentSessions
                          .flatMap((s) =>
                            s.steps.slice(-8).map((step) => ({
                              ...step,
                              sessionId: s.id,
                            })),
                          )
                          .map((step, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span
                                className="aw-micro shrink-0 font-mono"
                                style={{ color: aw.textSoft }}
                              >
                                {step.timestamp.split('T')[1]?.slice(0, 5)}
                              </span>
                              <span className="aw-body-sm" style={{ color: aw.text }}>
                                {step.action}: {step.detail}
                              </span>
                              {step.status === 'completed' && (
                                <span className="aw-micro" style={{ color: semantic.success }}>
                                  ✓
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="aw-body-sm" style={{ color: aw.textSoft }}>
                        No agent activity yet
                      </div>
                    )}
                  </div>

                  {/* Right: code preview (read-only) */}
                  <div className="overflow-hidden" style={{ backgroundColor: aw.paperTop }}>
                    {mFileTree ? (
                      <CodeViewer
                        files={codeFiles.filter((f) => f.path.startsWith('src/'))}
                        activeFile={codeFiles.find((f) => f.path.startsWith('src/'))?.path ?? ''}
                        openFiles={codeFiles
                          .filter((f) => f.path.startsWith('src/'))
                          .slice(0, 2)
                          .map((f) => f.path)}
                        onTabClose={() => undefined}
                        onTabSelect={() => undefined}
                      />
                    ) : (
                      <div
                        className="flex h-full items-center justify-center"
                        style={{ color: aw.textSoft }}
                      >
                        <span className="aw-body-sm">No code files</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status summary under peek */}
                <div className="mt-2 flex items-center gap-4">
                  <span className="aw-micro" style={{ color: aw.textSoft }}>
                    Evidence: {mEvidence.filter((e) => e.status === 'pass').length} passing
                  </span>
                  {activeTerminal && (
                    <span className="aw-micro" style={{ color: semantic.success }}>
                      Terminal: active
                    </span>
                  )}
                  {activeAgentCount > 0 && (
                    <span className="aw-micro" style={{ color: semantic.success }}>
                      {activeAgentCount} agent{activeAgentCount !== 1 ? 's' : ''} running
                    </span>
                  )}
                </div>
              </div>

              {/* Browser & terminal sessions */}
              {(mBrowserSessions.length > 0 || mTerminalSessions.length > 0) && (
                <div className="mt-6">
                  <div className="aw-micro" style={{ color: aw.textSoft }}>
                    SESSIONS
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    {mBrowserSessions.map((s) => (
                      <BrowserSessionPane key={s.id} session={s} />
                    ))}
                    {mTerminalSessions.map((s) => (
                      <TerminalSessionPane key={s.id} session={s} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mt-6" style={{ height: 'calc(100vh - 280px)' }}>
              <AgentChatPanel sessions={mAgentSessions} />
            </div>
          )}

          {showPreview && (
            <LivePreview missionId={mission.id} onClose={() => setShowPreview(false)} />
          )}

          {showConfig && <AgentConfigPanel onClose={() => setShowConfig(false)} />}
        </div>

        {/* Right: verification/evidence rail */}
        <div
          className="w-[260px] shrink-0 overflow-y-auto border-l p-4 pb-16"
          style={{ borderColor: aw.line }}
        >
          <EvidenceRail items={mEvidence} />
        </div>
      </div>
    </PageTransition>
  );
}
