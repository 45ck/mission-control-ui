import { aw } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { PanelPins } from '../components/primitives/PanelPins';

export function Settings() {
  return (
    <>
      <TopBar breadcrumbs={['Settings']} />

      <div className="flex-1 overflow-y-auto p-6 pb-16">
        <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
          SYSTEM SETTINGS
        </div>

        <div className="mt-4 max-w-[600px] space-y-4">
          {/* Risk tiers */}
          <div className="relative border p-4" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-section text-[11px]" style={{ color: aw.textStrong }}>
              Risk Tier Thresholds
            </div>
            <div className="mt-3 space-y-2">
              {[
                { tier: 'Low', description: 'Changes to non-critical paths, documentation, tests' },
                { tier: 'Medium', description: 'Feature additions, refactors, new endpoints' },
                { tier: 'High', description: 'Auth, payments, data migration, security-sensitive' },
              ].map((r) => (
                <div
                  key={r.tier}
                  className="flex items-center gap-3 border-b pb-2"
                  style={{ borderColor: aw.lineFaint }}
                >
                  <span className="aw-section w-[60px] text-[9px]" style={{ color: aw.textStrong }}>
                    {r.tier}
                  </span>
                  <span className="aw-body flex-1 text-[9px]" style={{ color: aw.text }}>
                    {r.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notification preferences */}
          <div className="relative border p-4" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-section text-[11px]" style={{ color: aw.textStrong }}>
              Notification Preferences
            </div>
            <div className="mt-3 space-y-2">
              {[
                { label: 'Escalation alerts', value: 'Immediate' },
                { label: 'Review ready notifications', value: 'Batched (15 min)' },
                { label: 'Execution status updates', value: 'On completion only' },
                { label: 'Workflow summaries', value: 'Daily digest' },
              ].map((n) => (
                <div
                  key={n.label}
                  className="flex items-center justify-between border-b pb-2"
                  style={{ borderColor: aw.lineFaint }}
                >
                  <span className="aw-body text-[9px]" style={{ color: aw.text }}>
                    {n.label}
                  </span>
                  <span className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
                    {n.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div className="relative border p-4" style={{ borderColor: aw.lineDark }}>
            <PanelPins />
            <div className="aw-section text-[11px]" style={{ color: aw.textStrong }}>
              Active Policies
            </div>
            <div className="mt-3 space-y-2">
              {[
                'No direct commits to main without review',
                'High-risk missions require 2 approvals',
                'All missions must pass verification before merge',
                'Escalations timeout after 24h — auto-reject',
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span
                    className="mt-[3px] inline-block h-[5px] w-[5px] shrink-0 rounded-full"
                    style={{ backgroundColor: '#5a8a5a' }}
                  />
                  <span className="aw-body text-[9px]" style={{ color: aw.text }}>
                    {p}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
