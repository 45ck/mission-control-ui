import { missions } from '../data/missions';
import { aw } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { StageBadge } from '../components/mission/StageBadge';
import { VerificationBadge } from '../components/evidence/VerificationBadge';

export function History() {
  // Show all missions as history entries, sorted by updatedAt
  const sorted = [...missions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <>
      <TopBar breadcrumbs={['History']} />

      <div className="flex-1 overflow-y-auto p-6 pb-16">
        <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
          MISSION HISTORY &amp; APPROVAL CHAIN
        </div>

        <div className="relative mt-4">
          {/* Timeline line */}
          <div
            className="absolute left-[6px] top-0 h-full w-px"
            style={{ backgroundColor: aw.lineDark }}
          />

          <div className="space-y-4">
            {sorted.map((m) => (
              <div key={m.id} className="relative flex items-start gap-4 pl-6">
                <div
                  className="absolute left-[3px] top-[8px] h-[7px] w-[7px] rounded-full"
                  style={{ backgroundColor: aw.lineInk }}
                />
                <div className="flex-1 border p-3" style={{ borderColor: aw.lineFaint }}>
                  <div className="flex items-center gap-2">
                    <span className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
                      {m.id}
                    </span>
                    <StageBadge stage={m.stage} />
                    <VerificationBadge state={m.verificationState} />
                  </div>
                  <div className="aw-section mt-1 text-[10px]" style={{ color: aw.textStrong }}>
                    {m.title}
                  </div>
                  <div className="aw-body mt-1 text-[8px]" style={{ color: aw.text }}>
                    {m.goal}
                  </div>
                  <div
                    className="mt-2 flex items-center gap-3 aw-micro text-[7px]"
                    style={{ color: aw.textSoft }}
                  >
                    <span>Owner: {m.owner}</span>
                    <span>Updated: {new Date(m.updatedAt).toLocaleString()}</span>
                    <span>Created: {new Date(m.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
