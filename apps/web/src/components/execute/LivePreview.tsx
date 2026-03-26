import { X } from 'lucide-react';
import { agentSessions } from '../../data/agent-sessions';
import { terminalSessions } from '../../data/terminal-sessions';
import { agentMessages } from '../../data/agent-chat';
import { aw } from '../../theme/tokens';

export interface LivePreviewProps {
  missionId: string;
  onClose: () => void;
}

export function LivePreview({ missionId, onClose }: LivePreviewProps) {
  const mTerminalSessions = terminalSessions.filter((s) => s.missionId === missionId);
  const mAgentSessions = agentSessions.filter((s) => s.missionId === missionId);
  const sessionIds = new Set(mAgentSessions.map((s) => s.id));
  const mMessages = agentMessages.filter((m) => sessionIds.has(m.sessionId)).slice(-10);

  return (
    <div
      className="mt-4 overflow-hidden rounded border"
      style={{ borderColor: aw.lineDark, backgroundColor: aw.haze }}
      data-testid="live-preview-panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b px-4 py-2"
        style={{ borderColor: aw.lineFaint, backgroundColor: aw.paperTop }}
      >
        <div className="flex items-center gap-2">
          <span className="aw-section-sm" style={{ color: aw.textStrong }}>
            LIVE PREVIEW
          </span>
          <span className="aw-micro" style={{ color: aw.textSoft }}>
            {'\u2318\u21E7L'}
          </span>
        </div>
        <button
          className="aw-focus-ring rounded p-1 transition-colors hover:bg-[var(--color-aw-line-faint)]"
          onClick={onClose}
          aria-label="Close live preview"
        >
          <X className="h-4 w-4" style={{ color: aw.textSoft }} />
        </button>
      </div>

      {/* Body: two-column layout */}
      <div className="grid grid-cols-2 gap-px" style={{ height: '280px' }}>
        {/* Terminal output */}
        <div className="overflow-y-auto p-3">
          <div className="aw-micro mb-2" style={{ color: aw.textSoft }}>
            TERMINAL
          </div>
          {mTerminalSessions.length > 0 ? (
            <div className="space-y-2">
              {mTerminalSessions.map((ts) => (
                <div key={ts.id}>
                  <div className="aw-micro mb-1 font-mono" style={{ color: aw.textStrong }}>
                    $ {ts.command}
                  </div>
                  <pre
                    className="whitespace-pre-wrap rounded p-2 font-mono text-xs"
                    style={{
                      backgroundColor: aw.paperTop,
                      color: aw.text,
                    }}
                  >
                    {ts.outputPreview}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="aw-body-sm" style={{ color: aw.textSoft }}>
              No terminal sessions
            </div>
          )}
        </div>

        {/* Agent chat messages */}
        <div className="overflow-y-auto border-l p-3" style={{ borderColor: aw.lineFaint }}>
          <div className="aw-micro mb-2" style={{ color: aw.textSoft }}>
            AGENT CHAT
          </div>
          {mMessages.length > 0 ? (
            <div className="space-y-1.5">
              {mMessages.map((msg) => (
                <div key={msg.id} data-testid="chat-message">
                  <span className="aw-micro mr-1 font-mono" style={{ color: aw.textSoft }}>
                    {msg.role}
                  </span>
                  <span className="aw-body-sm" style={{ color: aw.text }}>
                    {msg.content.length > 120 ? msg.content.slice(0, 120) + '...' : msg.content}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="aw-body-sm" style={{ color: aw.textSoft }}>
              No agent messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
