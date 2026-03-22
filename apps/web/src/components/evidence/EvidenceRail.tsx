import { useState, useMemo } from 'react';
import type { Evidence, EvidenceType } from '../../data/evidence';
import { aw, semantic } from '../../theme/tokens';
import { EvidenceCard } from './EvidenceCard';

const filters: (EvidenceType | 'all')[] = [
  'all',
  'test-result',
  'policy-check',
  'requirement-trace',
  'risk-explanation',
];

const filterLabels: Record<EvidenceType | 'all', string> = {
  all: 'All',
  'test-result': 'Tests',
  'policy-check': 'Policy',
  'requirement-trace': 'Traces',
  'risk-explanation': 'Risk',
};

export function EvidenceRail({
  items,
  onCardClick,
}: {
  items: Evidence[];
  onCardClick?: (item: Evidence) => void;
}) {
  const [activeFilter, setActiveFilter] = useState<EvidenceType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'status'>('newest');

  const passing = items.filter((e) => e.status === 'pass').length;
  const failing = items.filter((e) => e.status === 'fail').length;
  const warnings = items.filter((e) => e.status === 'warning').length;

  const filteredAndSorted = useMemo(() => {
    let result = activeFilter === 'all' ? items : items.filter((e) => e.type === activeFilter);

    if (sortOrder === 'newest') {
      result = [...result].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    } else {
      const statusOrder: Record<string, number> = { fail: 0, warning: 1, pending: 2, pass: 3 };
      result = [...result].sort(
        (a, b) => (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4),
      );
    }

    return result;
  }, [items, activeFilter, sortOrder]);

  return (
    <div className="flex flex-col gap-3">
      <div className="border-b pb-2" style={{ borderColor: aw.lineFaint }}>
        <div className="aw-micro" style={{ color: aw.textSoft }}>
          EVIDENCE RAIL
        </div>
        <div className="mt-1 flex gap-3">
          <span className="aw-micro" style={{ color: semantic.success }}>
            {passing} PASSED
          </span>
          {failing > 0 && (
            <span className="aw-micro" style={{ color: semantic.error }}>
              {failing} FAILED
            </span>
          )}
          {warnings > 0 && (
            <span className="aw-micro" style={{ color: semantic.warning }}>
              {warnings} WARNING
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {filters.map((f) => (
          <button
            key={f}
            className="aw-micro px-1.5 py-0.5 transition-colors"
            style={{
              backgroundColor: activeFilter === f ? aw.plate : 'transparent',
              color: activeFilter === f ? aw.inverse : aw.textSoft,
            }}
            onClick={() => setActiveFilter(f)}
          >
            {filterLabels[f]}
          </button>
        ))}
        <div className="flex-1" />
        <button
          className="aw-micro px-1.5 py-0.5"
          style={{ color: aw.textSoft }}
          onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'status' : 'newest'))}
        >
          {sortOrder === 'newest' ? 'NEWEST' : 'STATUS'}
        </button>
      </div>

      {filteredAndSorted.map((item) => (
        <EvidenceCard
          key={item.id}
          item={item}
          onClick={onCardClick ? () => onCardClick(item) : undefined}
        />
      ))}
    </div>
  );
}
