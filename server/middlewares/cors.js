const cors = require('cors');
const createError = require('http-errors');

const whitelist = ['http://example1.com', 'http://example2.com'];

const corsOptions = {
  origin: (origin, callback) => {
    // TODO: remove next line when configure cors
    return callback(null, true);

    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(createError(405, 'Not allowed by CORS'));
    }
  },
  // optionsSuccessStatus: 200,
  // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // preflightContinue: false,
};

module.exports = cors(corsOptions);
