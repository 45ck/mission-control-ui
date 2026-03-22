import { motion } from 'framer-motion';
import type { AgentSession } from '../../data/agent-sessions';
import { aw } from '../../theme/tokens';
import { CornerBracket } from '../primitives/CornerBracket';
import { StepCard } from './StepCard';

const statusDot: Record<string, string> = {
  active: '#5a8a5a',
  paused: '#b8860b',
  completed: aw.textSoft,
  failed: aw.accentStrong,
};

export function AgentSwimlane({ session }: { session: AgentSession }) {
  return (
    <motion.div
      className="relative border p-4"
      style={{ borderColor: aw.lineDark }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <CornerBracket side="left" />
      <CornerBracket side="right" />

      <div className="flex items-center gap-2">
        <div
          className="h-[6px] w-[6px] rounded-full"
          style={{ backgroundColor: statusDot[session.status] }}
        />
        <span className="aw-section text-[10px]" style={{ color: aw.textStrong }}>
          {session.role}
        </span>
        <span className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
          {session.model}
        </span>
        <span
          className="aw-micro ml-auto text-[7px] uppercase"
          style={{ color: statusDot[session.status] }}
        >
          {session.status}
        </span>
      </div>

      <div className="aw-body mt-2 text-[9px]" style={{ color: aw.text }}>
        {session.semanticSummary}
      </div>

      <div className="mt-3 space-y-1">
        {session.steps.map((step) => (
          <StepCard key={step.id} step={step} />
        ))}
      </div>
    </motion.div>
  );
}
