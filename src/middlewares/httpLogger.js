const morgan = require('morgan');
const requestLogger = require('../logger/modules/requestLogger');

const getIp = (req) => {
  if (req.headers['x-forwarded-for']) {
    return req.headers['x-forwarded-for'].split(', ')[0];
  }
  return req.connection.remoteAddress.substr(7);
};

module.exports = morgan((tokens, req, res) => {
  if (req.query.token) {
    requestLogger.log({
      level: 'info',
      method: `\x1b[34m${tokens.method(req, res)}\x1b[0m`,
      hostname: req.hostname,
      originalUrl: req.path,
      status: tokens.status(req, res),
      response_time: `${tokens['response-time'](req, res)}ms`,
      user_agent: tokens['user-agent'](req, res),
      ip: getIp(req),
    });
  } else {
    requestLogger.log({
      level: 'info',
      method: `\x1b[34m${tokens.method(req, res)}\x1b[0m`,
      hostname: req.hostname,
      originalUrl: req.originalUrl,
      status: tokens.status(req, res),
      response_time: `${tokens['response-time'](req, res)}ms`,
      user_agent: tokens['user-agent'](req, res),
      ip: getIp(req),
    });
  }
});
