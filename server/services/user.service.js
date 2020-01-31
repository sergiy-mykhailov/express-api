const createError = require('http-errors');
const { models } = require('../models');

const findOneOrFail = async (where = null, attributes = null) => {
  if (!where) {
    throw createError(404, 'User not found');
  }

  const result = await models.user.findOne({
    where,
    attributes,
    raw: true,
  });

  if (result) {
    return result;
  }

  throw createError(404, 'User not found');
};

module.exports = {
  findOneOrFail,
};
