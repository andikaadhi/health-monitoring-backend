const jwt = require('jsonwebtoken');
const { auth } = require('../config');

const requireAuth = (req, res, next) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) return res.sendStatus(401);

  const [, token] = bearerToken.split(' ');

  return jwt.verify(token, auth.token_jwt_key, (err, payload) => {
    if (err) return res.sendStatus(401);
    req.session = { adminId: payload.admin_id };
    return next();
  });
};

module.exports = requireAuth;
