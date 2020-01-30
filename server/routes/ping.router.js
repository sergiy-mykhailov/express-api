const { Router } = require('express');

const getRoutes = () => {
  const router = Router();

  router.get('/', (req, res, next) => {
    res.send('pong');
  });

  return router;
};

module.exports = getRoutes;
