import { addDays, addMonths, format, subDays, subMonths } from 'date-fns';

const parseFlexibleDate = (dateStrOrDate: string | Date): Date => {
  if (dateStrOrDate instanceof Date) return dateStrOrDate;
  const s = String(dateStrOrDate);

  // if format like DD/MM/YYYY
  if (s.includes('/') && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    const [day, month, year] = s.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  // fallback: let Date parse ISO / other formats
  return new Date(s);
};

const toISTDate = (dateInput: string | Date): Date => {
  const parsed = parseFlexibleDate(dateInput);
  // toLocaleString will produce a string in the target timezone's local format,
  // then we re-parse it to a Date object in the runtime local timezone but with the IST wall-clock.
  const istStr = parsed.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  return new Date(istStr);
};

const startOfDayLocal = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export const getRemainingDays = (expiredDate: string): string => {
  const istExpired = startOfDayLocal(toISTDate(expiredDate));
  const istToday = startOfDayLocal(toISTDate(new Date()));
  const diffMs = istExpired.getTime() - istToday.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const remaining = Math.max(0, diffDays);
  return `${remaining} days`;
};

export const getStatus = (expiredDate: string): 'Active' | 'InActive' => {
  const istExpired = startOfDayLocal(toISTDate(expiredDate));
  const istToday = startOfDayLocal(toISTDate(new Date()));
  // treat expiry on the same day as Active. Use '>' if you want same-day => InActive.
  return istExpired >= istToday ? 'Active' : 'InActive';
};

export const DATE_FORMATS = {
  ISO: 'yyyy-MM-dd',
  DISPLAY: 'MMM dd, yyyy',
  SHORT: 'MM/dd/yyyy',
  SHORT_US: 'M/d/yyyy',
  LONG: 'MMMM dd, yyyy',
  TIME: 'HH:mm:ss',
  TIME_12H: 'hh:mm:ss a',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
  DATETIME_PIPE: 'yyyy-MM-dd | hh:mm:ss a',
  DATETIME_12H: 'yyyy-MM-dd hh:mm:ss a',
  COMPACT: 'yyyyMMdd',
  READABLE: 'EEEE, MMMM dd, yyyy',
  UTCDATETIME: 'yyyy-MM-dd HH:mm',
  US_DATETIME: 'M/d/yyyy h:mm:ss a',
  US_DATETIME_FULL: 'MM/dd/yyyy HH:mm',
  US_DATETIME_WITH_SECONDS: 'MM/dd/yyyy hh:mm:ss a',
  INTL_DATE: 'yyyy/MM/dd',
  INTL_DATETIME: 'yyyy/MM/dd hh:mm:ss a',
} as const;

export const dateUtils = {
  // Format constants
  formats: DATE_FORMATS,

  // Current date in different formats
  today: () => format(new Date(), DATE_FORMATS.ISO),
  todayDisplay: () => format(new Date(), DATE_FORMATS.DISPLAY),
  todayLong: () => format(new Date(), DATE_FORMATS.LONG),
  now: () => new Date(),
  nowISO: () => format(new Date(), DATE_FORMATS.ISO),
  nowDateTime: () => format(new Date(), DATE_FORMATS.DATETIME),
  nowDateTimePipe: () => format(new Date(), DATE_FORMATS.DATETIME_PIPE),
  nowUTC: () => format(new Date(), DATE_FORMATS.UTCDATETIME),
  datetime_12h: () => format(new Date(), DATE_FORMATS.DATETIME_12H),

  // Previous periods (your current use case)
  prevMonth: () => format(addDays(subMonths(new Date(), 1), 1), DATE_FORMATS.ISO),
  prevWeek: () => format(subDays(new Date(), 7), DATE_FORMATS.ISO),
  yesterday: () => format(subDays(new Date(), 1), DATE_FORMATS.ISO),

  // Next periods
  nextMonth: () => format(addDays(addMonths(new Date(), 1), 1), DATE_FORMATS.ISO),
  nextWeek: () => format(addDays(new Date(), 7), DATE_FORMATS.ISO),
  tomorrow: () => format(addDays(new Date(), 1), DATE_FORMATS.ISO),
};
