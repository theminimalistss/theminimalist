import { useSound } from '@/hooks/useSound';

export function SoundToggle() {
  const { enabled, supported, toggle } = useSound();
  if (!supported) return null;
  return (
    <button
      className="sound-toggle"
      aria-pressed={enabled}
      onClick={toggle}
      data-sound="off"
      title={enabled ? 'Turn sound off' : 'Turn sound on'}
    >
      <span className="sound-bars" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="sound-label">Sound</span>
    </button>
  );
}
