import { Outlet } from 'react-router';
import { LeftNav } from './LeftNav';
import { AmbientDots } from '../primitives/AmbientDots';
import { aw } from '../../theme/tokens';

export function AppShell() {
  return (
    <div className="aw-paper relative flex h-screen overflow-hidden">
      <AmbientDots />
      <LeftNav />
      <main
        className="relative flex flex-1 flex-col overflow-hidden"
        style={{ backgroundColor: 'transparent' }}
      >
        {/* Faint radial glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.76), transparent 58%)',
          }}
        />
        <div className="relative flex flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </main>
      {/* Bottom timestamp bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between border-t px-5 py-1.5"
        style={{ borderColor: aw.line, backgroundColor: aw.haze }}
      >
        <div className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
          MISSION.CTRL // OPERATING SURFACE v0.1.0
        </div>
        <div className="aw-timestamp text-[10px]" style={{ color: aw.lineDark }}>
          {new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })}
        </div>
      </div>
    </div>
  );
}
