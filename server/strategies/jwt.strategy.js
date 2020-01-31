const { ExtractJwt, Strategy } = require('passport-jwt');
const { models } = require('../models');
const { env } = require('../config');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = env.jwtSecretKey;

// TODO: add custom error when toked expired

module.exports = (passport) => {
  passport.use(new Strategy(opts, async (jwtPayload, done) => {
    try {
      const user = await models.user.findOne({
        where: {
          id: jwtPayload.sub,
        },
        raw: true,
      });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Access token is invalid or expired' });
      }
    } catch (err) {
      return done(err, false);
    }
  }));
};
