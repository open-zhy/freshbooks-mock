const db = require('../database');

module.exports = (r, reply) => {
  if ((r.query || {}).path) {
    return reply.send(db.instance.get(r.query.path).value());
  }

  return reply.send(db.instance.getState());
};
