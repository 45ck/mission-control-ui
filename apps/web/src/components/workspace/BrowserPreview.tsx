import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
import type { BrowserSession } from '../../data/browser-sessions';
import { aw, semantic } from '../../theme/tokens';
import { PanelPins } from '../primitives/PanelPins';

function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="aw-section" style={{ color: aw.textStrong }}>
        Sign In
      </h2>
      <input
        className="aw-body w-56 rounded border px-3 py-2"
        style={{ borderColor: aw.line, backgroundColor: aw.paperTop, color: aw.text }}
        placeholder="Username"
        readOnly
      />
      <input
        className="aw-body w-56 rounded border px-3 py-2"
        style={{ borderColor: aw.line, backgroundColor: aw.paperTop, color: aw.text }}
        type="password"
        placeholder="Password"
        readOnly
      />
      <button
        className="aw-section w-56 rounded py-2"
        style={{ backgroundColor: aw.accent, color: aw.inverse }}
      >
        Sign in with OAuth
      </button>
    </div>
  );
}

function BillingPage() {
  const rows = [
    { desc: 'API calls (10k)', qty: 1, amount: '$120.00' },
    { desc: 'Storage (50 GB)', qty: 2, amount: '$49.98' },
    { desc: 'Support add-on', qty: 1, amount: '$29.00' },
  ];
  return (
    <div className="p-6">
      <h2 className="aw-section mb-4" style={{ color: aw.textStrong }}>
        Invoice Preview
      </h2>
      <table className="w-full text-left">
        <thead>
          <tr style={{ borderBottom: `1px solid ${aw.line}` }}>
            <th className="aw-micro pb-2" style={{ color: aw.textSoft }}>
              Description
            </th>
            <th className="aw-micro pb-2" style={{ color: aw.textSoft }}>
              Qty
            </th>
            <th className="aw-micro pb-2 text-right" style={{ color: aw.textSoft }}>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.desc} style={{ borderBottom: `1px solid ${aw.lineFaint}` }}>
              <td className="aw-body py-1.5" style={{ color: aw.text }}>
                {r.desc}
              </td>
              <td className="aw-body py-1.5" style={{ color: aw.text }}>
                {r.qty}
              </td>
              <td className="aw-body py-1.5 text-right" style={{ color: aw.text }}>
                {r.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DefaultPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <span className="aw-body aw-skeleton px-4 py-2" style={{ color: aw.textSoft }}>
        Loading...
      </span>
    </div>
  );
}

function renderPage(url: string) {
  if (url.includes('/login')) return <LoginPage />;
  if (url.includes('/billing')) return <BillingPage />;
  return <DefaultPage />;
}

export function BrowserPreview({ session }: { session: BrowserSession }) {
  return (
    <div className="relative flex h-full flex-col" style={{ backgroundColor: aw.paperTop }}>
      <PanelPins corners="top" />
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#febc2e' }} />
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#28c840' }} />
      </div>
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 border-b px-3 pb-2"
        style={{ borderColor: aw.lineFaint }}
      >
        <ArrowLeft size={14} style={{ color: aw.textSoft, opacity: 0.4 }} />
        <ArrowRight size={14} style={{ color: aw.textSoft, opacity: 0.4 }} />
        <RotateCw size={14} style={{ color: aw.textSoft }} className="ml-1" />
        <input
          className="aw-micro ml-2 flex-1 rounded px-2 py-1 font-mono"
          style={{
            backgroundColor: aw.paperTop,
            color: aw.text,
            border: `1px solid ${aw.lineFaint}`,
          }}
          value={session.url}
          readOnly
        />
      </div>
      {/* Viewport */}
      <div className="flex-1 overflow-auto">{renderPage(session.url)}</div>
      {/* Status bar */}
      <div
        className="flex items-center gap-2 border-t px-3 py-1"
        style={{ borderColor: aw.lineFaint }}
      >
        <span
          className="h-[6px] w-[6px] rounded-full"
          style={{ backgroundColor: semantic.success }}
        />
        <span className="aw-micro" style={{ color: aw.textSoft }}>
          Connected
        </span>
        <span className="aw-micro ml-auto" style={{ color: aw.textSoft }}>
          142ms
        </span>
      </div>
    </div>
  );
}
