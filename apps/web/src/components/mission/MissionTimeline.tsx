import type { MissionEventType } from '../../data/mission-events';
import { missionEvents } from '../../data/mission-events';
import { aw, semantic } from '../../theme/tokens';

const eventColor: Record<MissionEventType, string> = {
  created: semantic.info,
  'plan-approved': semantic.success,
  'execution-started': semantic.warning,
  'evidence-collected': semantic.info,
  'escalation-raised': semantic.error,
  'review-approved': semantic.success,
  completed: semantic.success,
};

export function MissionTimeline({ missionId }: { missionId: string }) {
  const events = missionEvents
    .filter((e) => e.missionId === missionId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (events.length === 0) return null;

  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-[5px] top-0 bottom-0 w-[2px]"
        style={{ backgroundColor: aw.lineDark }}
      />

      <div>
        {events.map((event) => {
          const color = eventColor[event.type];
          return (
            <div key={event.id} className="relative flex py-3" style={{ marginLeft: 20 }}>
              {/* Dot */}
              <div
                className="absolute rounded-full"
                style={{
                  left: -20,
                  top: 16,
                  width: 12,
                  height: 12,
                  backgroundColor: color,
                }}
              />

              {/* Content */}
              <div className="min-w-0">
                <div className="aw-section-sm" style={{ color }}>
                  {event.type.toUpperCase()}
                </div>
                <div className="aw-body mt-0.5" style={{ color: aw.text }}>
                  {event.detail}
                </div>
                <div className="aw-micro mt-1" style={{ color: aw.textSoft }}>
                  {event.actor} &middot; {new Date(event.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
