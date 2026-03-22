import type { Mission } from '../../data/missions';
import { aw } from '../../theme/tokens';
import { CornerBracket } from '../primitives/CornerBracket';

interface DiffGroup {
  criterion: string;
  files: { path: string; additions: number; deletions: number }[];
  summary: string;
}

function buildDiffGroups(mission: Mission): DiffGroup[] {
  // Stub diff groups based on acceptance criteria
  if (mission.id === 'MSN-001') {
    return [
      {
        criterion: 'All /api/v2/* routes require valid JWT',
        files: [
          { path: 'src/middleware/auth.ts', additions: 42, deletions: 8 },
          { path: 'src/auth/pkce.ts', additions: 87, deletions: 0 },
          { path: 'src/routes/v2/index.ts', additions: 6, deletions: 3 },
        ],
        summary:
          'Added JWT validation middleware and PKCE flow. Route guards updated to check Bearer token instead of session cookie.',
      },
      {
        criterion: 'Refresh token rotation with max 5s window',
        files: [
          { path: 'src/auth/refresh.ts', additions: 54, deletions: 0 },
          { path: 'src/auth/token-store.ts', additions: 28, deletions: 0 },
        ],
        summary:
          'Implemented token rotation with sliding window. Old tokens accepted for 5s after rotation to handle in-flight requests.',
      },
      {
        criterion: 'Existing admin sessions continue to work',
        files: [{ path: 'src/middleware/admin-auth.ts', additions: 0, deletions: 0 }],
        summary:
          'No changes to admin auth middleware. Admin routes continue using session cookies independently.',
      },
      {
        criterion: 'E2E login flow completes in <2s on 3G',
        files: [{ path: 'src/auth/pkce.ts', additions: 0, deletions: 0 }],
        summary: 'Browser test confirms 1.8s on simulated 3G. No optimization needed.',
      },
    ];
  }
  return mission.acceptanceCriteria.map((c) => ({
    criterion: c,
    files: [{ path: 'src/placeholder.ts', additions: 10, deletions: 2 }],
    summary: 'Changes aligned with criterion.',
  }));
}

export function DiffByIntent({ mission }: { mission: Mission }) {
  const groups = buildDiffGroups(mission);

  return (
    <div className="space-y-4">
      <div className="aw-micro text-[8px]" style={{ color: aw.textSoft }}>
        DIFF BY INTENT — {groups.length} groups
      </div>

      {groups.map((group, i) => (
        <div key={i} className="relative border p-4" style={{ borderColor: aw.lineDark }}>
          <CornerBracket side="left" />
          <CornerBracket side="right" />

          <div className="aw-section text-[10px]" style={{ color: aw.textStrong }}>
            {group.criterion}
          </div>

          <div className="mt-2 space-y-1">
            {group.files.map((file) => (
              <div key={file.path} className="flex items-center gap-2 font-mono text-[8px]">
                <span style={{ color: aw.text }}>{file.path}</span>
                {file.additions > 0 && <span style={{ color: '#5a8a5a' }}>+{file.additions}</span>}
                {file.deletions > 0 && (
                  <span style={{ color: aw.accentStrong }}>-{file.deletions}</span>
                )}
              </div>
            ))}
          </div>

          <div
            className="aw-body mt-2 border-t pt-2 text-[9px]"
            style={{ borderColor: aw.lineFaint, color: aw.text }}
          >
            {group.summary}
          </div>
        </div>
      ))}
    </div>
  );
}
