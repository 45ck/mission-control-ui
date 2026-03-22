import { motion } from 'framer-motion';
import type { AgentSession } from '../../data/agent-sessions';
import { aw } from '../../theme/tokens';

export function ReplayTimeline({ sessions }: { sessions: AgentSession[] }) {
  const allSteps = sessions.flatMap((s) =>
    s.steps
      .filter((step) => step.timestamp)
      .map((step) => ({
        ...step,
        sessionRole: s.role,
        sessionId: s.id,
      })),
  );
  allSteps.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const statusColors: Record<string, string> = {
    completed: '#5a8a5a',
    running: aw.accentStrong,
    pending: aw.textSoft,
    failed: aw.accent,
  };

  return (
    <div>
      <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
        REPLAY TIMELINE
      </div>

      <div className="relative mt-3">
        {/* Timeline line */}
        <div
          className="absolute left-[6px] top-0 h-full w-px"
          style={{ backgroundColor: aw.lineDark }}
        />

        <div className="space-y-3">
          {allSteps.map((step, i) => (
            <motion.div
              key={`${step.sessionId}-${step.id}`}
              className="relative flex items-start gap-3 pl-5"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
            >
              {/* Timeline dot */}
              <div
                className="absolute left-[3px] top-[6px] h-[7px] w-[7px] rounded-full"
                style={{
                  backgroundColor: statusColors[step.status] ?? aw.textSoft,
                }}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="aw-section text-[9px]" style={{ color: aw.textStrong }}>
                    {step.action}
                  </span>
                  <span className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
                    {step.sessionRole}
                  </span>
                </div>
                <div className="aw-body text-[8px]" style={{ color: aw.text }}>
                  {step.detail}
                </div>
                {step.timestamp && (
                  <div className="aw-micro mt-0.5 text-[7px]" style={{ color: aw.textSoft }}>
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
