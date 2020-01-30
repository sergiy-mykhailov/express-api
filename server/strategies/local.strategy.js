const LocalStrategy = require('passport-local');
const createError = require('http-errors');
const { models, Sequelize: { Op } } = require('../models');
const { comparePassword } = require('../utils/auth');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  }, async (username, password, done) => {
    try {
      const user = await models.user.findOne({
        where: {
          [Op.or]: [
            { username }, { email: username },
          ],
        },
        raw: true,
      });
      if (!user) {
        return done(createError(401, 'Login or password is incorrect'), false);
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return done(createError(401, 'Login or password is incorrect'), false);
      }

      return done(null, user);
    } catch (err) {
      done(err, false);
    }
  }));
};
