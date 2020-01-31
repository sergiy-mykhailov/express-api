const { userRoles } = require('../config/index');

const roles = Object.values(userRoles);

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        isEmail: true,
      },
    },
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: userRoles.USER,
      values: roles,
      validate: {
        notNull: true,
        notEmpty: true,
        isIn: [roles],
      },
    },
  }, {});

  // User.associate = (models) => {
  //   models.User.hasOne(models.Notification, {
  //     foreignKey: 'user_id',
  //     as: 'notifications',
  //   });
  // };

  return User;
};
