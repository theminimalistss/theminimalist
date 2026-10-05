import { LOTUS_MARK } from '@/constants/brand';

export function LotusMark({ className }: { className?: string }) {
  const { x, y, width, height } = LOTUS_MARK.viewBox;
  return (
    <svg
      className={className}
      viewBox={`${x} ${y} ${width} ${height}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={LOTUS_MARK.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {LOTUS_MARK.paths.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
