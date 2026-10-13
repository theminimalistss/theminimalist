import { useId } from 'react';
import { useStudioSprig } from '@/hooks/useStudioSprig';

const LEAVES = [
  {
    path: 'M56 126C34 128 22 115 18 97C40 94 55 109 56 126Z',
    vein: 'M56 126Q39 116 26 103',
    origin: '56px 126px',
  },
  {
    path: 'M56 147C79 146 95 134 101 113C78 110 59 128 56 147Z',
    vein: 'M56 147Q78 131 94 118',
    origin: '56px 147px',
  },
] as const;

const PETALS = [
  'M62 83C37 95 12 82 8 60C31 52 51 64 62 83Z',
  'M62 83C87 95 112 82 116 60C93 52 73 64 62 83Z',
  'M62 80C38 81 24 61 23 38C46 38 62 58 62 80Z',
  'M62 80C86 81 100 61 101 38C78 38 62 58 62 80Z',
  'M62 80C44 61 43 40 62 18C81 40 80 61 62 80Z',
] as const;

export function StudioSprig() {
  const filterId = `studio-sprig-${useId().replace(/:/gu, '')}`;
  const ref = useStudioSprig(filterId);
  return (
    <div ref={ref} className="studio-manifesto-mark" aria-hidden="true">
      <svg
        viewBox="0 0 124 184"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="1" seed="1" />
            <feDisplacementMap in="SourceGraphic" scale="0" />
          </filter>
        </defs>
        <g data-sprig-response="" className="studio-sprig-stem">
          <g data-sprig-stem="" className="studio-sprig-stem">
            <path d="M54 174C55 148 52 117 62 87M43 90Q62 98 81 90" />
            {PETALS.map((path) => (
              <g
                key={path}
                data-sprig-petal=""
                className="studio-sprig-leaf"
                style={{ transformOrigin: '62px 83px' }}
              >
                <path d={path} />
              </g>
            ))}
            {LEAVES.map((leaf) => (
              <g
                key={leaf.path}
                data-sprig-leaf=""
                className="studio-sprig-leaf"
                style={{ transformOrigin: leaf.origin }}
              >
                <path d={leaf.path} />
                <path d={leaf.vein} opacity="0.45" />
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
