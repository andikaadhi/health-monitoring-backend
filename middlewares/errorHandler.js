const { errLogger } = require('../logger/modules/errorLogger');
/**
 * @description Express middleware unexpected and response 500 http error
 * @param {*} err error object passed
 * @param {*} req express request object
 * @param {*} res express response object
 * @param {*} next
 */
module.exports = (err, req, res) => {
  try {
    if (err)
      errLogger.error({
        type: 'error',
        message: err.message,
        stack: err.stack,
      });
  } catch (error) {
    errLogger.error({
      type: 'error',
      message: error.message,
      stack: error.stack,
    });
  }
  res.sendStatus(500);
};
