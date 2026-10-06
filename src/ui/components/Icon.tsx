type Props = {
  name:
    | 'arrow'
    | 'close'
    | 'pause'
    | 'play'
    | 'grid'
    | 'spiral'
    | 'menu'
    | 'leaf'
    | 'sun'
    | 'diamond'
    | 'sprig'
    | 'plus'
    | 'facebook'
    | 'instagram'
    | 'linkedin'
    | 'tiktok'
    | 'behance';
  className?: string;
};

const paths = {
  arrow: <path d="M5 19 19 5M5 5h14v14" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  pause: (
    <>
      <path d="M8 5v14M16 5v14" />
    </>
  ),
  play: <path d="m8 5 11 7-11 7Z" />,
  grid: (
    <>
      <rect x="4" y="4" width="5" height="5" />
      <rect x="15" y="4" width="5" height="5" />
      <rect x="4" y="15" width="5" height="5" />
      <rect x="15" y="15" width="5" height="5" />
    </>
  ),
  spiral: (
    <path d="M12 12c0-1.5 2.5-2.4 3.8-1 2 2.2-.7 5.8-4.4 4.4-5.8-2.2-3.2-9.5 2.6-9.2 7.5.4 9.1 9 3.3 13.3C11.8 23.6 2 19.6 2 12.1 2 5.4 7.4 1.8 12.5 2" />
  ),
  menu: <path d="M3 8h18M9 16h12" />,
  plus: <path d="M12 5v14M5 12h14" />,
  facebook: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 7.5h-1.4A2.6 2.6 0 0 0 11 10.1V21M8.5 13h5.6" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.5" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M8 10.5V16M8 7.6v.2M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6V16" />
    </>
  ),
  tiktok: <path d="M13.5 4v10.6a3.4 3.4 0 1 1-3.4-3.4M13.5 4c.5 2.5 2.2 4.1 4.8 4.3" />,
  behance: (
    <path d="M3.5 6.5h4.6a2.6 2.6 0 0 1 0 5.2H3.5Zm0 5.2h5.1a2.9 2.9 0 0 1 0 5.8H3.5ZM14.5 7.5h4.6M14 14h6.4a3.2 3.2 0 1 0-1 2.4" />
  ),
  leaf: <path d="M12 21C6.5 16.5 6.5 8 12 3c5.5 5 5.5 13.5 0 18Zm0 0v-9" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </>
  ),
  diamond: <path d="M7 4h10l4 5-9 11L3 9Zm-4 5h18m-9 11L9 9l3-5 3 5Z" />,
  sprig: (
    <path d="M4 21C9 16 14 10 19 3M8 17c-3 0-4.5-1.5-4.5-4 2.5 0 4.5 1.5 4.5 4Zm3-4c0-2.5 1.5-4.5 4.5-4.5 0 2.5-1.5 4.5-4.5 4.5Zm-1-1.5C7 11.5 5.5 10 5.5 7.5c2.5 0 4.5 1.5 4.5 4Zm4-5C14 4 15.5 2.5 18 2.5 18 5 16.5 6.5 14 6.5Z" />
  ),
};

export function Icon({ name, className }: Props) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
