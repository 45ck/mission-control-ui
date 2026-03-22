import { aw } from '../../theme/tokens';

export function PanelPins() {
  return (
    <>
      <div
        className="absolute left-0 top-0 h-[10px] w-px"
        style={{ backgroundColor: aw.lineInk }}
      />
      <div
        className="absolute left-0 top-0 h-px w-[10px]"
        style={{ backgroundColor: aw.lineInk }}
      />
      <div
        className="absolute right-0 top-0 h-[10px] w-px"
        style={{ backgroundColor: aw.lineInk }}
      />
      <div
        className="absolute right-0 top-0 h-px w-[10px]"
        style={{ backgroundColor: aw.lineInk }}
      />
    </>
  );
}
