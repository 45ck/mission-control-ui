import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { missions } from '../data/missions';
import { aw } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { StageBadge } from '../components/mission/StageBadge';
import { VerificationBadge } from '../components/evidence/VerificationBadge';
import { CornerBracket } from '../components/primitives/CornerBracket';
import { FeedTicks } from '../components/primitives/FeedTicks';
import { PageTransition } from '../components/shell/PageTransition';
import type { Stage } from '../data/missions';

const stageDotColor: Record<Stage, string> = {
  plan: aw.plate,
  execute: aw.plateDark,
  review: aw.accentStrong,
  escalation: aw.accent,
};

export function History() {
  const sorted = [...missions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <PageTransition>
      <TopBar breadcrumbs={[{ label: 'History' }]} />

      <div className="flex-1 overflow-y-auto p-8 pb-16">
        <div className="aw-micro" style={{ color: aw.textSoft }}>
          MISSION HISTORY &amp; APPROVAL CHAIN
        </div>

        <div className="relative mt-4">
          {/* Timeline line */}
          <div
            className="absolute left-[7px] top-0 h-full w-px"
            style={{ backgroundColor: aw.lineDark }}
          />

          <div className="space-y-5">
            {sorted.map((m, i) => (
              <motion.div
                key={m.id}
                className="relative flex items-start gap-4 pl-7"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
              >
                <div
                  className="absolute left-[3px] top-[8px] h-[8px] w-[8px] rounded-full"
                  style={{ backgroundColor: stageDotColor[m.stage] }}
                />
                <div className="relative flex-1 border p-4" style={{ borderColor: aw.lineFaint }}>
                  <CornerBracket side="right" />
                  <FeedTicks />
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/missions/${m.id}`}
                      className="aw-micro transition-colors hover:text-[var(--color-aw-accent-strong)]"
                      style={{ color: aw.textSoft }}
                    >
                      {m.id}
                    </Link>
                    <StageBadge stage={m.stage} />
                    <VerificationBadge state={m.verificationState} />
                  </div>
                  <Link
                    to={`/missions/${m.id}`}
                    className="aw-section mt-1 block transition-colors hover:text-[var(--color-aw-accent-strong)]"
                    style={{ color: aw.textStrong }}
                  >
                    {m.title}
                  </Link>
                  <div className="aw-body-sm mt-1" style={{ color: aw.text }}>
                    {m.goal}
                  </div>
                  <div
                    className="mt-2 flex items-center gap-3 aw-micro"
                    style={{ color: aw.textSoft }}
                  >
                    <span>Owner: {m.owner}</span>
                    <span>Updated: {new Date(m.updatedAt).toLocaleString()}</span>
                    <span>Created: {new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
