/* eslint-disable no-use-before-define */

const http = require('http');
const https = require('https');
const fs = require('fs');
const config = require('../config');
const app = require('../app');

// Get port from environment and store in Express.
const PORT_HTTP = normalizePort(config.http.port);
const PORT_HTTPS = normalizePort(config.https.port);

// Create HTTP server.
const httpServer = http.createServer(app);
httpServer.listen(PORT_HTTP);
httpServer.on('error', onError(PORT_HTTP));
httpServer.on('listening', onListening(httpServer));

// Create HTTPS server.
if (config.env.nodeEnv === 'production') {
  const key = fs.readFileSync(config.https.key, 'utf8');
  const cert = fs.readFileSync(config.https.cert, 'utf8');
  const credentials = { key, cert };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(PORT_HTTPS);
  httpsServer.on('error', onError(PORT_HTTPS));
  httpsServer.on('listening', onListening(httpsServer));
}

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// Event listener for HTTP server "error" event.
function onError(port) {
  return (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`Error: ${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`Error: ${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
}

// Event listener for HTTP server "listening" event.
function onListening(srv) {
  return () => {
    const addr = srv.address();
    const bind = typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`;
    console.log(`Server listening on ${bind}`);
  };
}
