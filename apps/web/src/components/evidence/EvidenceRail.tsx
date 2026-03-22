import type { Evidence } from '../../data/evidence';
import { aw } from '../../theme/tokens';
import { EvidenceCard } from './EvidenceCard';

export function EvidenceRail({ items }: { items: Evidence[] }) {
  const passing = items.filter((e) => e.status === 'pass').length;
  const failing = items.filter((e) => e.status === 'fail').length;
  const warnings = items.filter((e) => e.status === 'warning').length;

  return (
    <div className="flex flex-col gap-3">
      <div className="border-b pb-2" style={{ borderColor: aw.lineFaint }}>
        <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
          EVIDENCE RAIL
        </div>
        <div className="mt-1 flex gap-3">
          <span className="aw-micro text-[7px]" style={{ color: '#5a8a5a' }}>
            {passing} pass
          </span>
          {failing > 0 && (
            <span className="aw-micro text-[7px]" style={{ color: aw.accentStrong }}>
              {failing} fail
            </span>
          )}
          {warnings > 0 && (
            <span className="aw-micro text-[7px]" style={{ color: '#b8860b' }}>
              {warnings} warn
            </span>
          )}
        </div>
      </div>

      {items.map((item) => (
        <EvidenceCard key={item.id} item={item} />
      ))}
    </div>
  );
}
