import { Globe, Terminal } from 'lucide-react';
import type { BrowserSession } from '../../data/browser-sessions';
import type { TerminalSession } from '../../data/terminal-sessions';
import { aw } from '../../theme/tokens';
import { PanelPins } from '../primitives/PanelPins';

export function BrowserSessionPane({ session }: { session: BrowserSession }) {
  return (
    <div className="relative border p-3" style={{ borderColor: aw.lineDark }}>
      <PanelPins />
      <div className="flex items-center gap-2">
        <Globe className="h-[12px] w-[12px]" style={{ color: aw.textSoft }} />
        <span className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
          BROWSER // {session.status.toUpperCase()}
        </span>
      </div>
      <div className="mt-1 font-mono text-[8px]" style={{ color: aw.text }}>
        {session.url}
      </div>
      <div className="aw-body mt-2 text-[8px]" style={{ color: aw.text }}>
        {session.semanticSummary}
      </div>
      {/* Placeholder for screenshot */}
      <div
        className="mt-2 flex h-[80px] items-center justify-center border"
        style={{
          borderColor: aw.lineFaint,
          backgroundColor: aw.map,
        }}
      >
        <span className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
          {session.screenshotPlaceholder}
        </span>
      </div>
    </div>
  );
}

export function TerminalSessionPane({ session }: { session: TerminalSession }) {
  return (
    <div className="relative border p-3" style={{ borderColor: aw.lineDark }}>
      <PanelPins />
      <div className="flex items-center gap-2">
        <Terminal className="h-[12px] w-[12px]" style={{ color: aw.textSoft }} />
        <span className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
          TERMINAL // {session.status.toUpperCase()}
        </span>
      </div>
      <div className="mt-1 font-mono text-[8px]" style={{ color: aw.text }}>
        $ {session.command}
      </div>
      <div className="aw-body mt-2 text-[8px]" style={{ color: aw.text }}>
        {session.semanticSummary}
      </div>
      <pre
        className="mt-2 overflow-auto border p-2 text-[7px] leading-relaxed"
        style={{
          borderColor: aw.lineFaint,
          backgroundColor: aw.plateDark,
          color: aw.inverse,
          fontFamily: 'monospace',
        }}
      >
        {session.outputPreview}
      </pre>
    </div>
  );
}
