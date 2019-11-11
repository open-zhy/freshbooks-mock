const buildOptions = require('minimist-options');
const minimist = require('minimist');
const fastify = require('fastify')({ logger: true });
const os = require('os');

const defineRoutes = require('./routes');
const decorateFastifyReplies = require('./plugins/repliesPlugin');
const addXmlBodyParser = require('./plugins/xmlPlugin');
const db = require('./database');

const options = buildOptions({
  workers: {
    type: 'number',
    alias: 'w',
    default: os.cpus().length,
  },

  'http-port': {
    type: 'number',
    alias: 'p',
    default: 21987,
  },

  // Special option for positional arguments (`_` in minimist)
  arguments: 'string',
});

const args = minimist(process.argv.slice(2), options);

db.init(db.instance);

addXmlBodyParser(fastify);

defineRoutes(fastify);

decorateFastifyReplies(fastify);

// Run the server!
fastify.listen(args['http-port'], (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server up and running on ${fastify.server.address().port}`);
});
