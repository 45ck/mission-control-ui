import { useState } from 'react';
import { aw, semantic } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { PanelPins } from '../components/primitives/PanelPins';
import { CornerBracket } from '../components/primitives/CornerBracket';
import { PageTransition } from '../components/shell/PageTransition';

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="aw-focus-ring relative h-[20px] w-[36px] shrink-0 rounded-full transition-colors"
      style={{ backgroundColor: enabled ? semantic.success : aw.lineDark }}
    >
      <div
        className="absolute top-[2px] h-[16px] w-[16px] rounded-full transition-transform"
        style={{
          backgroundColor: aw.inverse,
          transform: enabled ? 'translateX(18px)' : 'translateX(2px)',
        }}
      />
    </button>
  );
}

function SelectControl({ value, options: _options }: { value: string; options: string[] }) {
  return (
    <div
      className="aw-micro inline-flex items-center gap-1 border px-2.5 py-1"
      style={{ borderColor: aw.lineDark, color: aw.textStrong }}
    >
      {value}
      <span style={{ color: aw.textSoft }}>&#9662;</span>
    </div>
  );
}

export function Settings() {
  const [policies, setPolicies] = useState([
    { text: 'No direct commits to main without review', enabled: true },
    { text: 'High-risk missions require 2 approvals', enabled: true },
    { text: 'All missions must pass verification before merge', enabled: true },
    { text: 'Escalations timeout after 24h — auto-reject', enabled: false },
  ]);

  const togglePolicy = (index: number) => {
    setPolicies((prev) => prev.map((p, i) => (i === index ? { ...p, enabled: !p.enabled } : p)));
  };

  return (
    <PageTransition>
      <TopBar breadcrumbs={[{ label: 'Settings' }]} />

      <div className="flex-1 overflow-y-auto p-8 pb-16">
        <div className="aw-micro" style={{ color: aw.textSoft }}>
          SYSTEM SETTINGS
        </div>

        <div className="mt-4 max-w-[700px] space-y-6">
          {/* Risk tiers */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <CornerBracket side="left" />
            <CornerBracket side="right" />
            <PanelPins />
            <div className="aw-section" style={{ color: aw.textStrong }}>
              Risk Tier Thresholds
            </div>
            <div className="mt-4 space-y-3">
              {[
                {
                  tier: 'Low',
                  description: 'Changes to non-critical paths, documentation, tests',
                  threshold: '0-30',
                },
                {
                  tier: 'Medium',
                  description: 'Feature additions, refactors, new endpoints',
                  threshold: '31-70',
                },
                {
                  tier: 'High',
                  description: 'Auth, payments, data migration, security-sensitive',
                  threshold: '71-100',
                },
              ].map((r) => (
                <div
                  key={r.tier}
                  className="flex items-center gap-4 border-b pb-3"
                  style={{ borderColor: aw.lineFaint }}
                >
                  <span className="aw-section w-[60px]" style={{ color: aw.textStrong }}>
                    {r.tier}
                  </span>
                  <span className="aw-body flex-1" style={{ color: aw.text }}>
                    {r.description}
                  </span>
                  <div
                    className="aw-micro-lg border px-2.5 py-1 font-mono"
                    style={{ borderColor: aw.lineDark, color: aw.textStrong }}
                  >
                    {r.threshold}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification preferences */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <CornerBracket side="left" />
            <CornerBracket side="right" />
            <PanelPins />
            <div className="aw-section" style={{ color: aw.textStrong }}>
              Notification Preferences
            </div>
            <div className="mt-4 space-y-3">
              {[
                {
                  label: 'Escalation alerts',
                  value: 'Immediate',
                  options: ['Immediate', 'Batched', 'Off'],
                },
                {
                  label: 'Review ready notifications',
                  value: 'Batched (15 min)',
                  options: ['Immediate', 'Batched (15 min)', 'Batched (1 hr)', 'Off'],
                },
                {
                  label: 'Execution status updates',
                  value: 'On completion only',
                  options: ['Real-time', 'On completion only', 'Off'],
                },
                {
                  label: 'Workflow summaries',
                  value: 'Daily digest',
                  options: ['Daily digest', 'Weekly digest', 'Off'],
                },
              ].map((n) => (
                <div
                  key={n.label}
                  className="flex items-center justify-between border-b pb-3"
                  style={{ borderColor: aw.lineFaint }}
                >
                  <span className="aw-body" style={{ color: aw.text }}>
                    {n.label}
                  </span>
                  <SelectControl value={n.value} options={n.options} />
                </div>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="relative border p-5" style={{ borderColor: aw.lineDark }}>
            <CornerBracket side="left" />
            <CornerBracket side="right" />
            <PanelPins />
            <div className="aw-section" style={{ color: aw.textStrong }}>
              Active Policies
            </div>
            <div className="mt-4 space-y-3">
              {policies.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Toggle enabled={p.enabled} onToggle={() => togglePolicy(i)} />
                  <span className="aw-body" style={{ color: p.enabled ? aw.text : aw.textSoft }}>
                    {p.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <button
            className="aw-focus-ring aw-section px-6 py-2.5 transition-colors hover:opacity-90"
            style={{ backgroundColor: aw.accent, color: aw.inverse }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
