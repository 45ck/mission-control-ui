import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { aw } from '../../theme/tokens';
import { CornerBracket } from './CornerBracket';

const sections = [
  {
    title: 'MISSIONS',
    body: 'Missions are discrete units of work assigned to AI agents. Each mission has a goal, scope boundary, acceptance criteria, and risk assessment. Missions progress through stages: Plan, Execute, Review, and Escalation.',
  },
  {
    title: 'STAGES',
    body: 'Plan: Define the mission goal and constraints. Execute: AI agents work on the task. Review: Verify agent output against criteria. Escalation: Human decision needed when agents encounter ambiguity.',
  },
  {
    title: 'WORKFLOWS',
    body: 'Workflows group related missions together with dependency ordering. The Kanban board shows mission progress across stages.',
  },
  {
    title: 'EVIDENCE & VERIFICATION',
    body: 'Evidence items (tests, checks, audits) verify that agent work meets acceptance criteria. Verification states: Passing, Failing, Pending, or Blocked.',
  },
  {
    title: 'ESCALATIONS',
    body: 'When an agent encounters a decision it cannot make autonomously, it escalates to a human. You review the context, choose an option, and the agent proceeds.',
  },
];

export function HelpModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="aw-focus-ring fixed bottom-6 left-6 z-40 flex h-9 w-9 items-center justify-center border transition-colors hover:bg-[var(--color-aw-haze)]"
        style={{ borderColor: aw.lineDark, backgroundColor: aw.paperTop }}
        title="Help"
      >
        <HelpCircle className="h-4 w-4" style={{ color: aw.textSoft }} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50"
              style={{ backgroundColor: 'rgba(90,98,102,0.3)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border p-8"
              style={{ borderColor: aw.lineDark, backgroundColor: aw.paperTop }}
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <CornerBracket side="left" />
              <CornerBracket side="right" />

              <div className="flex items-center justify-between">
                <div className="aw-section" style={{ color: aw.textStrong }}>
                  Mission Control Guide
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="aw-focus-ring transition-opacity hover:opacity-70"
                >
                  <X className="h-4 w-4" style={{ color: aw.textSoft }} />
                </button>
              </div>

              <div className="aw-body mt-2" style={{ color: aw.text }}>
                Mission Control orchestrates AI coding agents through structured workflows with
                human oversight at critical decision points.
              </div>

              <div className="mt-6 space-y-4">
                {sections.map((s) => (
                  <div key={s.title}>
                    <div className="aw-micro" style={{ color: aw.textSoft }}>
                      {s.title}
                    </div>
                    <div className="aw-body-sm mt-1" style={{ color: aw.text }}>
                      {s.body}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="aw-focus-ring aw-section-sm border px-4 py-1.5 transition-colors hover:bg-[var(--color-aw-haze)]"
                  style={{ borderColor: aw.lineDark, color: aw.textStrong }}
                >
                  GOT IT
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
