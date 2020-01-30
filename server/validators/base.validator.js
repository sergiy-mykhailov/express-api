/* eslint-disable newline-per-chained-call */

const { body, query, param, validationResult } = require('express-validator');
const createError = require('http-errors');
const { extractFields } = require('../utils/common');

const getValidationErrors = (errors) => {
  return createError(422, 'Validation error', { errors });
};

const idValidator = (key) => {
  return async (req, res, next) => {
    await param(key)
      .not().isEmpty().withMessage(`'${key}' cannot be empty`)
      .isUUID(4).withMessage(`'${key}' must be valid UUID v4`)
      .run(req);

    const result = validationResult(req);

    if (result.isEmpty()) {
      return next();
    }

    next(getValidationErrors(result.array()));
  };
};

const payloadFieldsFilter = (fields, parent) => {
  return async (req, res, next) => {
    if (parent === '*') {
      await body()
        .isArray({ min: 1 })
        .withMessage('Must be an array')
        .run(req);
    } else {
      await body()
        .custom((values) => {
          return (Object.keys(values).length > 0);
        })
        .withMessage('Payload cannot be empty')
        .run(req);
    }

    await body(parent)
      .customSanitizer((values) => {
        return extractFields(values, fields);
      })
      .run(req);

    const result = validationResult(req);

    if (result.isEmpty()) {
      return next();
    }

    return next(getValidationErrors(result.array()));
  };
};

const paginationValidator = async (req, res, next) => {
  await query('limit')
    .optional()
    .isInt({ min: 1 }).withMessage('Must be an integer')
    .toInt()
    .run(req);

  await query('offset')
    .optional()
    .isInt({ min: 0 }).withMessage('Must be an integer')
    .toInt()
    .run(req);

  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return next(getValidationErrors(result.array()));
};

module.exports = {
  getValidationErrors,
  idValidator,
  payloadFieldsFilter,
  paginationValidator,
};
