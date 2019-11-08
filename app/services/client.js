const Parser = require('fast-xml-parser').j2xParser;

const ServiceResponseWriter = require('../helpers/serviceResponseWriter');
const db = require('../database');
const xmlParesOptions = require('../constants/xmlParseOptions');


/**
 * Creates a client
 * https://www.freshbooks.com/classic-api/docs/clients#client.create
 * @param {*} req
 *
 * @returns {object} The service response object
 */
function create(req) {
  if (!req.client) {
    return ServiceResponseWriter.error('Request has no client node');
  }

  const nextId = db.nextSeq('clients');
  const clientsModel = db.instance.get('clients');
  clientsModel.push({ ...req.client, client_id: nextId }).write();

  return ServiceResponseWriter.success(`<client_id>${nextId}</client_id>`);
}

/**
 * List all clients
 * https://www.freshbooks.com/classic-api/docs/clients
 * @param {*} req
 *
 * @returns {object} The service response object
 */
// eslint-disable-next-line no-unused-vars
function list(req) {
  // @todo give filters capabilities and make attributes dynamic

  const clientsModel = db.instance.get('clients');
  const parser = new Parser(xmlParesOptions);

  const clientsFromDb = clientsModel.value();
  const results = parser.parse({
    clients: {
      _attr_page: 1,
      _attr_per_page: 15,
      _attr_pages: 3,
      client: clientsFromDb,
    },
  });

  return ServiceResponseWriter.success(results);
}

module.exports = {
  create,
  list,
};
