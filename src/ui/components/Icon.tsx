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
    | 'sprig';
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
