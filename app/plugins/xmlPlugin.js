const fastifyXmlBodyParser = require('fastify-xml-body-parser');
const xmlParseOptions = require('../constants/xmlParseOptions');

module.exports = (fastify) => {
  // give capability to accept / parse xml datas
  fastify.register(fastifyXmlBodyParser, xmlParseOptions);
};
