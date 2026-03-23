import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Target, GitBranch, DollarSign, History, Settings, Plus } from 'lucide-react';
import { aw } from '../../theme/tokens';
import { missions } from '../../data/missions';
import { CornerBracket } from '../primitives/CornerBracket';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const navPages = [
  { label: 'Missions', path: '/missions', icon: Target },
  { label: 'Workflows', path: '/workflows', icon: GitBranch },
  { label: 'History', path: '/history', icon: History },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Costs', path: '/costs', icon: DollarSign },
];

const actions = [{ label: 'Create Mission', path: '/missions/new', icon: Plus }];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract current stage from URL for stage-preserving navigation
  const currentUrlStage = useMemo(() => {
    const parts = location.pathname.split('/');
    const validStages = ['plan', 'execute', 'review'];
    const last = parts[parts.length - 1];
    return last && validStages.includes(last) ? last : null;
  }, [location.pathname]);

  const filteredMissions = useMemo(() => {
    if (!query) return missions;
    const q = query.toLowerCase();
    return missions.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.owner.toLowerCase().includes(q),
    );
  }, [query]);

  const filteredNav = useMemo(() => {
    if (!query) return navPages;
    const q = query.toLowerCase();
    return navPages.filter((p) => p.label.toLowerCase().includes(q));
  }, [query]);

  const filteredActions = useMemo(() => {
    if (!query) return actions;
    const q = query.toLowerCase();
    return actions.filter((a) => a.label.toLowerCase().includes(q));
  }, [query]);

  const allItems = useMemo(() => {
    const items: { label: string; path: string; section: string }[] = [];
    filteredMissions.forEach((m) => {
      const base = m.workflowId
        ? `/workflows/${m.workflowId}/missions/${m.id}`
        : `/missions/${m.id}`;
      // Stage-preserving: use current URL stage if available, else mission's own stage
      const stage = currentUrlStage ?? m.stage;
      const path = stage === 'completed' ? base : `${base}/${stage}`;
      items.push({
        label: `${m.id} — ${m.title}`,
        path,
        section: 'missions',
      });
    });
    filteredNav.forEach((p) => items.push({ label: p.label, path: p.path, section: 'nav' }));
    filteredActions.forEach((a) =>
      items.push({ label: a.label, path: a.path, section: 'actions' }),
    );
    return items;
  }, [filteredMissions, filteredNav, filteredActions, currentUrlStage]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const navigateTo = (path: string) => {
    void navigate(path);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter' && allItems[selectedIndex]) {
      e.preventDefault();
      navigateTo(allItems[selectedIndex].path);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  let itemIndex = 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          <motion.div
            className="relative mx-auto mt-[20vh] max-w-[480px] border"
            style={{ borderColor: aw.lineDark, backgroundColor: aw.paperTop }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <CornerBracket side="left" size="md" />
            <CornerBracket side="right" size="md" />

            <div className="flex items-center gap-2 border-b p-3" style={{ borderColor: aw.line }}>
              <Search className="h-4 w-4 shrink-0" style={{ color: aw.textSoft }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search missions, pages..."
                className="aw-body aw-focus-ring w-full bg-transparent outline-none"
                style={{ color: aw.textStrong }}
              />
            </div>

            <div className="max-h-[340px] overflow-y-auto p-2">
              {filteredMissions.length > 0 && (
                <div className="mb-2">
                  <div className="aw-micro px-2 py-1" style={{ color: aw.textSoft }}>
                    MISSIONS
                  </div>
                  {filteredMissions.map((m) => {
                    const idx = itemIndex++;
                    return (
                      <button
                        key={m.id}
                        className="aw-body flex w-full items-center gap-2 rounded px-2 py-1.5 text-left"
                        style={{
                          color: aw.textStrong,
                          backgroundColor: selectedIndex === idx ? aw.lineFaint : 'transparent',
                        }}
                        onClick={() => {
                          const base = m.workflowId
                            ? `/workflows/${m.workflowId}/missions/${m.id}`
                            : `/missions/${m.id}`;
                          const stage = currentUrlStage ?? m.stage;
                          navigateTo(stage === 'completed' ? base : `${base}/${stage}`);
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <Target className="h-3 w-3 shrink-0" style={{ color: aw.textSoft }} />
                        <span className="truncate">
                          <span style={{ color: aw.textSoft }}>{m.id}</span> — {m.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {filteredNav.length > 0 && (
                <div className="mb-2">
                  <div className="aw-micro px-2 py-1" style={{ color: aw.textSoft }}>
                    NAVIGATION
                  </div>
                  {filteredNav.map((p) => {
                    const idx = itemIndex++;
                    return (
                      <button
                        key={p.path}
                        className="aw-body flex w-full items-center gap-2 rounded px-2 py-1.5 text-left"
                        style={{
                          color: aw.textStrong,
                          backgroundColor: selectedIndex === idx ? aw.lineFaint : 'transparent',
                        }}
                        onClick={() => navigateTo(p.path)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <p.icon className="h-3 w-3 shrink-0" style={{ color: aw.textSoft }} />
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {filteredActions.length > 0 && (
                <div>
                  <div className="aw-micro px-2 py-1" style={{ color: aw.textSoft }}>
                    ACTIONS
                  </div>
                  {filteredActions.map((a) => {
                    const idx = itemIndex++;
                    return (
                      <button
                        key={a.path}
                        className="aw-body flex w-full items-center gap-2 rounded px-2 py-1.5 text-left"
                        style={{
                          color: aw.textStrong,
                          backgroundColor: selectedIndex === idx ? aw.lineFaint : 'transparent',
                        }}
                        onClick={() => navigateTo(a.path)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <a.icon className="h-3 w-3 shrink-0" style={{ color: aw.accentStrong }} />
                        {a.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {allItems.length === 0 && (
                <div className="aw-body px-2 py-4 text-center" style={{ color: aw.textSoft }}>
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
