const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nanoid = require('nanoid');
const createError = require('http-errors');
const { env } = require('../config');

const getPasswordHash = (password) => {
  return crypto.createHmac('sha256', env.authSecretKey)
    .update(password)
    .digest('hex');
};

const comparePassword = async (password, hash) => {
  const passwordHash = getPasswordHash(password);

  return (passwordHash === hash);
};

const getJwtToken = (payload) => {
  const token = jwt.sign(payload, env.jwtSecretKey, { expiresIn: env.jwtTokenExpiresIn });
  const refreshToken = nanoid(256);

  return { token, refreshToken };
};

const onlyRoles = (...roles) => {
  return (req, res, next) => {
    const isAccessGranted = req.user && req.user.role && roles.includes(req.user.role);
    if (!isAccessGranted) {
      return next(createError(403, 'Access is denied'));
    }

    next();
  };
};

module.exports = {
  getPasswordHash,
  comparePassword,
  getJwtToken,
  onlyRoles,
};
