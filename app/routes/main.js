const main = require('../actions/main');

module.exports = {
  method: ['POST'],
  url: '/api/2.1/xml-in',
  schema: {
    headers: {
      type: 'object',
      properties: {
        'Content-Type': { type: 'string', const: 'text/xml' },
        Authorization: { type: 'string' },
      },
      required: ['Authorization'],
    },
  },
  handler: main,
};
