const db = require('../database');

module.exports = (request, reply) => {
  db.flush(db.instance);
  reply.send('DB flushed');
};
