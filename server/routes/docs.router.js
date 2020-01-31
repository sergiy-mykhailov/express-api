const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./server/swagger.yaml');

const getRoutes = () => {
  const router = Router();

  router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  return router;
};

module.exports = getRoutes;
