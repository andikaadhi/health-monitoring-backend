const cors = require('cors');

const whitelist = process.env.FRONTEND_HOST.split(',');
module.exports = cors({
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
});
