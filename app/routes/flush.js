const flush = require('../actions/flush');

module.exports = {
  method: ['POST'],
  url: '/api/db/flush',
  schema: {
    headers: {
      type: 'object',
      properties: {
        Authorization: { type: 'string' },
      },
      required: ['Authorization'],
    },
  },
  handler: flush,
};
