const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { auth } = require('../../config');

const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';

exports.createPassword = (length = 8) => {
  let password = '';
  for (let i = 0; i <= length; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  return password;
};

exports.hashPassword = (password, salt) =>
  CryptoJS.PBKDF2(password, salt, {
    keySize: 128 / 32,
  }).toString();

exports.createHash = (password) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const hash = this.hashPassword(password, salt);

  return { salt, hash };
};

exports.createToken = ({ adminId }) =>
  new Promise((resolve, reject) => {
    jwt.sign({ admin_id: adminId }, auth.token_jwt_key, (err, token) => {
      if (err) return reject(err);
      return resolve(token);
    });
  });
