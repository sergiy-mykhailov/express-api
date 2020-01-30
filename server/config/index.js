const userRoles = {
  USER: 'user',
  ADMIN: 'admin',
};

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  jwtTokenExpiresIn: process.env.JWT_TOKEN_EXPIRES_IN || '24h',
  authSecretKey: process.env.AUTH_SECRET_KEY,
};

const httpPort = process.env.HTTP_PORT || 8080;
const httpsPort = process.env.HTTPS_PORT || 8443;
const key = process.env.HTTPS_KEY || './cert/privkey.pem';
const cert = process.env.HTTPS_CERT || './cert/fullchain.pem';

const loggerFormat = '[:date[iso]] - :method :url :status :response-time ms - :res[content-length]';

module.exports = {
  env,
  http: {
    port: httpPort,
  },
  https: {
    port: httpsPort,
    key,
    cert,
  },
  userRoles,
  loggerFormat,
};
