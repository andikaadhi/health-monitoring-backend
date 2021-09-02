const { db } = require('../config');

// eslint-disable-next-line import/order
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    database: db.database,
  },
});

module.exports = knex;
