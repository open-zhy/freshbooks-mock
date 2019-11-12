const fs = require('fs');
const path = require('path');
const buildOptions = require('minimist-options');
const minimist = require('minimist');
const fastifyFactory = require('fastify');
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

  secure: {
    type: 'boolean',
    alias: 's',
    default: false,
  },

  // Special option for positional arguments (`_` in minimist)
  arguments: 'string',
});

const args = minimist(process.argv.slice(2), options);

db.init(db.instance);

const fastifyOptions = {
  logger: true,
};

if (args.secure) {
  fastifyOptions.https = {
    allowHTTP1: true,
    key: fs.readFileSync(path.join(__dirname, '..', 'certs', 'fastify.key')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'certs', 'fastify.cert')),
  };
}

const fastify = fastifyFactory(fastifyOptions);

addXmlBodyParser(fastify);

defineRoutes(fastify);

decorateFastifyReplies(fastify);

// Run the server!
fastify.listen(args['http-port'], '0.0.0.0', (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server up and running on ${fastify.server.address().port}`);
});
