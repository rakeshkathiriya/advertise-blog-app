export const HTTP_OK = 200;
export const HTTP_OK_2 = 201;

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
