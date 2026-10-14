import { useCallback, useRef, useState, type MouseEvent, type PointerEvent } from 'react';

export function useProductPanels() {
  const [active, setActive] = useState(0);
  const pointer = useRef('mouse');

  const enter = useCallback((index: number, event: PointerEvent) => {
    pointer.current = event.pointerType;
    if (event.pointerType === 'mouse') setActive(index);
  }, []);

  const press = useCallback((event: PointerEvent) => {
    pointer.current = event.pointerType;
  }, []);

  const choose = useCallback(
    (index: number, event: MouseEvent) => {
      if (index === active || pointer.current === 'mouse') return;
      event.preventDefault();
      setActive(index);
    },
    [active],
  );

  return { active, setActive, enter, press, choose };
}
