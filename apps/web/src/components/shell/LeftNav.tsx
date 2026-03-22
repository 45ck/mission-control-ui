import { NavLink, useLocation } from 'react-router';
import { Target, GitBranch, DollarSign, ShieldCheck, History, Settings } from 'lucide-react';
import { missions } from '../../data/missions';
import { aw } from '../../theme/tokens';

const navItems = [
  { to: '/workflows', label: 'Workflows', icon: GitBranch },
  { to: '/missions', label: 'Missions', icon: Target, separatorAfter: true },
  { to: '/costs', label: 'Costs', icon: DollarSign },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

export function LeftNav() {
  const location = useLocation();
  const activeMissionCount = missions.filter(
    (m) => m.stage === 'execute' || m.stage === 'plan',
  ).length;
  const needsReviewCount = missions.filter(
    (m) => m.stage === 'review' || m.stage === 'escalation',
  ).length;

  return (
    <nav
      className="flex h-full w-[200px] shrink-0 flex-col border-r"
      style={{ borderColor: aw.line, backgroundColor: aw.haze }}
    >
      {/* Logo area */}
      <div className="border-b px-4 py-4" style={{ borderColor: aw.line }}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6" style={{ color: aw.accentStrong }} />
          <div>
            <div className="aw-section text-[14px]" style={{ color: aw.textStrong }}>
              Mission Control
            </div>
            <div className="aw-micro text-[9px]" style={{ color: aw.textSoft }}>
              AGENT SUPERVISION
            </div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 py-2">
        {navItems.map((item) => {
          // Missions nav item should also be active on workflow-scoped mission pages
          const isMissionsItem = item.to === '/missions';
          const pathIncludesMission = isMissionsItem && location.pathname.includes('/missions/');

          return (
            <div key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => {
                  const effectiveActive = isActive || pathIncludesMission;
                  return `aw-transition aw-focus-ring flex items-center gap-2.5 px-4 py-3 transition-colors ${effectiveActive ? '' : 'hover:bg-[var(--color-aw-line-faint)]'}`;
                }}
                style={({ isActive }) => {
                  const effectiveActive = isActive || pathIncludesMission;
                  return {
                    backgroundColor: effectiveActive ? aw.lineFaint : undefined,
                    borderRight: effectiveActive
                      ? `3px solid ${aw.accentStrong}`
                      : '3px solid transparent',
                  };
                }}
              >
                {({ isActive }) => {
                  const effectiveActive = isActive || pathIncludesMission;
                  return (
                    <>
                      <item.icon
                        className="h-[16px] w-[16px]"
                        style={{
                          color: effectiveActive ? aw.textStrong : aw.textSoft,
                        }}
                      />
                      <span
                        className="aw-section text-[12px]"
                        style={{
                          color: effectiveActive ? aw.textStrong : aw.text,
                        }}
                      >
                        {item.label}
                      </span>
                      {isMissionsItem && missions.length > 0 && (
                        <span
                          className="ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                          style={{
                            backgroundColor: aw.accentSoft,
                            color: aw.accentStrong,
                          }}
                        >
                          {missions.length}
                        </span>
                      )}
                    </>
                  );
                }}
              </NavLink>
              {'separatorAfter' in item && item.separatorAfter && (
                <div className="mx-4 my-1.5 h-px" style={{ backgroundColor: aw.lineFaint }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom status */}
      <div className="border-t px-4 py-3" style={{ borderColor: aw.line }}>
        <div className="aw-micro text-[9px]" style={{ color: aw.textSoft }}>
          {activeMissionCount} active mission{activeMissionCount !== 1 ? 's' : ''}
        </div>
        {needsReviewCount > 0 && (
          <div className="aw-micro mt-0.5 text-[9px]" style={{ color: aw.accentStrong }}>
            {needsReviewCount} need review
          </div>
        )}
      </div>
    </nav>
  );
}
