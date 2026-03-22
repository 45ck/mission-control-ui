import { aw } from '../../theme/tokens';

export function TopBar({ missionId, breadcrumbs }: { missionId?: string; breadcrumbs?: string[] }) {
  return (
    <div
      className="flex h-[44px] items-center border-b px-5"
      style={{ borderColor: aw.line, backgroundColor: aw.paperTop }}
    >
      <div className="flex items-center gap-3">
        {missionId && (
          <>
            <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
              {missionId}
            </div>
            <div className="h-px w-[24px]" style={{ backgroundColor: aw.lineDark }} />
          </>
        )}
        {breadcrumbs?.map((crumb, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="aw-micro text-[8px]"
              style={{
                color: i === breadcrumbs.length - 1 ? aw.textStrong : aw.textSoft,
              }}
            >
              {crumb}
            </div>
            {i < breadcrumbs.length - 1 && (
              <div className="aw-micro text-[8px]" style={{ color: aw.lineDark }}>
                /
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* Right side decorative elements */}
      <div className="flex items-center gap-2">
        <div className="flex gap-[3px]">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[2px] w-[10px]" style={{ backgroundColor: aw.accentSoft }} />
          ))}
        </div>
        <div className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
          MISSION.CTRL // {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
