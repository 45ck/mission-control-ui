import { Globe, Terminal } from 'lucide-react';
import type { BrowserSession } from '../../data/browser-sessions';
import type { TerminalSession } from '../../data/terminal-sessions';
import { aw } from '../../theme/tokens';
import { PanelPins } from '../primitives/PanelPins';

export function BrowserSessionPane({ session }: { session: BrowserSession }) {
  return (
    <div className="relative border p-4" style={{ borderColor: aw.lineDark }}>
      <PanelPins />
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4" style={{ color: aw.textSoft }} />
        <span className="aw-micro" style={{ color: aw.textSoft }}>
          BROWSER // {session.status.toUpperCase()}
        </span>
      </div>
      <div className="mt-1.5 font-mono text-[10px]" style={{ color: aw.text }}>
        {session.url}
      </div>
      <div className="aw-body-sm mt-2" style={{ color: aw.text }}>
        {session.semanticSummary}
      </div>
      {/* Fake browser chrome */}
      <div className="mt-3 overflow-hidden border" style={{ borderColor: aw.lineFaint }}>
        {/* Browser toolbar */}
        <div
          className="flex items-center gap-2 border-b px-3 py-1.5"
          style={{ borderColor: aw.lineFaint, backgroundColor: aw.haze }}
        >
          <div className="flex gap-1">
            <div
              className="h-[6px] w-[6px] rounded-full"
              style={{ backgroundColor: aw.lineDark }}
            />
            <div
              className="h-[6px] w-[6px] rounded-full"
              style={{ backgroundColor: aw.lineDark }}
            />
            <div
              className="h-[6px] w-[6px] rounded-full"
              style={{ backgroundColor: aw.lineDark }}
            />
          </div>
          <div
            className="flex-1 rounded-sm border px-2 py-0.5 font-mono text-[9px]"
            style={{ borderColor: aw.line, backgroundColor: aw.paperTop, color: aw.textSoft }}
          >
            {session.url}
          </div>
        </div>
        {/* Viewport placeholder */}
        <div
          className="flex h-[140px] items-center justify-center"
          style={{ backgroundColor: aw.map }}
        >
          <div className="text-center">
            <div
              className="mx-auto mb-2 h-px w-16"
              style={{ backgroundColor: aw.lineDark, opacity: 0.4 }}
            />
            <span className="aw-micro" style={{ color: aw.textSoft }}>
              {session.screenshotPlaceholder}
            </span>
            <div
              className="mx-auto mt-2 h-px w-16"
              style={{ backgroundColor: aw.lineDark, opacity: 0.4 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TerminalSessionPane({ session }: { session: TerminalSession }) {
  return (
    <div className="relative border p-4" style={{ borderColor: aw.lineDark }}>
      <PanelPins />
      <div className="flex items-center gap-2">
        <Terminal className="h-4 w-4" style={{ color: aw.textSoft }} />
        <span className="aw-micro" style={{ color: aw.textSoft }}>
          TERMINAL // {session.status.toUpperCase()}
        </span>
      </div>
      <div className="mt-1.5 font-mono text-[10px]" style={{ color: aw.text }}>
        $ {session.command}
      </div>
      <div className="aw-body-sm mt-2" style={{ color: aw.text }}>
        {session.semanticSummary}
      </div>
      <pre
        className="mt-3 overflow-auto border p-3 text-[10px] leading-relaxed"
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
