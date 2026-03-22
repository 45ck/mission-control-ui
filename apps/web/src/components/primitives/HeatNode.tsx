import { semantic } from '../../theme/tokens';

interface HeatNodeProps {
  intensity: 'low' | 'medium' | 'high' | 'critical';
  size?: number;
}

const colorMap: Record<HeatNodeProps['intensity'], string> = {
  low: semantic.info,
  medium: semantic.warning,
  high: semantic.error,
  critical: semantic.error,
};

export function HeatNode({ intensity, size = 32 }: HeatNodeProps) {
  const color = colorMap[intensity];
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={r} cy={r} r={r} fill={color} opacity={0.1} />
      <circle cx={r} cy={r} r={r * 0.72} fill={color} opacity={0.24} />
      <circle cx={r} cy={r} r={r * 0.48} fill={color} opacity={0.56} />
      <circle cx={r} cy={r} r={r * 0.24} fill={color} />
    </svg>
  );
}
