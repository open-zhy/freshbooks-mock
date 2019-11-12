const mainRoute = require('./main');
const flushRoute = require('./flush');
const dbRoute = require('./db');

module.exports = (fastify) => {
  // Declare all routes here
  fastify.route(mainRoute);
  fastify.route(flushRoute);
  fastify.route(dbRoute);
};
