import winston, { format, Logform, Logger } from 'winston';

const enumerateErrorFormat = winston.format((info: Logform.TransformableInfo) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger: Logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',

  format: format.combine(
    enumerateErrorFormat(),
    process.env.NODE_ENV === 'development' ? format.colorize() : format.uncolorize(),
    format.splat(),
    format.printf(({ level, message }: Logform.TransformableInfo) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

export default logger;

// Usage: // logger.info("Hello!"); // logger.error(new Error("Oops!")); // logger.debug("Debugging info"); // logger.silly("Silly log message"); // logger.verbose("Verbose log message"); // logger.http("HTTP log message"); // logger.warn("Warning message"); // logger.log("info", "Another info message");
