const buildOptions = require('minimist-options');
const minimist = require('minimist');
const fastify = require('fastify')({ logger: true })
const defineRoutes = require('./routes')

const options = buildOptions({
  workers: {
    type: 'number',
    alias: 'w',
    default: require('os').cpus().length
  },

  httpPort: {
    type: 'number',
    alias: 'p',
    default: 21987
  },

  // Special option for positional arguments (`_` in minimist)
  arguments: 'string'
});

const args = minimist(process.argv.slice(2), options);

defineRoutes(fastify)

// Run the server!
fastify.listen(args.httpPort, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server up and running on ${fastify.server.address().port}`)
})