import { describe, expect, it } from 'vitest';
import { calendarWeeks, moveCalendarDate } from './calendar.service';

describe('appointment calendar dates', () => {
  it('clamps month navigation to the last available day, including leap years', () => {
    expect(moveCalendarDate('2028-01-31', 0, 1)).toBe('2028-02-29');
    expect(moveCalendarDate('2027-03-31', 0, -1)).toBe('2027-02-28');
    expect(moveCalendarDate('2026-12-31', 0, 1)).toBe('2027-01-31');
  });
  it('moves across month/year boundaries without changing the local calendar day', () => {
    expect(moveCalendarDate('2026-12-31', 1)).toBe('2027-01-01');
    expect(moveCalendarDate('2026-03-08', 7)).toBe('2026-03-15');
  });
  it('aligns weeks to Sunday and includes each valid day only once', () => {
    const weeks = calendarWeeks('2028-02-01');
    expect(weeks[0]?.slice(0, 2)).toEqual([null, null]);
    const dates = weeks.flat().filter(Boolean);
    expect(dates).toHaveLength(29);
    expect(new Set(dates).size).toBe(29);
    expect(dates[0]).toBe('2028-02-01');
    expect(dates[28]).toBe('2028-02-29');
    expect(weeks.every((week) => week.length === 7)).toBe(true);
  });
});
