const { Router } = require('express');
const { getUserList, getUserDetails } = require('../controllers/user.controller');
const { onlyRoles } = require('../utils/auth');
const { userRoles: roles } = require('../config/index');
const { idValidator, paginationValidator } = require('../validators/base.validator');

const getRoutes = () => {
  const router = Router();

  router.route('/').get(
    onlyRoles(roles.ADMIN),
    paginationValidator,
    getUserList,
  );

  router.route('/:id').get(
    idValidator('id'),
    getUserDetails,
  );

  return router;
};

module.exports = getRoutes;
