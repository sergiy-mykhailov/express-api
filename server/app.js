const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const cors = require('./middlewares/cors');
const redirectMiddleware = require('./middlewares/redirectHttps');
const router = require('./routes/index');
const jwtStrategy = require('./strategies/jwt.strategy');
const localStrategy = require('./strategies/local.strategy');
const config = require('./config/index');
const { models } = require('./models');

const app = express();

// CORS
app.use(cors);

// redirect to https
app.use(redirectMiddleware);

if (config.env.nodeEnv !== 'test') {
  app.use(logger(config.loggerFormat));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// auth
app.use(passport.initialize());
localStrategy(passport);
jwtStrategy(passport);

// API routes
app.use('/api', router(passport));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || 'Something went wrong :(';

  if (status >= 500) {
    console.error(err);
  }

  const data = { status, message };
  if (err.errors) {
    data.errors = err.errors;
  }

  if (err instanceof models.Sequelize.ForeignKeyConstraintError) {
    return res.status(400).send({ status: 400, message: err.original.detail });
  }

  return res.status(status).send(data);
});

module.exports = app;
