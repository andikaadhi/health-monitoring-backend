const { createLogger, format, transports } = require('winston');

const { combine, printf } = format;

const requestFormat = printf(
  ({ level, label, timestamp, ...info }) =>
    `${timestamp} ${label} [${level}] : ${info.ip} ${info.status} ${info.method} ${info.hostname} ${info.originalUrl} ${info.response_time} ${info.user_agent}`
);

/**
 * @description Log all endpoint requested from client.
 */
const requestLogger = createLogger({
  format: combine(
    format.label({ label: 'Req' }),
    format.colorize(),
    format.timestamp(),
    format.align(),
    requestFormat
  ),
  transports: [new transports.Console()],
});
module.exports = requestLogger;
