import { NavLink } from 'react-router';
import { Target, GitBranch, ShieldCheck, History, Settings } from 'lucide-react';
import { aw } from '../../theme/tokens';

const navItems = [
  { to: '/missions', label: 'Missions', icon: Target },
  { to: '/workflows', label: 'Workflows', icon: GitBranch },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function LeftNav() {
  return (
    <nav
      className="flex h-full w-[200px] shrink-0 flex-col border-r"
      style={{ borderColor: aw.line, backgroundColor: aw.haze }}
    >
      {/* Logo area */}
      <div className="border-b px-4 py-4" style={{ borderColor: aw.line }}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" style={{ color: aw.accentStrong }} />
          <div>
            <div className="aw-section text-[11px]" style={{ color: aw.textStrong }}>
              Mission Control
            </div>
            <div className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
              OPERATING SURFACE
            </div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-4 py-2.5 transition-colors ${isActive ? '' : 'hover:bg-[var(--color-aw-line-faint)]'}`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? aw.lineFaint : undefined,
              borderRight: isActive ? `2px solid ${aw.accentStrong}` : '2px solid transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className="h-[14px] w-[14px]"
                  style={{
                    color: isActive ? aw.textStrong : aw.textSoft,
                  }}
                />
                <span
                  className="aw-section text-[10px]"
                  style={{
                    color: isActive ? aw.textStrong : aw.text,
                  }}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Bottom status */}
      <div className="border-t px-4 py-3" style={{ borderColor: aw.line }}>
        <div className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
          5 active missions
        </div>
        <div className="aw-micro mt-0.5 text-[7px]" style={{ color: aw.accentStrong }}>
          2 need review
        </div>
      </div>
    </nav>
  );
}
