const { Router } = require('express');
const { register, login, logout } = require('../controllers/auth.controller');
const { authLocal, authJWT } = require('../services/auth.service');
const { payloadFieldsFilter } = require('../validators/base.validator');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

const getRoutes = (passport) => {
  const router = Router();

  router.route('/register').post(
    payloadFieldsFilter([
      'username', 'email', 'password', 'confirmPassword', 'firstName', 'lastName',
    ]),
    registerValidator,
    register,
  );

  router.route('/login').post(
    payloadFieldsFilter(['username', 'password']),
    loginValidator,
    authLocal(passport),
    login,
  );

  // TODO: refresh token
  // TODO: reset password

  router.route('/logout').get(
    authJWT(passport),
    logout,
  );

  return router;
};

module.exports = getRoutes;
