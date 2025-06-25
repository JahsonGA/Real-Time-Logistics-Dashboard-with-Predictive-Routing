const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // log everything at 'info' level and above
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // log to terminal
    new winston.transports.File({ filename: 'bus_polling.log' }) // log to a file
  ],
});

module.exports = logger;