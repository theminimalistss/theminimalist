import { useLogoDoodle } from '@/hooks/useLogoDoodle';
import { ROUTES } from '@/router/paths';
import { LotusMark } from '@/ui/components/LotusMark';
import { PageLink } from '@/ui/components/PageLink';

const DOODLE = 'studio-logo-doodle';
const POP = [
  'M0.0 -30.0Q3.0 -37.0 0.0 -44.0',
  'M23.6 -18.5Q31.0 -20.4 34.7 -27.1',
  'M-23.6 -18.5Q-27.3 -25.1 -34.7 -27.1',
  'M29.1 7.3Q35.2 11.9 42.7 10.6',
  'M-29.1 7.3Q-36.6 6.0 -42.7 10.6',
];

export function StudioLogo() {
  const markRef = useLogoDoodle<HTMLSpanElement>(DOODLE);
  return (
    <PageLink
      className="studio-logo"
      to={ROUTES.home}
      aria-label="The Minimalist Design Studio — Home"
    >
      <span ref={markRef} className="studio-logo-mark">
        <LotusMark className="studio-mark" />
        <svg className="studio-logo-pop" viewBox="-50 -50 100 100" aria-hidden="true">
          {POP.map((stroke) => (
            <path key={stroke} d={stroke} pathLength={1} />
          ))}
        </svg>
        <svg className="studio-logo-filter" aria-hidden="true">
          <filter id={DOODLE}>
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="1" seed="1" />
            <feDisplacementMap in="SourceGraphic" scale="0" />
          </filter>
        </svg>
      </span>
      <span className="studio-logo-type">
        THE MINIMALIST<span>DESIGN STUDIO</span>
      </span>
    </PageLink>
  );
}
