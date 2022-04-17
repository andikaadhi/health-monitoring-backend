const Db = require('../../models/admin');
const { createPassword, createHash, hashPassword, createToken } = require('./utils');

const createAdminToken = async (email, password) => {
  const admin = await Db.getAdminAuth(email);

  if (!admin) return { type: 'error', code: 'Unauthorized' };

  const inputPassHash = hashPassword(password, admin.salt);

  if (inputPassHash !== admin.hashed_password) return { type: 'error', code: 'Unauthorized' };

  const token = await createToken({ adminId: admin.admin_id });

  return { type: 'success', code: 'Success', token };
};

const createAdmin = async ({ email, name, password }) => {
  const adminPass = password || createPassword(8);

  const { salt, hash } = createHash(adminPass);

  await Db.createAdmin({ email, name, salt, hashedPassword: hash });

  return { password: adminPass };
};

module.exports = {
  createAdmin,
  createAdminToken,
};
