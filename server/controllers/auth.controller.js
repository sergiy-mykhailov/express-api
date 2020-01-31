const createError = require('http-errors');

const { models, Sequelize: { Op } } = require('../models');
const { getPasswordHash, getJwtToken } = require('../utils/auth');

const register = async (req, res, next) => {
  try {
    const { username, password: passwordRaw, email } = req.body;

    const existingUser = await models.user.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
      raw: true,
    });
    if (existingUser) {
      return next(createError(409, 'Username or Email already exists'));
    }

    const passwordHash = await getPasswordHash(passwordRaw);
    if (!passwordHash) {
      return next(createError(400, 'Password is incorrect or empty'));
    }

    const newUser = {
      ...req.body,
      password: passwordHash,
    };

    const user = await models.user.create(newUser, {
      returning: true,
    });
    const { password, token, refreshToken, ...data } = user.get();

    res.status(201).send(data);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const payload = {
      sub: req.user.id,
      name: req.user.username,
      role: req.user.role,
    };
    const tokenData = getJwtToken(payload);

    const [affectedRows, [affectedData]] = await models.user.update({ ...tokenData }, {
      where: { id: req.user.id },
      returning: true,
    });

    if (!affectedRows) {
      return next(createError(401, 'Login or password is incorrect'));
    }

    const { password, ...data } = affectedData.get();

    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const [affectedRows] = await models.user.update({
      token: null,
      refreshToken: null,
    }, {
      where: { id: req.user.id },
      returning: true,
    });

    if (!affectedRows) {
      return next(createError(401));
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
};
