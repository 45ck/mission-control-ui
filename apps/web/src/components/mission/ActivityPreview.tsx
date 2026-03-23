import { Eye, GitBranch, CheckCircle } from 'lucide-react';
import { Link, useParams } from 'react-router';
import type { Mission } from '../../data/missions';
import { browserSessions } from '../../data/browser-sessions';
import { terminalSessions } from '../../data/terminal-sessions';
import { agentSessions } from '../../data/agent-sessions';
import { codeFiles } from '../../data/code-files';
import { workspaces } from '../../data/workspaces';
import { branches } from '../../data/branches';
import { aw, semantic } from '../../theme/tokens';
import { PanelPins } from '../primitives/PanelPins';
import { BrowserSessionPane } from '../execute/SessionPane';
import { TerminalSessionPane } from '../execute/SessionPane';
import { CodeViewer } from '../workspace/CodeViewer';
import { ArtifactPanel } from './ArtifactPanel';
import { artifacts } from '../../data/artifacts';
import { useState } from 'react';

interface ActivityPreviewProps {
  mission: Mission;
}

export function ActivityPreview({ mission }: ActivityPreviewProps) {
  const { workflowId } = useParams<{ workflowId?: string }>();

  const workspace = workspaces.find((w) => w.missionId === mission.id);
  const branch = branches.find((b) => b.missionId === mission.id);
  const missionBrowserSessions = browserSessions.filter((s) => s.missionId === mission.id);
  const missionTerminalSessions = terminalSessions.filter((s) => s.missionId === mission.id);
  const activeAgentCount = agentSessions.filter(
    (s) => s.missionId === mission.id && s.status === 'active',
  ).length;

  const hasBrowser = missionBrowserSessions.length > 0;
  const displayBrowser = missionBrowserSessions[0];
  const displayTerminals = missionTerminalSessions.slice(0, 2);

  // Code viewer state
  const initialActiveFile = workspace?.activeFile ?? '';
  const initialOpenFiles = workspace?.openFiles ?? [];
  const relevantCodeFiles = codeFiles.filter((f) => initialOpenFiles.includes(f.path));

  const [activeFile, setActiveFile] = useState(initialActiveFile);
  const [openFiles, setOpenFiles] = useState(initialOpenFiles);

  const isActive = mission.stage === 'execute';
  const isCompleted = mission.stage === 'completed' || mission.stage === 'review';

  const headerLabel = isActive ? 'LIVE ACTIVITY' : 'RESULT PREVIEW';

  // Extract test summary from terminal sessions for completed view
  const testSummary = missionTerminalSessions.find(
    (ts) => ts.command.includes('test') && ts.status === 'completed',
  );
  const testSummaryText = testSummary?.semanticSummary;

  const prefix = workflowId
    ? `/workflows/${workflowId}/missions/${mission.id}`
    : `/missions/${mission.id}`;

  return (
    <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
      <PanelPins corners="all" />

      {/* Header */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="aw-micro" style={{ color: aw.textSoft }}>
          {headerLabel}
        </span>
        {isActive && activeAgentCount > 0 && (
          <span
            className="aw-micro rounded-sm border px-1.5 py-0.5"
            style={{ borderColor: semantic.success, color: semantic.success }}
          >
            ● {activeAgentCount} agent{activeAgentCount !== 1 ? 's' : ''}
          </span>
        )}
        {branch && (
          <span
            className="aw-micro inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5"
            style={{ borderColor: aw.line, color: aw.text }}
          >
            <GitBranch size={10} />
            {branch.name}
          </span>
        )}
      </div>

      {/* 2-column grid: Browser + Code */}
      <div
        className="mt-3 grid gap-3"
        style={{ gridTemplateColumns: hasBrowser ? '1fr 1fr' : '1fr' }}
      >
        {hasBrowser && displayBrowser && <BrowserSessionPane session={displayBrowser} />}
        {relevantCodeFiles.length > 0 && (
          <div
            className="overflow-hidden border"
            style={{ borderColor: aw.lineDark, maxHeight: 260 }}
          >
            <CodeViewer
              files={relevantCodeFiles}
              activeFile={activeFile}
              openFiles={openFiles}
              onTabSelect={setActiveFile}
              onTabClose={(path) => {
                const next = openFiles.filter((f) => f !== path);
                setOpenFiles(next);
                if (activeFile === path && next.length > 0) {
                  setActiveFile(next[0]!);
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Terminal row */}
      {displayTerminals.length > 0 && (
        <div
          className="mt-3 grid gap-3"
          style={{ gridTemplateColumns: displayTerminals.length > 1 ? '1fr 1fr' : '1fr' }}
        >
          {displayTerminals.map((ts) => (
            <TerminalSessionPane key={ts.id} session={ts} />
          ))}
        </div>
      )}

      {/* Completed summary bar */}
      {isCompleted && (testSummaryText ?? branch) && (
        <div
          className="mt-3 flex flex-wrap items-center gap-4 border-t pt-3"
          style={{ borderColor: aw.lineFaint }}
        >
          {testSummaryText && (
            <span
              className="aw-micro inline-flex items-center gap-1.5"
              style={{ color: semantic.success }}
            >
              <CheckCircle size={12} />
              {testSummaryText}
            </span>
          )}
          {branch && branch.aheadBy > 0 && (
            <span className="aw-micro" style={{ color: aw.text }}>
              {branch.aheadBy} commit{branch.aheadBy !== 1 ? 's' : ''} ahead of {branch.baseBranch}
            </span>
          )}
        </div>
      )}

      {/* Artifacts (review/completed stages only) */}
      {isCompleted &&
        (() => {
          const missionArtifacts = artifacts.filter((a) => a.missionId === mission.id);
          return missionArtifacts.length > 0 ? (
            <ArtifactPanel artifacts={missionArtifacts} />
          ) : null;
        })()}

      {/* Live View link (only for active stages) */}
      {isActive && (
        <Link
          to={`${prefix}/live`}
          className="aw-section aw-focus-ring mt-3 inline-flex items-center gap-2 border px-4 py-2.5 transition-colors hover:bg-[var(--color-aw-haze)]"
          style={{ borderColor: aw.accent, color: aw.accent }}
        >
          <Eye className="h-4 w-4" />
          ENTER LIVE VIEW
        </Link>
      )}
    </div>
  );
}
