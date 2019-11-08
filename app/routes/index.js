const mainRoute = require('./main');
const flushRoute = require('./flush');

module.exports = (fastify) => {
  // Declare all routes here
  fastify.route(mainRoute);
  fastify.route(flushRoute);
};
