import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useDialog } from '@/hooks/useDialog';
import {
  calendarDate,
  calendarDayLabel,
  calendarMonthLabel,
  calendarSelectionLabel,
  calendarWeeks,
  monthValue,
  moveCalendarDate,
} from '@/services/calendar.service';

export function useDatePicker(value: string, min: string, onChange: (value: string) => void) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(value || min);
  const month = monthValue(focused);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useDialog(open);
  const close = () => setOpen(false);
  const show = () => {
    const next = value >= min ? value : min;
    setFocused(next);
    triggerRef.current?.focus({ preventScroll: true });
    setOpen(true);
  };
  const focusDate = (next: string) => {
    const allowed = next < min ? min : next;
    setFocused(allowed);
  };
  const select = (next: string) => {
    onChange(next);
    close();
  };

  useLayoutEffect(() => {
    if (!open) return;
    dialogRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus();
  }, [open, focused, month, dialogRef]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    if (!open || !dialog || !trigger) return;
    const position = () => {
      const anchor = trigger.getBoundingClientRect();
      const panel = dialog.getBoundingClientRect();
      const left = Math.max(16, Math.min(anchor.left, innerWidth - panel.width - 16));
      const below = anchor.bottom + 8;
      const top = below + panel.height <= innerHeight - 16 ? below : anchor.top - panel.height - 8;
      dialog.style.left = `${left}px`;
      dialog.style.top = `${Math.max(16, Math.min(top, innerHeight - panel.height - 16))}px`;
    };
    const outside = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      const bounds = dialog.getBoundingClientRect();
      const inside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;
      if (!inside && !trigger.contains(event.target)) {
        event.preventDefault();
        setOpen(false);
      }
    };
    position();
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    document.addEventListener('pointerdown', outside);
    return () => {
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
      document.removeEventListener('pointerdown', outside);
    };
  }, [open, month, dialogRef]);

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'Tab') {
      // Also trap focus in the native-dialog fallback for older engines.
      const buttons = Array.from(
        dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [],
      ).filter((button) => button.tabIndex >= 0);
      const last = buttons[buttons.length - 1];
      const edge = event.shiftKey ? buttons[0] : last;
      if (document.activeElement === edge) {
        event.preventDefault();
        (event.shiftKey ? last : buttons[0])?.focus();
      }
      return;
    }
    if (!(event.target instanceof HTMLElement) || !event.target.dataset.date) return;
    let next: string;
    switch (event.key) {
      case 'ArrowLeft':
        next = moveCalendarDate(focused, -1);
        break;
      case 'ArrowRight':
        next = moveCalendarDate(focused, 1);
        break;
      case 'ArrowUp':
        next = moveCalendarDate(focused, -7);
        break;
      case 'ArrowDown':
        next = moveCalendarDate(focused, 7);
        break;
      case 'Home':
        next = moveCalendarDate(focused, -calendarDate(focused).getDay());
        break;
      case 'End':
        next = moveCalendarDate(focused, 6 - calendarDate(focused).getDay());
        break;
      case 'PageUp':
        next = moveCalendarDate(focused, 0, -1);
        break;
      case 'PageDown':
        next = moveCalendarDate(focused, 0, 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    focusDate(next);
  };

  return {
    open,
    triggerRef,
    dialogRef,
    show,
    close,
    select,
    onKeyDown,
    monthLabel: calendarMonthLabel(month),
    selectionLabel: value ? calendarSelectionLabel(value) : 'Choose a day',
    previousDisabled: month <= monthValue(min),
    previousMonth: () => focusDate(moveCalendarDate(focused, 0, -1)),
    nextMonth: () => focusDate(moveCalendarDate(focused, 0, 1)),
    weeks: calendarWeeks(month).map((week) =>
      week.map((date) =>
        date
          ? {
              value: date,
              label: calendarDayLabel(date),
              day: Number(date.slice(-2)),
              selected: date === value,
              today: date === min,
              disabled: date < min,
              tabIndex: date === focused ? 0 : -1,
            }
          : null,
      ),
    ),
  };
}
