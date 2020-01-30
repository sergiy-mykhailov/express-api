
const authJWT = (passport) => passport.authenticate('jwt', { session: false });

const authLocal = (passport) => passport.authenticate('local', { session: false });

module.exports = {
  authJWT,
  authLocal,
};
