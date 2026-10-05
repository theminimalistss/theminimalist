import { Link } from 'react-router';
import { ROUTES } from '@/router/paths';

export function StudioLogo() {
  return (
    <Link
      className="studio-logo"
      to={ROUTES.home}
      aria-label="The Minimalist Independent Design Studio — Home"
    >
      <svg
        className="studio-mark"
        width="34"
        height="40"
        viewBox="0 0 34 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        aria-hidden="true"
      >
        <path d="M17 35V8m0 17C8 23 7 14 9 9c8 3 11 9 8 16Zm0-5c8-2 10-10 8-15-7 3-10 9-8 15ZM17 35C5 34 2 28 2 22c8 0 14 4 15 13Zm0 0c11-1 15-8 15-14-8 1-14 6-15 14Z" />
      </svg>
      <span className="studio-logo-type">
        THE MINIMALIST<span>INDEPENDENT DESIGN STUDIO</span>
      </span>
    </Link>
  );
}
