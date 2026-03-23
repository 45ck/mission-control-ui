import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { LeftNav } from './LeftNav';
import { CommandPalette } from './CommandPalette';
import { AmbientDots } from '../primitives/AmbientDots';
import { ErrorBoundary } from '../primitives/ErrorBoundary';
import { aw } from '../../theme/tokens';

const CommandPaletteContext = createContext<(() => void) | null>(null);

export function useCommandPalette() {
  return useContext(CommandPaletteContext);
}

export function AppShell() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const openCommandPalette = () => setCommandPaletteOpen(true);
  const location = useLocation();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <CommandPaletteContext.Provider value={openCommandPalette}>
      <div className="aw-paper relative flex h-screen overflow-hidden">
        <AmbientDots />
        <LeftNav />
        <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
        <main
          className="relative flex flex-1 flex-col overflow-hidden"
          style={{ backgroundColor: 'transparent' }}
        >
          {/* Faint radial glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              background:
                'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.76), transparent 58%)',
            }}
          />
          <div className="aw-scanlines relative flex flex-1 flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              <ErrorBoundary resetKey={location.pathname}>
                <Outlet />
              </ErrorBoundary>
            </AnimatePresence>
          </div>
        </main>
        {/* Bottom timestamp bar */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between border-t px-5 py-1.5"
          style={{ borderColor: aw.line, backgroundColor: aw.haze }}
        >
          <div className="aw-micro text-[9px]" style={{ color: aw.textSoft }}>
            MISSION.CTRL // OPERATING SURFACE v0.1.0
          </div>
          <div className="aw-timestamp text-[12px]" style={{ color: aw.lineDark }}>
            {now.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </div>
        </div>
      </div>
    </CommandPaletteContext.Provider>
  );
}
