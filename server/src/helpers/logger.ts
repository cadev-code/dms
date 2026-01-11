import winston from 'winston';

const env = process.env.NODE_ENV || 'development';

const { combine, printf, timestamp, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const transports =
  env === 'production'
    ? [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'logs/warn.log',
          level: 'warn',
        }),
        new winston.transports.File({
          filename: 'logs/info.log',
          level: 'info',
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
      ]
    : [
        new winston.transports.Console({
          format: combine(colorize(), logFormat),
        }),
      ];

export const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports,
});
