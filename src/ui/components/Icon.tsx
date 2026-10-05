type Props = {
  name: 'arrow' | 'close' | 'pause' | 'play' | 'grid' | 'spiral' | 'menu';
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
