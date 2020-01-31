const createError = require('http-errors');
const { models } = require('../models');
const { findOneOrFail: findOneUserOrFail } = require('../services/user.service');

const getUserList = async (req, res, next) => {
  try {
    const oprions = {
      raw: true,
      attributes: {
        exclude: ['password', 'token', 'refreshToken'],
      },
    };

    if (Object.prototype.hasOwnProperty.call(req.query, 'limit')) {
      oprions.limit = req.query.limit;
    }
    if (Object.prototype.hasOwnProperty.call(req.query, 'offset')) {
      oprions.offset = req.query.offset;
    }

    const data = await models.user.findAndCountAll(oprions);

    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id !== req.user.id) {
      throw createError(403, 'Access is denied');
    }

    const data = await findOneUserOrFail({ id }, {
      exclude: ['password', 'token', 'refreshToken'],
    });

    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserList,
  getUserDetails,
};
