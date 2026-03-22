import type { LucideIcon } from 'lucide-react';
import { aw } from '../../theme/tokens';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-8 w-8 mb-3" style={{ color: aw.lineDark }} />
      <div className="aw-section" style={{ color: aw.textSoft }}>
        {title}
      </div>
      <div className="aw-body mt-1 max-w-[280px]" style={{ color: aw.textSoft }}>
        {description}
      </div>
    </div>
  );
}
