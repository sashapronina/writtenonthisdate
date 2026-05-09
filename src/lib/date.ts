export function toDayKey(month: number, day: number): string {
  return `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function toDateKey(date: Date): string {
  return toDayKey(date.getMonth() + 1, date.getDate())
}

export function shiftByDays(date: Date, delta: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + delta)
  return next
}

/** Local midnight for the calendar day of `date` — use when comparing “which day” instead of clock time. */
export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0
}

/** Number of local-calendar days from 1970-01-01 (that date = 0). Consecutive dates always differ by 1. */
function localDaysSince1970Jan1(date: Date): number {
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()
  const monthLengths = isLeapYear(y)
    ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let days = 0
  for (let yr = 1970; yr < y; yr++) days += isLeapYear(yr) ? 366 : 365
  for (let mm = 0; mm < m; mm++) days += monthLengths[mm]
  days += d - 1
  return days
}

/**
 * Mobile sheet tilt: strictly alternates sign by calendar day (even index → clockwise, odd → counter).
 */
export function mobilePoemSheetTiltDeg(date: Date): number {
  const idx = localDaysSince1970Jan1(date)
  const sign = idx % 2 === 0 ? 1 : -1
  const mag = 0.4
  return sign * mag
}
