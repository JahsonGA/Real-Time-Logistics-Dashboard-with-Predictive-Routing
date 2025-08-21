const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logsDir = path.join(__dirname, 'logs');
fs.mkdirSync(logsDir, { recursive: true });

const consoleFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${rest}`;
  })
);

const fileJsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json() // one JSON object per line
);

// Raw API snapshots
const loggerRaw = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join(logsDir, 'shippo_raw.json'),
      format: fileJsonFormat,
    }),
  ],
});

// Normalized “pack” records
const loggerNorm = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ format: consoleFormat }),
    new winston.transports.File({
      filename: path.join(logsDir, 'shippo_normalized.json'),
      format: fileJsonFormat,
    }),
  ],
});

module.exports = { loggerRaw, loggerNorm };
