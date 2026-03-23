import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRightCircle,
  FileText,
} from 'lucide-react';
import { aw, semantic } from '../../theme/tokens';
import { notifications, type Notification } from '../../data/notifications';

const typeIcons: Record<Notification['type'], typeof CheckCircle> = {
  'stage-change': ArrowRightCircle,
  escalation: AlertTriangle,
  'agent-failure': XCircle,
  approval: CheckCircle,
  evidence: FileText,
};

function relativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(
    () => new Set(notifications.filter((n) => n.read).map((n) => n.id)),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const markRead = (id: string) => {
    setReadIds((prev) => new Set(prev).add(id));
  };

  const handleClick = (n: Notification) => {
    markRead(n.id);
    const base = `/missions/${n.missionId}`;
    const stageSuffix: Record<Notification['type'], string> = {
      'stage-change': '',
      escalation: '/escalation',
      'agent-failure': '/execute',
      approval: '/review',
      evidence: '/review',
    };
    void navigate(`${base}${stageSuffix[n.type]}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="aw-focus-ring relative flex items-center justify-center p-1"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ color: aw.textSoft }}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-[14px] min-w-[14px] items-center justify-center rounded-full px-0.5 text-[9px] font-bold"
            style={{ backgroundColor: semantic.error, color: aw.inverse }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-40 mt-1 w-80 border shadow-lg"
          style={{ borderColor: aw.lineDark, backgroundColor: aw.paperTop }}
        >
          <div
            className="flex items-center justify-between border-b px-3 py-2"
            style={{ borderColor: aw.line }}
          >
            <span className="aw-micro" style={{ color: aw.textSoft }}>
              NOTIFICATIONS
            </span>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((n) => {
              const Icon = typeIcons[n.type];
              const isUnread = !readIds.has(n.id);

              return (
                <div
                  key={n.id}
                  className="flex w-full items-start gap-2 border-b px-3 py-2.5 text-left transition-colors cursor-pointer"
                  style={{
                    borderColor: aw.lineFaint,
                    borderLeftWidth: isUnread ? '3px' : '1px',
                    borderLeftColor: isUnread ? aw.accentStrong : aw.lineFaint,
                  }}
                  onClick={() => handleClick(n)}
                >
                  <Icon
                    className="mt-0.5 h-[14px] w-[14px] shrink-0"
                    style={{ color: aw.textSoft }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="aw-section-sm truncate" style={{ color: aw.textStrong }}>
                      {n.title}
                    </div>
                    <div className="aw-body-sm mt-0.5 truncate" style={{ color: aw.text }}>
                      {n.detail}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="aw-micro" style={{ color: aw.textSoft }}>
                        {relativeTime(n.timestamp)}
                      </span>
                      {isUnread && (
                        <button
                          className="aw-micro aw-focus-ring"
                          style={{ color: aw.accentStrong }}
                          onClick={(e) => {
                            e.stopPropagation();
                            markRead(n.id);
                          }}
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
