import { useState } from 'react';
import type { Workspace } from '../../data/workspaces';
import type { FileTreeNode, CodeFile } from '../../data/code-files';
import type { BrowserSession } from '../../data/browser-sessions';
import type { TerminalSession } from '../../data/terminal-sessions';
import type { AgentSession } from '../../data/agent-sessions';
import { aw } from '../../theme/tokens';
import { FileTree } from './FileTree';
import { CodeViewer } from './CodeViewer';
import { BrowserPreview } from './BrowserPreview';
import { TerminalEmulator } from './TerminalEmulator';
import { AgentChatPanel } from '../execute/AgentChatPanel';

interface WorkspaceLayoutProps {
  workspace: Workspace;
  fileTree: FileTreeNode[];
  codeFiles: CodeFile[];
  browserSession?: BrowserSession;
  terminalSession?: TerminalSession;
  agentSessions: AgentSession[];
}

export function WorkspaceLayout({
  workspace,
  fileTree,
  codeFiles,
  browserSession,
  terminalSession,
  agentSessions,
}: WorkspaceLayoutProps) {
  const [activeFile, setActiveFile] = useState(workspace.activeFile);
  const [openFiles, setOpenFiles] = useState<string[]>(workspace.openFiles);

  const handleFileSelect = (path: string) => {
    setActiveFile(path);
    if (!openFiles.includes(path)) setOpenFiles((prev) => [...prev, path]);
  };

  const handleTabClose = (path: string) => {
    const next = openFiles.filter((f) => f !== path);
    setOpenFiles(next);
    if (activeFile === path) setActiveFile(next[0] ?? '');
  };

  const border = `1px solid ${aw.lineDark}`;

  return (
    <div
      className="grid h-full w-full"
      style={{
        gridTemplateColumns: '200px 1fr 380px',
        gridTemplateRows: '1fr 280px',
      }}
    >
      <div className="overflow-hidden" style={{ gridRow: '1 / 3', borderRight: border }}>
        <FileTree tree={fileTree} activeFile={activeFile} onFileSelect={handleFileSelect} />
      </div>
      <div className="overflow-hidden" style={{ borderRight: border, borderBottom: border }}>
        <CodeViewer
          files={codeFiles}
          activeFile={activeFile}
          openFiles={openFiles}
          onTabClose={handleTabClose}
          onTabSelect={setActiveFile}
        />
      </div>
      <div className="overflow-hidden" style={{ borderBottom: border }}>
        {browserSession ? <BrowserPreview session={browserSession} /> : null}
      </div>
      <div className="overflow-hidden" style={{ borderRight: border }}>
        {terminalSession ? <TerminalEmulator session={terminalSession} /> : null}
      </div>
      <div className="overflow-hidden">
        <AgentChatPanel sessions={agentSessions} />
      </div>
    </div>
  );
}
