const viewDb = require('../actions/db');

module.exports = {
  method: ['GET'],
  url: '/db',
  schema: {
    headers: {
      type: 'object',
      properties: {
        Authorization: { type: 'string' },
      },
    },
  },
  handler: viewDb,
};
