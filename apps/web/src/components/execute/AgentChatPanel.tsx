import { useState, useEffect, useRef, useCallback } from 'react';
import { Pause, Play, Square, RotateCcw } from 'lucide-react';
import type { AgentSession } from '../../data/agent-sessions';
import type { AgentMessage } from '../../data/agent-chat';
import { agentMessages } from '../../data/agent-chat';
import { aw, semantic } from '../../theme/tokens';
import { useStreamingText } from '../../hooks/useStreamingText';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const statusDot: Record<string, string> = {
  active: semantic.success,
  paused: semantic.warning,
  completed: aw.textSoft,
  failed: aw.accentStrong,
};

const CANNED_RESPONSES: string[] = [
  "I've analyzed the codebase and identified 3 key areas that need modification. Let me start with the core module updates.",
  "Looking at the test results, the implementation is working correctly for the main flow. I'll now handle the edge cases.",
  "I've completed the file modifications. Running the test suite now to verify there are no regressions.",
  "The changes are compatible with the existing API contract. I'll proceed with updating the documentation and adding integration tests.",
  'I found a potential issue with the current approach. Let me propose an alternative implementation that handles the edge case better.',
];

interface LocalMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
}

/* ------------------------------------------------------------------ */
/*  TypingIndicator                                                    */
/* ------------------------------------------------------------------ */

function TypingIndicator() {
  return (
    <div className="mr-auto max-w-[80%]">
      <div
        className="inline-flex items-center gap-1 rounded border px-3 py-2"
        style={{ backgroundColor: aw.paperTop, borderColor: aw.lineFaint }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block h-[6px] w-[6px] rounded-full"
            style={{
              backgroundColor: aw.textSoft,
              animation: `typing-dot 1.2s ${i * 0.2}s infinite ease-in-out`,
            }}
          />
        ))}
        <style>{`
          @keyframes typing-dot {
            0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
            30% { opacity: 1; transform: translateY(-3px); }
          }
        `}</style>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  StreamingMessage                                                    */
/* ------------------------------------------------------------------ */

function StreamingMessage({ fullText, onComplete }: { fullText: string; onComplete: () => void }) {
  const { text, isStreaming, start } = useStreamingText(fullText, 3, 30);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      start();
    }
  }, [start]);

  useEffect(() => {
    if (!isStreaming && text.length === fullText.length && text.length > 0) {
      onComplete();
    }
  }, [isStreaming, text.length, fullText.length, onComplete]);

  return (
    <div className="mr-auto max-w-[80%]">
      <div
        className="aw-body rounded border px-3 py-2"
        style={{
          backgroundColor: aw.paperTop,
          borderColor: aw.lineFaint,
          color: aw.text,
        }}
      >
        {text}
        {isStreaming && (
          <span
            className="ml-0.5 inline-block h-[14px] w-[2px] align-middle"
            style={{
              backgroundColor: aw.accent,
              animation: 'cursor-blink 0.8s step-end infinite',
            }}
          />
        )}
        <style>{`
          @keyframes cursor-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AgentControls                                                      */
/* ------------------------------------------------------------------ */

function AgentControls({
  isStreaming,
  streamedChars,
}: {
  isStreaming: boolean;
  streamedChars: number;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [stopConfirm, setStopConfirm] = useState(false);

  function handleStop() {
    if (stopConfirm) {
      setStopConfirm(false);
      return;
    }
    setStopConfirm(true);
  }

  const tokenEstimate = Math.floor(streamedChars / 4);
  const formattedTokens = tokenEstimate.toLocaleString();

  return (
    <div
      className="flex items-center gap-2 border-b px-4 py-1.5"
      style={{ borderColor: aw.lineFaint }}
    >
      <button
        className="aw-focus-ring rounded p-1 transition-colors"
        style={{ color: aw.textSoft }}
        onClick={() => setIsPaused((p) => !p)}
        title={isPaused ? 'Resume' : 'Pause'}
      >
        {isPaused ? <Play size={14} /> : <Pause size={14} />}
      </button>

      <button
        className="aw-focus-ring rounded p-1 transition-colors"
        style={{ color: stopConfirm ? aw.accentStrong : aw.textSoft }}
        onClick={handleStop}
        title="Stop"
      >
        {stopConfirm ? (
          <span className="aw-micro" style={{ color: aw.accentStrong }}>
            Confirm?
          </span>
        ) : (
          <Square size={14} />
        )}
      </button>

      <button
        className="aw-focus-ring rounded p-1 transition-colors"
        style={{ color: aw.textSoft }}
        title="Restart"
      >
        <RotateCcw size={14} />
      </button>

      {isStreaming && (
        <span className="aw-micro ml-auto" style={{ color: aw.textSoft }}>
          {formattedTokens} tokens
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ChatPlanProposal                                                   */
/* ------------------------------------------------------------------ */

function ChatPlanProposal({
  message,
  onApprove,
  onReject,
}: {
  message: { content: string; requiresApproval?: boolean };
  onApprove: () => void;
  onReject: () => void;
}) {
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);

  const steps = message.content
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  function handleApprove() {
    setDecision('approved');
    onApprove();
  }

  function handleReject() {
    setDecision('rejected');
    onReject();
  }

  return (
    <div className="w-full">
      <div
        className="rounded border px-4 py-3"
        style={{
          borderColor: aw.lineDark,
          backgroundColor: aw.paperTop,
        }}
      >
        <span className="aw-micro" style={{ color: aw.textStrong }}>
          PROPOSED PLAN
        </span>
        <ol className="mt-2 space-y-1">
          {steps.map((step, i) => (
            <li key={i} className="aw-body-sm" style={{ color: aw.text }}>
              {step}
            </li>
          ))}
        </ol>

        {message.requiresApproval && (
          <div className="mt-3 flex gap-2">
            <button
              className="aw-focus-ring aw-section-sm rounded px-3 py-1.5 transition-colors"
              style={{
                backgroundColor: decision ? aw.mapSoft : aw.accent,
                color: decision ? aw.textSoft : aw.inverse,
              }}
              disabled={decision !== null}
              onClick={handleApprove}
            >
              {decision === 'approved' ? 'APPROVED' : 'APPROVE'}
            </button>
            <button
              className="aw-focus-ring aw-section-sm rounded border px-3 py-1.5 transition-colors"
              style={{
                borderColor: decision ? aw.lineFaint : aw.line,
                color: decision ? aw.lineDark : aw.textSoft,
                backgroundColor: 'transparent',
              }}
              disabled={decision !== null}
              onClick={handleReject}
            >
              {decision === 'rejected' ? 'REJECTED' : 'REJECT'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ChatMessage                                                        */
/* ------------------------------------------------------------------ */

function ChatMessage({
  message,
  onPlanApprove,
  onPlanReject,
}: {
  message: {
    id: string;
    role: string;
    content: string;
    toolName?: string;
    toolInput?: string;
    timestamp: string;
    requiresApproval?: boolean;
  };
  onPlanApprove: () => void;
  onPlanReject: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (message.role === 'user') {
    return (
      <div className="ml-auto max-w-[70%]">
        <div
          className="aw-body rounded px-3 py-2"
          style={{
            backgroundColor: `rgba(${hexToRgb(aw.accentSoft)}, 0.2)`,
            color: aw.text,
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  if (message.role === 'agent') {
    return (
      <div className="mr-auto max-w-[80%]">
        <div
          className="aw-body rounded border px-3 py-2"
          style={{
            backgroundColor: aw.paperTop,
            borderColor: aw.lineFaint,
            color: aw.text,
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  if (message.role === 'plan-proposal') {
    return <ChatPlanProposal message={message} onApprove={onPlanApprove} onReject={onPlanReject} />;
  }

  if (message.role === 'tool-call') {
    return (
      <div className="w-full">
        <button
          className="aw-focus-ring w-full rounded text-left font-mono"
          style={{ backgroundColor: aw.plateDark, color: aw.inverse }}
          onClick={() => setExpanded((p) => !p)}
        >
          <div className="px-3 py-2">
            <span className="aw-micro">TOOL: {message.toolName}</span>
            <div className="aw-body-sm mt-0.5 opacity-70">{message.content}</div>
          </div>
          {expanded && message.toolInput && (
            <pre className="border-t px-3 py-2 text-[10px]" style={{ borderColor: aw.plate }}>
              {message.toolInput}
            </pre>
          )}
        </button>
      </div>
    );
  }

  if (message.role === 'tool-result') {
    return (
      <div className="w-full">
        <button
          className="aw-focus-ring w-full rounded text-left"
          style={{ backgroundColor: aw.plateDark, color: aw.inverse }}
          onClick={() => setExpanded((p) => !p)}
        >
          <div className="px-3 py-1.5">
            <span className="aw-micro">RESULT {expanded ? '[-]' : '[+]'}</span>
          </div>
          {expanded && (
            <pre
              className="max-h-[200px] overflow-auto border-t px-3 py-2 text-[10px]"
              style={{ borderColor: aw.plate }}
            >
              {message.content}
            </pre>
          )}
        </button>
      </div>
    );
  }

  // system
  return (
    <div className="text-center">
      <span className="aw-micro italic" style={{ color: aw.textSoft }}>
        {message.content}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AgentChatPanel (main export)                                       */
/* ------------------------------------------------------------------ */

export function AgentChatPanel({ sessions }: { sessions: AgentSession[] }) {
  const [activeSessionId, setActiveSessionId] = useState(sessions[0]?.id ?? '');
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState<string | null>(null);
  const [streamedChars, setStreamedChars] = useState(0);
  const cannedIndexRef = useRef(0);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charCountIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const sessionMessages = agentMessages.filter((m) => m.sessionId === activeSessionId);
  const allMessages: (AgentMessage | LocalMessage)[] = [
    ...sessionMessages,
    ...localMessages.filter((m) => m.id.startsWith(`local-${activeSessionId}`)),
  ];

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (charCountIntervalRef.current) clearInterval(charCountIntervalRef.current);
    };
  }, []);

  const addLocalMessage = useCallback(
    (role: 'user' | 'agent' | 'system', content: string) => {
      setLocalMessages((prev) => [
        ...prev,
        {
          id: `local-${activeSessionId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          role,
          content,
          timestamp: new Date().toISOString(),
        },
      ]);
    },
    [activeSessionId],
  );

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isTyping || streamingResponse !== null) return;

    addLocalMessage('user', trimmed);
    setInput('');

    // Start typing indicator
    setIsTyping(true);
    const idx = cannedIndexRef.current % CANNED_RESPONSES.length;
    const nextResponse = CANNED_RESPONSES[idx]!;
    cannedIndexRef.current += 1;

    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
      setStreamedChars(0);
      setStreamingResponse(nextResponse);

      // Track streamed character count for token counter
      let count = 0;
      charCountIntervalRef.current = setInterval(() => {
        count += 3;
        if (count >= nextResponse.length) {
          count = nextResponse.length;
          if (charCountIntervalRef.current) {
            clearInterval(charCountIntervalRef.current);
            charCountIntervalRef.current = null;
          }
        }
        setStreamedChars(count);
      }, 30);
    }, 1500);
  }

  const handleStreamComplete = useCallback(() => {
    if (streamingResponse === null) return;
    addLocalMessage('agent', streamingResponse);
    setStreamingResponse(null);
    setStreamedChars(0);
    if (charCountIntervalRef.current) {
      clearInterval(charCountIntervalRef.current);
      charCountIntervalRef.current = null;
    }
  }, [streamingResponse, addLocalMessage]);

  function handlePlanAction(approved: boolean) {
    const msg = approved
      ? 'Plan approved. Agent proceeding.'
      : 'Plan rejected. Agent awaiting revision.';
    addLocalMessage('system', msg);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Session tabs */}
      <SessionTabs
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelect={setActiveSessionId}
      />

      {/* Lifecycle controls toolbar */}
      <AgentControls isStreaming={streamingResponse !== null} streamedChars={streamedChars} />

      {/* Status bar */}
      {activeSession && (
        <StatusBar
          session={activeSession}
          toolNames={[
            ...new Set(
              sessionMessages
                .filter((m) => m.role === 'tool-call' && m.toolName)
                .map((m) => m.toolName!),
            ),
          ]}
        />
      )}

      {/* Message list */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {allMessages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onPlanApprove={() => handlePlanAction(true)}
            onPlanReject={() => handlePlanAction(false)}
          />
        ))}
        {isTyping && <TypingIndicator />}
        {streamingResponse !== null && (
          <StreamingMessage fullText={streamingResponse} onComplete={handleStreamComplete} />
        )}
      </div>

      {/* Input area */}
      <InputArea
        input={input}
        disabled={isTyping || streamingResponse !== null}
        onChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SessionTabs                                                        */
/* ------------------------------------------------------------------ */

function SessionTabs({
  sessions,
  activeSessionId,
  onSelect,
}: {
  sessions: AgentSession[];
  activeSessionId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 border-b px-4 py-2" style={{ borderColor: aw.lineFaint }}>
      {sessions.map((session) => (
        <button
          key={session.id}
          className="aw-focus-ring flex items-center gap-1.5 rounded px-3 py-1.5 transition-colors"
          style={{
            backgroundColor: session.id === activeSessionId ? aw.plate : 'transparent',
            color: session.id === activeSessionId ? aw.inverse : aw.textSoft,
          }}
          onClick={() => onSelect(session.id)}
        >
          <div
            className="h-[6px] w-[6px] rounded-full"
            style={{ backgroundColor: statusDot[session.status] }}
          />
          <span className="aw-section-sm">{session.role}</span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  StatusBar                                                          */
/* ------------------------------------------------------------------ */

function StatusBar({ session, toolNames }: { session: AgentSession; toolNames: string[] }) {
  return (
    <div
      className="flex flex-wrap items-center gap-2 border-b px-4 py-1.5"
      style={{ borderColor: aw.lineFaint }}
    >
      <div
        className="h-[5px] w-[5px] rounded-full"
        style={{ backgroundColor: statusDot[session.status] }}
      />
      <span className="aw-micro" style={{ color: aw.textSoft }}>
        {session.status.toUpperCase()}
      </span>
      <span className="aw-micro" style={{ color: aw.lineDark }}>
        //
      </span>
      <span className="aw-micro" style={{ color: aw.textSoft }}>
        {session.model}
      </span>
      <span className="aw-micro" style={{ color: aw.lineDark }}>
        //
      </span>
      <span className="aw-micro" style={{ color: aw.textSoft }}>
        {session.id}
      </span>
      {toolNames.length > 0 && (
        <>
          <span className="aw-micro" style={{ color: aw.lineDark }}>
            //
          </span>
          <span className="aw-micro" style={{ color: aw.textSoft }}>
            Tools: {toolNames.join(', ')}
          </span>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  InputArea                                                          */
/* ------------------------------------------------------------------ */

function InputArea({
  input,
  disabled,
  onChange,
  onSend,
}: {
  input: string;
  disabled: boolean;
  onChange: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="flex items-end gap-2 border-t px-4 py-3" style={{ borderColor: aw.lineFaint }}>
      <textarea
        className="aw-body aw-focus-ring flex-1 resize-none rounded border px-3 py-2"
        style={{
          borderColor: aw.line,
          backgroundColor: aw.paperTop,
          color: aw.text,
          opacity: disabled ? 0.6 : 1,
        }}
        placeholder="Message agent..."
        rows={2}
        value={input}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <button
        className="aw-focus-ring aw-section shrink-0 rounded px-4 py-2"
        style={{
          backgroundColor: disabled ? aw.lineDark : aw.accent,
          color: aw.inverse,
        }}
        disabled={disabled}
        onClick={onSend}
      >
        SEND
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Utility                                                            */
/* ------------------------------------------------------------------ */

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
