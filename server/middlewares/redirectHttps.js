const config = require('../config');

const redirectMiddleware = (req, res, next) => {
  if (config.env.nodeEnv === 'production') {
    if (req.secure) {
      next();
    } else {
      console.log(' [API] Redirected:', `https://${req.headers.host}${req.url}`);
      res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
  } else {
    next();
  }
};

module.exports = redirectMiddleware;
