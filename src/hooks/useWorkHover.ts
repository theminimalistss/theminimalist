import { useEffect, useRef, useState } from 'react';

export function useWorkHover() {
  const [index, setIndex] = useState<number | null>(null);
  const [active, setActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hold = () => {
    if (timer.current) clearTimeout(timer.current);
  };
  const reveal = (next: number) => {
    hold();
    setIndex(next);
    setActive(true);
  };
  const dismiss = () => {
    hold();
    setActive(false);
  };
  const leave = () => {
    hold();
    timer.current = setTimeout(() => setActive(false), 240);
  };
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return { index, active, reveal, dismiss, hold, leave };
}
