import { useId, type CSSProperties } from 'react';
import type { InquiryKind } from '@/types/inquiry';

const STAMPS: Record<InquiryKind, string> = {
  general:
    'M0 5C-4 2-6 0-6-2c0-2 2-3.5 4-3 1 .3 2 1.2 2 2 0-.8 1-1.7 2-2 2-.5 4 1 4 3 0 2-2 4-6 7Z',
  quote: 'M0-6v12M-6 0h12',
  appointment: 'M-7-5h14v12h-14ZM-7-1h14M-3-8v4M3-8v4',
};

export function ContactEnvelope({ kind, fill }: { kind: InquiryKind; fill: number }) {
  const clip = `${useId()}-pocket`;
  return (
    <svg
      className="envelope"
      viewBox="0 0 170 120"
      aria-hidden="true"
      style={{ '--fill': fill.toFixed(3) } as CSSProperties}
    >
      <defs>
        <clipPath id={clip} clipPathUnits="userSpaceOnUse">
          <rect x="0" y="-40" width="170" height="150" />
        </clipPath>
      </defs>
      <path className="envelope-trail" d="M70 96 C104 98 130 76 166 30" pathLength="1" />
      <g className="envelope-body">
        <rect className="envelope-back" x="20" y="44" width="120" height="66" rx="2" />
        <path className="envelope-flap envelope-flap--open" d="M20 44 80 12 140 44Z" />
        <g clipPath={`url(#${clip})`}>
          <g className="envelope-letter">
            <rect x="30" y="30" width="100" height="70" rx="1.5" />
            <path d="M42 46h52M42 56h76M42 66h64M42 76h70" />
          </g>
        </g>
        <path className="envelope-pocket" d="M20 110V62l60 26 60-26v48Z" />
        <path className="envelope-seam" d="M20 110 66 82M140 110 94 82" />
        <g transform="translate(121 94)">
          <g className="envelope-stamp" key={kind}>
            <rect x="-11" y="-11" width="22" height="22" rx="1.5" />
            <path d={STAMPS[kind]} />
          </g>
        </g>
        <path className="envelope-flap envelope-flap--closed" d="M20 44 80 78 140 44Z" />
      </g>
      <g className="envelope-plane">
        <path className="envelope-plane-wing" d="M118 52 164 26 148 70 136 58Z" />
        <path d="M164 26 136 58 133 72 143 62" />
      </g>
    </svg>
  );
}
