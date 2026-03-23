import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { aw, semantic } from '../../theme/tokens';
import { missions } from '../../data/missions';
import { useRecentMissions } from '../../hooks/useRecentMissions';
import { PanelPins } from '../primitives/PanelPins';

interface MissionSwitcherDropdownProps {
  currentMissionId: string;
  currentStage: string;
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

const stageDot: Record<string, string> = {
  execute: semantic.success,
  review: '#5a7a8a',
  plan: aw.lineDark,
  completed: aw.textSoft,
  escalation: semantic.warning,
};

export function MissionSwitcherDropdown({
  currentMissionId,
  currentStage,
  open,
  onClose,
  anchorRef,
}: MissionSwitcherDropdownProps) {
  const navigate = useNavigate();
  const { recentMissions } = useRecentMissions();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Build flat item list: recent (excluding current) then all non-recent
  const recentIds = new Set(recentMissions.map((m) => m.id));
  const recentItems = recentMissions;
  const allItems = missions.filter((m) => !recentIds.has(m.id));
  const flatItems = [...recentItems, ...allItems];

  const navigateToMission = useCallback(
    (missionId: string) => {
      const target = missions.find((m) => m.id === missionId);
      if (!target) return;

      const base = target.workflowId
        ? `/workflows/${target.workflowId}/missions/${missionId}`
        : `/missions/${missionId}`;

      // Stage-preserving: try current stage, fall back to mission's own stage
      const validStages = ['plan', 'execute', 'review'];
      const stage =
        currentStage && validStages.includes(currentStage) ? currentStage : target.stage;
      const path = stage === 'completed' ? base : `${base}/${stage}`;

      void navigate(path);
      onClose();
    },
    [currentStage, navigate, onClose],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = flatItems[selectedIndex];
        if (item) navigateToMission(item.id);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [open, flatItems, selectedIndex, navigateToMission, onClose],
  );

  useEffect(() => {
    if (open) {
      setSelectedIndex(0);
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  // Scroll selected item into view
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex, open]);

  // Position below anchor
  const [pos, setPos] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (open && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
  }, [open, anchorRef]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={onClose} />

          <motion.div
            className="fixed z-50 w-[280px] border"
            style={{
              top: pos.top,
              left: pos.left,
              borderColor: aw.lineDark,
              backgroundColor: aw.paperTop,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
          >
            <PanelPins corners="all" />

            <div ref={listRef} className="max-h-[320px] overflow-y-auto p-1.5">
              {/* Recent section */}
              {recentItems.length > 0 && (
                <div className="mb-1">
                  <div className="aw-micro px-2 py-1 text-[9px]" style={{ color: aw.textSoft }}>
                    RECENT
                  </div>
                  {recentItems.map((m, i) => {
                    const idx = i;
                    return (
                      <MissionRow
                        key={m.id}
                        mission={m}
                        isCurrent={m.id === currentMissionId}
                        isSelected={selectedIndex === idx}
                        dataIdx={idx}
                        onClick={() => navigateToMission(m.id)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      />
                    );
                  })}
                </div>
              )}

              {/* Divider */}
              {recentItems.length > 0 && allItems.length > 0 && (
                <div className="mx-2 my-1 h-px" style={{ backgroundColor: aw.lineFaint }} />
              )}

              {/* All missions section */}
              {allItems.length > 0 && (
                <div>
                  <div className="aw-micro px-2 py-1 text-[9px]" style={{ color: aw.textSoft }}>
                    ALL MISSIONS
                  </div>
                  {allItems.map((m, i) => {
                    const idx = recentItems.length + i;
                    return (
                      <MissionRow
                        key={m.id}
                        mission={m}
                        isCurrent={m.id === currentMissionId}
                        isSelected={selectedIndex === idx}
                        dataIdx={idx}
                        onClick={() => navigateToMission(m.id)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Row component ──────────────────────────────────────────────

function MissionRow({
  mission,
  isCurrent,
  isSelected,
  dataIdx,
  onClick,
  onMouseEnter,
}: {
  mission: (typeof missions)[number];
  isCurrent: boolean;
  isSelected: boolean;
  dataIdx: number;
  onClick: () => void;
  onMouseEnter: () => void;
}) {
  const dot = stageDot[mission.stage] ?? aw.lineDark;
  return (
    <button
      data-idx={dataIdx}
      className="aw-body flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px]"
      style={{
        color: aw.textStrong,
        backgroundColor: isSelected ? aw.lineFaint : 'transparent',
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <span className="shrink-0 font-mono text-[10px]" style={{ color: aw.textSoft }}>
        {mission.id}
      </span>
      <span
        className="inline-block h-[6px] w-[6px] shrink-0 rounded-full"
        style={{ backgroundColor: dot }}
      />
      <span className="truncate" style={{ color: aw.text }}>
        {mission.stage}
      </span>
      {mission.escalationActive && (
        <span className="text-[9px]" style={{ color: semantic.warning }}>
          ⚠
        </span>
      )}
      {isCurrent && (
        <span className="ml-auto text-[9px]" style={{ color: aw.accent }}>
          ←
        </span>
      )}
    </button>
  );
}
