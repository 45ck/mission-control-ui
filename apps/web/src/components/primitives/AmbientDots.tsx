export function AmbientDots() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.16]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(144,151,154,0.34) 1px, transparent 1px)',
        backgroundSize: '78px 78px',
      }}
    />
  );
}
