const config = require('./index');

module.exports = {
  [config.env.nodeEnv || 'development']: config.db,
};
