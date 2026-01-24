import winston from 'winston';
import fs from 'fs';
import path from 'path';

const env = process.env.NODE_ENV || 'development';

const { combine, printf, timestamp, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const logsDir = path.resolve(__dirname, '../../logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const transports =
  env === 'production'
    ? [
        new winston.transports.File({
          filename: path.join(logsDir, 'error.log'),
          level: 'error',
        }),
        new winston.transports.File({
          filename: path.join(logsDir, 'warn.log'),
          level: 'warn',
        }),
        new winston.transports.File({
          filename: path.join(logsDir, 'info.log'),
          level: 'info',
        }),
        new winston.transports.File({
          filename: path.join(logsDir, 'combined.log'),
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
