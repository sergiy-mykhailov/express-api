const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./server/swagger.yaml');

const getRoutes = () => {
  const router = Router();

  router.use('/', swaggerUi.serve);
  router.route('/').get(swaggerUi.setup(swaggerDocument));

  return router;
};

module.exports = getRoutes;
