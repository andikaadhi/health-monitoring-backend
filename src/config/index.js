require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  auth: {
    token_jwt_key: process.env.AUTH_TOKEN_JWT_KEY,
  },
};
