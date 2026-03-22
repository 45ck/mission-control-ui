import { Link } from 'react-router';
import { workflows } from '../data/workflows';
import { missions } from '../data/missions';
import { aw } from '../theme/tokens';
import { TopBar } from '../components/shell/TopBar';
import { CornerBracket } from '../components/primitives/CornerBracket';
import { StageBadge } from '../components/mission/StageBadge';
import { RiskBadge } from '../components/review/RiskBadge';

export function Workflows() {
  return (
    <>
      <TopBar breadcrumbs={['Workflows']} />

      <div className="flex-1 overflow-y-auto p-6 pb-16">
        <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
          ACTIVE WORKFLOWS ({workflows.length})
        </div>

        <div className="mt-4 space-y-4">
          {workflows.map((wf) => {
            const wfMissions = missions.filter((m) => wf.missionIds.includes(m.id));
            return (
              <div key={wf.id} className="relative border p-5" style={{ borderColor: aw.lineDark }}>
                <CornerBracket side="left" />
                <CornerBracket side="right" />

                <div className="flex items-center gap-2">
                  <span className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
                    {wf.id}
                  </span>
                  <span
                    className="aw-micro text-[7px] uppercase"
                    style={{
                      color: wf.status === 'active' ? '#5a8a5a' : aw.textSoft,
                    }}
                  >
                    {wf.status}
                  </span>
                </div>

                <div className="aw-section mt-1 text-[14px]" style={{ color: aw.textStrong }}>
                  {wf.title}
                </div>

                <div className="aw-body mt-2 text-[10px]" style={{ color: aw.text }}>
                  {wf.description}
                </div>

                <div className="aw-micro mt-2 text-[7px]" style={{ color: aw.textSoft }}>
                  Owner: {wf.owner}
                </div>

                <div className="mt-4 border-t pt-3" style={{ borderColor: aw.lineFaint }}>
                  <div className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
                    MISSIONS ({wfMissions.length})
                  </div>
                  <div className="mt-2 space-y-2">
                    {wfMissions.map((m) => (
                      <Link
                        key={m.id}
                        to={`/missions/${m.id}/${m.stage}`}
                        className="flex items-center gap-2 border p-2 transition-colors hover:bg-[var(--color-aw-haze)]"
                        style={{ borderColor: aw.lineFaint }}
                      >
                        <span className="aw-micro text-[7px]" style={{ color: aw.textSoft }}>
                          {m.id}
                        </span>
                        <span
                          className="aw-section flex-1 text-[9px]"
                          style={{ color: aw.textStrong }}
                        >
                          {m.title}
                        </span>
                        <StageBadge stage={m.stage} />
                        <RiskBadge tier={m.riskTier} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
