const os = require('os');
const cluster = require('cluster');

const runServer = (fastify, args) => fastify.listen(args['http-port'], '0.0.0.0', (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server up and running on ${fastify.server.address().port}`);
});

module.exports = (fastify, args) => {
  let { workers } = args;

  if (workers === 'auto') {
    workers = os.cpus().length;
  }

  if (workers > 1 && cluster.isMaster) {
    // Create a worker for each CPU
    for (let i = 0; i < workers; i += 1) {
      cluster.fork();
    }

    // process is clustered on a core and process id is assigned
    cluster.on('online', (worker) => {
      fastify.log.info(`worker ${worker.process.pid} is listening`);
    });

    cluster.on('exit', (worker, code, signal) => {
      fastify.log.info(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
      cluster.fork();
    });
  } else {
    runServer(fastify, args);
  }
};
