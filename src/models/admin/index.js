const db = require('../../db');

const createAdmin = ({ email, name, salt, hashedPassword }) =>
  db('admin').insert({ email, name, salt, hashed_password: hashedPassword });

const getAdminAuth = async (email) => {
  const [admin] = await db('admin')
    .where('email', email)
    .select('admin_id', 'hashed_password', 'salt');

  return admin;
};

module.exports = {
  createAdmin,
  getAdminAuth,
};
