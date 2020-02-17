const userRoles = {
  USER: 'user',
  ADMIN: 'admin',
};

// const db = {
//   url: process.env.DB_URL,
//   username: process.env.DB_USERNAME || 'postgres',
//   password: process.env.DB_PASSWORD || 'postgres',
//   database: process.env.DB_DATABASE || 'express-api',
//   host: process.env.DB_HOST || '127.0.0.1',
//   dialect: process.env.DB_DIALECT || 'postgres',
// };

const db = {
  dialect: process.env.DB_DIALECT || 'postgres',
};

if (Object.prototype.hasOwnProperty.call(process.env, 'DB_URL')) {
  db.url = process.env.DB_URL;
}
if (Object.prototype.hasOwnProperty.call(process.env, 'DB_USERNAME')) {
  db.username = process.env.DB_USERNAME;
}
if (Object.prototype.hasOwnProperty.call(process.env, 'DB_PASSWORD')) {
  db.password = process.env.DB_PASSWORD;
}
if (Object.prototype.hasOwnProperty.call(process.env, 'DB_DATABASE')) {
  db.database = process.env.DB_DATABASE;
}
if (Object.prototype.hasOwnProperty.call(process.env, 'DB_HOST')) {
  db.host = process.env.DB_HOST;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  jwtTokenExpiresIn: process.env.JWT_TOKEN_EXPIRES_IN || '24h',
  authSecretKey: process.env.AUTH_SECRET_KEY,
  // databaseUrl: process.env.DATABASE_URL,
};

const httpPort = process.env.HTTP_PORT || 8080;
const httpsPort = process.env.HTTPS_PORT || 8443;
const key = process.env.HTTPS_KEY || './cert/privkey.pem';
const cert = process.env.HTTPS_CERT || './cert/fullchain.pem';

const loggerFormat = '[:date[iso]] - :method :url :status :response-time ms - :res[content-length]';

module.exports = {
  env,
  db,
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
