const fs = require('fs');
const path = require('path');
const pg = require('pg');
const Sequelize = require('sequelize');
const { env, db } = require('../config/index');
// eslint-disable-next-line import/no-dynamic-require,global-require
const config = require(`${__dirname}/../config/db.js`);

pg.defaults.parseInt8 = true;
const nodeEnv = env.nodeEnv || 'development';
const dbUrl = db.url;
const dbConfig = config[nodeEnv];
let sequelize;

if (dbUrl) {
  sequelize = new Sequelize(dbUrl, { dialect: 'postgres', logging: false });
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    ...dbConfig,
    logging: false, // Turn off sql-logging
  });
}

// Turn off sql-logging
sequelize.options.logging = false;

const models = {};
fs.readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    models[model.name] = model;
  });

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = { models, sequelize, Sequelize };
