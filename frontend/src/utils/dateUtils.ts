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
