const monthFormat = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' });
const dayFormat = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});
const shortFormat = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

// Local noon keeps calendar arithmetic independent of UTC and daylight-saving boundaries.
export const calendarDate = (value: string) => new Date(`${value}T12:00:00`);
export const dateValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const monthValue = (value: string) => `${value.slice(0, 7)}-01`;
export const calendarMonthLabel = (value: string) => monthFormat.format(calendarDate(value));
export const calendarDayLabel = (value: string) => dayFormat.format(calendarDate(value));
export const calendarSelectionLabel = (value: string) => shortFormat.format(calendarDate(value));

export function moveCalendarDate(value: string, days: number, months = 0) {
  const date = calendarDate(value);
  if (months) {
    const day = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + months);
    const last = new Date(date.getFullYear(), date.getMonth() + 1, 0, 12).getDate();
    date.setDate(Math.min(day, last));
  }
  date.setDate(date.getDate() + days);
  return dateValue(date);
}

export function calendarWeeks(month: string) {
  const first = calendarDate(monthValue(month));
  const count = new Date(first.getFullYear(), first.getMonth() + 1, 0, 12).getDate();
  const cells = Array.from({ length: Math.ceil((first.getDay() + count) / 7) * 7 }, (_, index) => {
    const day = index - first.getDay() + 1;
    return day < 1 || day > count ? null : `${month.slice(0, 7)}-${String(day).padStart(2, '0')}`;
  });
  return Array.from({ length: cells.length / 7 }, (_, index) =>
    cells.slice(index * 7, index * 7 + 7),
  );
}
