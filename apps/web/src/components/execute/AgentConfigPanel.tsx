import { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { aw } from '../../theme/tokens';
import { CornerBracket } from '../primitives/CornerBracket';
import { PanelPins } from '../primitives/PanelPins';

const models = ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5'] as const;

const defaultTools: Record<string, boolean> = {
  file_read: true,
  file_write: true,
  terminal: true,
  browser: false,
  git: true,
};

const systemPrompt =
  'You are an implementation agent. Follow the mission plan strictly. Report evidence for all changes. Escalate ambiguous requirements.';

export function AgentConfigPanel({ onClose }: { onClose?: () => void }) {
  const [model, setModel] = useState<string>(models[0]);
  const [enabledTools, setEnabledTools] = useState<Record<string, boolean>>(defaultTools);
  const [maxTokens, setMaxTokens] = useState(100000);
  const [timeoutSec, setTimeoutSec] = useState(300);
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    if (!onClose) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  function toggleTool(tool: string) {
    setEnabledTools((prev) => ({ ...prev, [tool]: !prev[tool] }));
  }

  return (
    <div
      className="absolute inset-y-0 right-0 z-30 flex w-[340px] flex-col border-l shadow-lg"
      style={{ borderColor: aw.lineDark, backgroundColor: aw.paperTop }}
    >
      <CornerBracket side="left" />
      <PanelPins corners="all" />

      <div
        className="flex items-center justify-between border-b px-5 py-3"
        style={{ borderColor: aw.line }}
      >
        <span className="aw-section" style={{ color: aw.textStrong }}>
          AGENT CONFIG
        </span>
        {onClose && (
          <button className="aw-focus-ring p-1" style={{ color: aw.textSoft }} onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {/* Model selector */}
        <div>
          <label className="aw-section" style={{ color: aw.textStrong }}>
            MODEL
          </label>
          <select
            className="aw-focus-ring aw-body mt-1.5 w-full border px-3 py-2"
            style={{
              borderColor: aw.line,
              backgroundColor: aw.paperTop,
              color: aw.text,
            }}
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <div className="aw-body-sm mt-1" style={{ color: aw.textSoft }}>
            LLM used for agent reasoning and tool calls
          </div>
        </div>

        {/* Tool toggles */}
        <div>
          <div className="aw-section" style={{ color: aw.textStrong }}>
            TOOLS
          </div>
          <div className="mt-1.5 space-y-2">
            {Object.keys(defaultTools).map((tool) => (
              <label
                key={tool}
                className="aw-body flex items-center gap-2"
                style={{ color: aw.text }}
              >
                <input
                  type="checkbox"
                  className="aw-focus-ring"
                  checked={enabledTools[tool] ?? false}
                  onChange={() => toggleTool(tool)}
                />
                {tool}
              </label>
            ))}
          </div>
          <div className="aw-body-sm mt-1" style={{ color: aw.textSoft }}>
            Capabilities the agent can use during execution
          </div>
        </div>

        {/* System prompt preview */}
        <div>
          <div className="aw-section" style={{ color: aw.textStrong }}>
            SYSTEM PROMPT
          </div>
          <textarea
            className="aw-focus-ring aw-body mt-1.5 w-full resize-none border px-3 py-2"
            style={{
              borderColor: aw.line,
              backgroundColor: aw.haze,
              color: aw.text,
            }}
            rows={4}
            readOnly
            value={systemPrompt}
          />
          <div className="aw-body-sm mt-1" style={{ color: aw.textSoft }}>
            Base instructions prepended to every agent turn
          </div>
        </div>

        {/* Max tokens slider */}
        <div>
          <div className="aw-section" style={{ color: aw.textStrong }}>
            MAX TOKENS
          </div>
          <div className="mt-1.5 flex items-center gap-3">
            <input
              type="range"
              className="aw-focus-ring flex-1"
              min={1000}
              max={200000}
              step={1000}
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
            />
            <span className="aw-body" style={{ color: aw.text, minWidth: 60, textAlign: 'right' }}>
              {maxTokens.toLocaleString()}
            </span>
          </div>
          <div className="aw-body-sm mt-1" style={{ color: aw.textSoft }}>
            Maximum output tokens per agent response
          </div>
        </div>

        {/* Timeout slider */}
        <div>
          <div className="aw-section" style={{ color: aw.textStrong }}>
            TIMEOUT
          </div>
          <div className="mt-1.5 flex items-center gap-3">
            <input
              type="range"
              className="aw-focus-ring flex-1"
              min={30}
              max={600}
              step={30}
              value={timeoutSec}
              onChange={(e) => setTimeoutSec(Number(e.target.value))}
            />
            <span className="aw-body" style={{ color: aw.text, minWidth: 40, textAlign: 'right' }}>
              {timeoutSec}s
            </span>
          </div>
          <div className="aw-body-sm mt-1" style={{ color: aw.textSoft }}>
            Max seconds before the agent session is terminated
          </div>
        </div>
      </div>

      {/* Sticky launch footer */}
      <div className="border-t p-4" style={{ borderColor: aw.line }}>
        <button
          className="aw-focus-ring aw-section flex w-full items-center justify-center gap-2 border px-4 py-2.5 transition-colors"
          style={{
            backgroundColor: launched ? aw.haze : aw.accent,
            color: launched ? aw.textStrong : aw.inverse,
            borderColor: launched ? aw.lineDark : aw.accent,
          }}
          disabled={launched}
          onClick={() => setLaunched(true)}
        >
          {launched && <CheckCircle className="h-4 w-4" style={{ color: aw.textStrong }} />}
          {launched ? 'AGENT LAUNCHED' : 'LAUNCH AGENT'}
        </button>
      </div>
    </div>
  );
}
