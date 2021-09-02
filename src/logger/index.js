const { createLogger, format, transports } = require('winston');

const { combine, timestamp, json } = format;

/**
 * @description Generalized logging handle all unspecify log.
 */
const logger = createLogger({
  format: combine(timestamp(), json()),
  transports: [new transports.Console()],
});

module.exports = logger;
