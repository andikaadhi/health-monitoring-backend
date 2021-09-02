const { createLogger, format, transports } = require('winston');

const { combine, printf } = format;

const errFormat = printf(
  ({ level, label, timestamp, ...info }) =>
    `${timestamp} ${label} [${level}] : ${info.name} ${info.message} ${info.stack}`
);

/**
 * @param {String} name
 * @param {String} message
 * @param {String} stack
 */
const errLogger = createLogger({
  format: combine(
    format.label({ label: 'Error' }),
    format.colorize(),
    format.timestamp(),
    format.align(),
    errFormat
  ),
  transports: [new transports.Console()],
});

const emailLogger = createLogger({
  format: combine(format.label({ label: 'Email' }), format.timestamp(), format.json()),
  transports: [new transports.Console()],
});

module.exports = { errLogger, emailLogger };
