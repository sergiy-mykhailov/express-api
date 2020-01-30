/* eslint-disable newline-per-chained-call */

const { body, validationResult } = require('express-validator');
const { getValidationErrors } = require('./base.validator');

const registerValidator = async (req, res, next) => {
  await body('username')
    .not().isEmpty().withMessage('Cannot be empty')
    .isString().withMessage('Must be a string')
    .isLength({ min: 3 })
    .trim()
    .run(req);

  await body('email')
    .not().isEmpty().withMessage('Cannot be empty')
    .isEmail().withMessage('Must be valid email')
    .trim()
    .run(req);

  await body('password')
    .not().isEmpty().withMessage('Cannot be empty')
    .isString().withMessage('Must be a string')
    .isLength({ min: 3 })
    .trim()
    .run(req);

  await body('confirmPassword')
    .not().isEmpty().withMessage('Cannot be empty')
    .isString().withMessage('Must be a string')
    .trim()
    .custom((value, { req: request }) => {
      return (value === request.body.password);
    }).withMessage('Password confirmation does not match password')
    .run(req);

  await body('firstName')
    .optional()
    .isString().withMessage('Must be a string')
    .trim()
    .run(req);

  await body('lastName')
    .optional()
    .isString().withMessage('Must be a string')
    .trim()
    .run(req);

  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return next(getValidationErrors(result.array()));
};

const loginValidator = async (req, res, next) => {
  await body('username')
    .not().isEmpty().withMessage('Cannot be empty')
    .isString().withMessage('Must be a string')
    .isLength({ min: 3 })
    .trim()
    .run(req);

  await body('password')
    .not().isEmpty().withMessage('Cannot be empty')
    .isString().withMessage('Must be a string')
    .isLength({ min: 3 })
    .trim()
    .run(req);

  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return next(getValidationErrors(result.array()));
};

module.exports = {
  registerValidator,
  loginValidator,
};
