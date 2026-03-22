import { Link } from 'react-router';
import { Search } from 'lucide-react';
import { aw } from '../../theme/tokens';
import { NotificationCenter } from './NotificationCenter';

export interface Crumb {
  label: string;
  to?: string;
}

export function TopBar({
  missionId,
  breadcrumbs,
  onOpenCommandPalette,
}: {
  missionId?: string;
  breadcrumbs?: Crumb[];
  onOpenCommandPalette?: () => void;
}) {
  return (
    <div
      className="flex h-[52px] items-center border-b px-5"
      style={{ borderColor: aw.line, backgroundColor: aw.paperTop }}
    >
      <div className="flex items-center gap-3">
        {missionId && (
          <>
            <div className="aw-micro text-[10px]" style={{ color: aw.textSoft }}>
              {missionId}
            </div>
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
          onClick={onOpenCommandPalette}
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
