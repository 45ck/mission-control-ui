import { useEffect, useRef, useState } from 'react';
import { Copy } from 'lucide-react';
import type { TerminalSession } from '../../data/terminal-sessions';
import { aw, semantic } from '../../theme/tokens';
import { PanelPins } from '../primitives/PanelPins';

const statusColor: Record<TerminalSession['status'], string> = {
  active: semantic.success,
  completed: aw.textSoft,
  failed: semantic.error,
};

function useStreamingLines(output: string, streaming: boolean) {
  const allLines = output.split('\n');
  const [visibleCount, setVisibleCount] = useState(streaming ? 0 : allLines.length);

  useEffect(() => {
    if (!streaming) {
      setVisibleCount(allLines.length);
      return;
    }
    setVisibleCount(0);
    const timer = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= allLines.length) {
          clearInterval(timer);
          return c;
        }
        return c + 1;
      });
    }, 80);
    return () => clearInterval(timer);
  }, [streaming, allLines.length]);

  return { lines: allLines.slice(0, visibleCount), done: visibleCount >= allLines.length };
}

export function TerminalEmulator({
  session,
  streaming = false,
}: {
  session: TerminalSession;
  streaming?: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { lines, done } = useStreamingLines(session.outputPreview, streaming);

  useEffect(() => {
    scrollRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
  }, [lines.length]);

  return (
    <div className="relative flex h-full flex-col" style={{ backgroundColor: aw.plateDark }}>
      <PanelPins corners="top" />
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-4 py-2" style={{ borderColor: aw.plate }}>
        <span className="aw-micro" style={{ color: aw.textSoft }}>
          TERMINAL
        </span>
        <span
          className="h-[6px] w-[6px] rounded-full"
          style={{ backgroundColor: statusColor[session.status] }}
        />
        <button
          className="aw-focus-ring ml-auto rounded p-1"
          style={{ color: aw.textSoft }}
          aria-label="Copy output"
          onClick={() => void navigator.clipboard.writeText(session.outputPreview)}
        >
          <Copy size={12} />
        </button>
      </div>
      {/* Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 font-mono text-[12px] leading-5"
      >
        <div style={{ color: semantic.success }}>$ {session.command}</div>
        {lines.map((line, i) => (
          <div key={i} style={{ color: aw.inverse }}>
            {line}
          </div>
        ))}
        {streaming && !done && (
          <span className="animate-pulse" style={{ color: aw.inverse }}>
            _
          </span>
        )}
      </div>
    </div>
  );
}
