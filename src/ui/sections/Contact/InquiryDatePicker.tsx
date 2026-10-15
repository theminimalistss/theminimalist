import { useId } from 'react';
import { useDatePicker } from '@/hooks/useDatePicker';
import { Icon } from '@/ui/components/Icon';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type Props = {
  id: string;
  value: string;
  min: string;
  invalid?: boolean;
  describedBy?: string | undefined;
  onChange: (value: string) => void;
};

export function InquiryDatePicker({ id, value, min, invalid, describedBy, onChange }: Props) {
  const panelId = useId();
  const {
    open,
    monthLabel,
    selectionLabel,
    weeks,
    triggerRef,
    dialogRef,
    show,
    close,
    select,
    previousDisabled,
    previousMonth,
    nextMonth,
    onKeyDown,
  } = useDatePicker(value, min, onChange);

  return (
    <div className="inquiry-date">
      <input type="hidden" name="date" value={value} />
      <button
        id={id}
        ref={triggerRef}
        type="button"
        name="date"
        className="inquiry-date-trigger"
        data-placeholder={!value ? '' : undefined}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-invalid={invalid || undefined}
        aria-describedby={[`${panelId}-selection`, describedBy].filter(Boolean).join(' ')}
        onClick={show}
      >
        <Icon name="calendar" />
        <span id={`${panelId}-selection`}>{selectionLabel}</span>
        <Icon name="chevron" className="inquiry-date-chevron" />
      </button>
      <dialog
        id={panelId}
        ref={dialogRef}
        className="inquiry-calendar"
        aria-label="Choose a day"
        aria-modal="true"
        aria-describedby={`${panelId}-help`}
        onKeyDown={onKeyDown}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        <p className="eyebrow inquiry-calendar-eyebrow">Make time for an idea</p>
        <div className="inquiry-calendar-head">
          <h3 id={`${panelId}-month`} aria-live="polite" aria-atomic="true">
            {monthLabel}
          </h3>
          <div>
            <button
              type="button"
              aria-label="Previous month"
              disabled={previousDisabled}
              onClick={previousMonth}
            >
              <Icon name="chevron" className="inquiry-calendar-previous" />
            </button>
            <button type="button" aria-label="Next month" onClick={nextMonth}>
              <Icon name="chevron" />
            </button>
          </div>
        </div>
        <p className="sr-only" id={`${panelId}-help`}>
          Use arrow keys to move by day or week, Page Up and Page Down to change month. Enter
          selects a day. Escape closes the calendar.
        </p>
        <table role="grid" aria-labelledby={`${panelId}-month`}>
          <thead>
            <tr>
              {WEEKDAYS.map((day, index) => (
                <th key={day} scope="col" abbr={DAY_NAMES[index]}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, index) => (
              <tr key={index}>
                {week.map((date, column) => (
                  <td key={column} aria-selected={date?.selected}>
                    {date && (
                      <button
                        type="button"
                        data-date={date.value}
                        data-selected={date.selected ? '' : undefined}
                        aria-label={date.label}
                        aria-current={date.today ? 'date' : undefined}
                        disabled={date.disabled}
                        tabIndex={date.tabIndex}
                        onClick={() => select(date.value)}
                      >
                        {date.day}
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="inquiry-calendar-foot">
          <button type="button" onClick={() => select(min)}>
            Today
          </button>
          <span>A preferred date, not a booking.</span>
          <button type="button" aria-label="Close calendar" onClick={close}>
            <Icon name="close" />
          </button>
        </div>
      </dialog>
    </div>
  );
}
