import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, ChevronDown } from 'lucide-react';
import { aw } from '../../theme/tokens';
import { NotificationCenter } from './NotificationCenter';
import { useCommandPalette } from './AppShell';
import { MissionSwitcherDropdown } from './MissionSwitcherDropdown';

export interface Crumb {
  label: string;
  to?: string;
}

export function TopBar({
  missionId,
  currentStage,
  breadcrumbs,
  onOpenCommandPalette,
}: {
  missionId?: string;
  currentStage?: string;
  breadcrumbs?: Crumb[];
  onOpenCommandPalette?: () => void;
}) {
  const contextOpen = useCommandPalette();
  const handleOpenCommandPalette = onOpenCommandPalette ?? contextOpen ?? undefined;

  // Switcher state
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherButtonRef = useRef<HTMLButtonElement>(null);

  const handleSwitcherToggle = () => setSwitcherOpen((prev) => !prev);

  // Listen for keyboard shortcut (Cmd+Shift+M dispatched via AppShell)
  useEffect(() => {
    const handler = () => {
      if (missionId) setSwitcherOpen((prev) => !prev);
    };
    window.addEventListener('mc:toggle-mission-switcher', handler);
    return () => window.removeEventListener('mc:toggle-mission-switcher', handler);
  }, [missionId]);

  return (
    <div
      className="flex h-[52px] items-center border-b px-5"
      style={{ borderColor: aw.line, backgroundColor: aw.paperTop }}
    >
      <div className="flex items-center gap-3">
        {missionId && (
          <>
            <button
              ref={switcherButtonRef}
              className="aw-micro aw-focus-ring inline-flex items-center gap-1 rounded border px-2 py-1 text-[10px] transition-colors hover:bg-[var(--color-aw-haze)]"
              style={{
                color: aw.textSoft,
                borderColor: switcherOpen ? aw.accent : aw.lineDark,
                backgroundColor: switcherOpen ? aw.haze : 'transparent',
              }}
              onClick={handleSwitcherToggle}
            >
              {missionId}
              <ChevronDown
                size={10}
                style={{
                  transform: switcherOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.15s ease',
                }}
              />
            </button>
            <MissionSwitcherDropdown
              currentMissionId={missionId}
              currentStage={currentStage ?? ''}
              open={switcherOpen}
              onClose={() => setSwitcherOpen(false)}
              anchorRef={switcherButtonRef}
            />
            <div className="h-px w-[24px]" style={{ backgroundColor: aw.lineDark }} />
          </>
        )}
        {breadcrumbs?.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1;
          return (
            <div key={i} className="flex items-center gap-3">
              {!isLast && crumb.to ? (
                <Link
                  to={crumb.to}
                  className="aw-micro text-[11px] transition-colors hover:text-[var(--color-aw-text-strong)]"
                  style={{ color: aw.textSoft }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <div
                  className="aw-micro text-[11px]"
                  style={{ color: isLast ? aw.textStrong : aw.textSoft }}
                >
                  {crumb.label}
                </div>
              )}
              {!isLast && (
                <div className="aw-micro text-[11px]" style={{ color: aw.lineDark }}>
                  /
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex-1" />

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        <button
          className="aw-focus-ring flex items-center justify-center p-1"
          style={{ color: aw.textSoft }}
          onClick={handleOpenCommandPalette}
        >
          <Search className="h-4 w-4" />
        </button>
        <NotificationCenter />
        <div
          className="aw-micro flex h-[32px] w-[32px] items-center justify-center rounded-full"
          style={{ backgroundColor: aw.plate, color: aw.inverse }}
        >
          SC
        </div>
        <div className="aw-micro text-[9px]" style={{ color: aw.textSoft }}>
          MISSION.CTRL // {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
