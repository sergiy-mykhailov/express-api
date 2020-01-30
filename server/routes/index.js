const fs = require('fs');
const path = require('path');
const { Router } = require('express');
const { authJWT } = require('../services/auth.service');

// read routes from router folder
const routes = {};
const routeSuffix = '.router';
fs.readdirSync(__dirname)
  .filter((file) => (file.includes(routeSuffix)))
  .forEach((file) => {
    const filePath = path.join(__dirname, file);
    const parsed = path.parse(filePath);
    const routeName = parsed.name.replace(routeSuffix, '');

    // eslint-disable-next-line import/no-dynamic-require,global-require
    routes[routeName] = require(filePath);
  });

module.exports = (passport) => {
  const router = Router();

  router.use('/ping', routes.ping());
  router.use('/auth', routes.auth(passport));
  router.use('/user', authJWT(passport), routes.user());
  router.use('/docs', routes.docs());

  // TODO: docs

  return router;
};
