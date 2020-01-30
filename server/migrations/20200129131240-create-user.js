const { userRoles } = require('../config/index');

const roles = Object.values(userRoles);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    );

    await queryInterface.sequelize.query(
      'CREATE TYPE "enum_users_role" AS ENUM(:roles);',
      { replacements: { roles }, type: Sequelize.QueryTypes.INSERT },
    );

    await queryInterface.sequelize.query(
      `CREATE TABLE "users" (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "firstName" varchar(255),
        "lastName" varchar(255),
        "username" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "password" varchar,
        "token" varchar,
        "refreshToken" varchar,
        "role" "enum_users_role" NOT NULL DEFAULT '${userRoles.USER}',
        CONSTRAINT "users_pkey" PRIMARY KEY ("id"))`,
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
  },
};
