const winston = require('winston');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: process.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    process.NODE_ENV === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, correlationId, level, message }) => {
      return `${timestamp} - ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});
logger.LEVELS = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];

module.exports = logger;
