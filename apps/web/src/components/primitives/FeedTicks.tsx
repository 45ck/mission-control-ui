import { aw } from '../../theme/tokens';

export function FeedTicks() {
  return (
    <div className="absolute right-0 top-0 flex gap-[3px] px-[10px] pt-[8px] opacity-70">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-[3px] w-[12px] animate-[feedTickPulse_2s_ease-in-out_infinite]"
          style={{
            backgroundColor: aw.accentSoft,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}
