import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, RotateCcw } from 'lucide-react';
import type { AgentSession } from '../../data/agent-sessions';
import { aw, semantic, transitions } from '../../theme/tokens';
import { CornerBracket } from '../primitives/CornerBracket';
import { StepCard } from './StepCard';

const statusDot: Record<string, string> = {
  active: semantic.success,
  paused: semantic.warning,
  completed: aw.textSoft,
  failed: aw.accentStrong,
};

export function AgentSwimlane({ session }: { session: AgentSession }) {
  const [displayStatus, setDisplayStatus] = useState(session.status);

  function handlePauseResume() {
    setDisplayStatus((s) => (s === 'active' ? 'paused' : 'active'));
  }

  function handleRetry() {
    setDisplayStatus('active');
  }

  return (
    <motion.div
      className="relative border p-5"
      style={{ borderColor: aw.lineDark }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transitions.normal}
    >
      <CornerBracket side="left" />
      <CornerBracket side="right" />

      <div className="flex items-center gap-2">
        <div
          className="h-[7px] w-[7px] rounded-full"
          style={{ backgroundColor: statusDot[displayStatus] }}
        />
        <span className="aw-section" style={{ color: aw.textStrong }}>
          {session.role}
        </span>
        <span className="aw-micro" style={{ color: aw.textSoft }}>
          {session.model}
        </span>

        {/* Lifecycle controls */}
        <div className="ml-auto flex items-center gap-1">
          {(displayStatus === 'active' || displayStatus === 'paused') && (
            <button
              className="aw-focus-ring rounded p-1 transition-colors"
              style={{ color: aw.textSoft }}
              onClick={handlePauseResume}
              title={displayStatus === 'active' ? 'Pause' : 'Resume'}
            >
              {displayStatus === 'active' ? <Pause size={13} /> : <Play size={13} />}
            </button>
          )}
          {displayStatus === 'failed' && (
            <button
              className="aw-focus-ring rounded p-1 transition-colors"
              style={{ color: aw.textSoft }}
              onClick={handleRetry}
              title="Retry"
            >
              <RotateCcw size={13} />
            </button>
          )}
          <span className="aw-micro uppercase" style={{ color: statusDot[displayStatus] }}>
            {displayStatus}
          </span>
        </div>
      </div>

      <div className="aw-body mt-2" style={{ color: aw.text }}>
        {session.semanticSummary}
      </div>

      <div className="mt-3 space-y-1.5">
        {session.steps.map((step) => (
          <StepCard key={step.id} step={step} />
        ))}
      </div>
    </motion.div>
  );
}
