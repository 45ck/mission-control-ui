import { Plus, X } from 'lucide-react';
import type { Branch } from '../../data/branches';
import { aw } from '../../theme/tokens';
import { BranchBadge } from './BranchBadge';

interface WorkspaceTabItem {
  id: string;
  missionTitle: string;
  branch: Branch;
}

interface WorkspaceTabsProps {
  workspaces: WorkspaceTabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onAdd: () => void;
}

function TabItem({
  ws,
  isActive,
  onSelect,
  onClose,
}: {
  ws: WorkspaceTabItem;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
}) {
  const label =
    ws.missionTitle.length > 24 ? ws.missionTitle.slice(0, 24) + '\u2026' : ws.missionTitle;

  return (
    <button
      className="aw-focus-ring flex shrink-0 items-center gap-2 px-3 py-2 whitespace-nowrap"
      style={{
        backgroundColor: isActive ? aw.haze : 'transparent',
        borderBottom: isActive ? `3px solid ${aw.accent}` : '3px solid transparent',
        color: isActive ? aw.textStrong : aw.textSoft,
      }}
      onClick={onSelect}
    >
      <span className="aw-micro">{label}</span>
      <BranchBadge branch={ws.branch} />
      <span
        className="ml-1 rounded p-0.5 hover:opacity-70"
        role="button"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X size={12} style={{ color: aw.textSoft }} />
      </span>
    </button>
  );
}

export function WorkspaceTabs({
  workspaces,
  activeId,
  onSelect,
  onClose,
  onAdd,
}: WorkspaceTabsProps) {
  return (
    <div
      className="flex items-center overflow-x-auto border-b"
      style={{ borderColor: aw.lineFaint, whiteSpace: 'nowrap' }}
    >
      {workspaces.map((ws) => (
        <TabItem
          key={ws.id}
          ws={ws}
          isActive={ws.id === activeId}
          onSelect={() => onSelect(ws.id)}
          onClose={() => onClose(ws.id)}
        />
      ))}
      <button
        className="aw-focus-ring shrink-0 p-2"
        style={{ color: aw.textSoft }}
        onClick={onAdd}
        aria-label="Add workspace"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
