import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { LeftNav } from './LeftNav';
import { CommandPalette } from './CommandPalette';
import { AmbientDots } from '../primitives/AmbientDots';
import { HelpModal } from '../primitives/HelpModal';
import { ErrorBoundary } from '../primitives/ErrorBoundary';
import { aw } from '../../theme/tokens';

const CommandPaletteContext = createContext<(() => void) | null>(null);
const MissionSwitcherContext = createContext<(() => void) | null>(null);

export function useCommandPalette() {
  return useContext(CommandPaletteContext);
}

export function useMissionSwitcher() {
  return useContext(MissionSwitcherContext);
}

export function AppShell() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const openCommandPalette = useCallback(() => setCommandPaletteOpen(true), []);
  const location = useLocation();
  const [now, setNow] = useState(new Date());

  // Mission switcher — dispatches a custom event that TopBar listens to
  const openMissionSwitcher = useCallback(() => {
    window.dispatchEvent(new CustomEvent('mc:toggle-mission-switcher'));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Cmd+K / Ctrl+K — Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      // Cmd+Shift+M / Ctrl+Shift+M — Mission Switcher
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        openMissionSwitcher();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [openMissionSwitcher]);

  // Listen for the custom event in TopBar via a shared effect
  useEffect(() => {
    const handler = () => {
      // This is picked up by the TopBar component through the context
    };
    window.addEventListener('mc:toggle-mission-switcher', handler);
    return () => window.removeEventListener('mc:toggle-mission-switcher', handler);
  }, []);

  // Detect whether the current route is a LiveView route
  const isLiveRoute = /\/missions\/[^/]+\/live$/.test(location.pathname);

  return (
    <CommandPaletteContext.Provider value={openCommandPalette}>
      <MissionSwitcherContext.Provider value={openMissionSwitcher}>
        <div className="aw-paper relative flex h-screen overflow-hidden">
          {/* Skip navigation link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded focus:border focus:bg-white focus:px-4 focus:py-2 focus:text-sm"
          >
            Skip to content
          </a>
          <AmbientDots />
          <nav aria-label="Main navigation">
            <LeftNav collapsed={isLiveRoute} />
          </nav>
          <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
          <main
            id="main-content"
            role="main"
            aria-label="Page content"
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
          {/* Bottom timestamp bar — hidden on live routes */}
          {!isLiveRoute && (
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
          )}
          <HelpModal />
        </div>
      </MissionSwitcherContext.Provider>
    </CommandPaletteContext.Provider>
  );
}
