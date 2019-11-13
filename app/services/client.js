const pick = require('lodash.pick');
const get = require('lodash.get');

const ServiceResponseWriter = require('../helpers/serviceResponseWriter');
const Paginator = require('../helpers/paginate');
const db = require('../database');


/**
 * Creates a client
 * https://www.freshbooks.com/classic-api/docs/clients#client.create
 * @param {*} req
 *
 * @returns {object} The service response object
 */
function create(req) {
  if (!req.client) {
    return ServiceResponseWriter.error('Request has no client node', 400);
  }

  const nextId = db.nextSeq('clients');
  const clientsModel = db.instance.get('clients');
  clientsModel.push({ ...req.client, client_id: nextId }).write();

  return ServiceResponseWriter.success(`<client_id>${nextId}</client_id>`);
}

/**
 * List all clients
 * https://www.freshbooks.com/classic-api/docs/clients#client.list
 * @param {*} req
 *
 * @returns {object} The service response object
 */
// eslint-disable-next-line no-unused-vars
function list(req) {
  const clientsModel = db.instance.get('clients');
  const paginator = new Paginator(req);

  const results = paginator.decorate(
    'clients',
    'client',
    clientsModel.filter(
      // todo: complete filter ability with: updated_from, updated_to, folder, notes
      pick(req, ['email', 'username']),
    ),
  );

  return ServiceResponseWriter.success(results);
}

/**
 * Update a client object
 * https://www.freshbooks.com/classic-api/docs/clients#client.update
 *
 * @param {*} req
 */
const update = (req) => {
  if (!req.client) {
    return ServiceResponseWriter.error('Request has no client node', 400);
  }
  const clientId = get(req, 'client.client_id');

  if (!clientId) {
    return ServiceResponseWriter.error('Request has no client_id node', 400);
  }

  try {
    db.instance.get('clients').find({ client_id: clientId }).assign(get(req, 'client'))
      .write();

    return ServiceResponseWriter.success();
  } catch (error) {
    return ServiceResponseWriter.error(error.message, error.status);
  }
};


module.exports = {
  create,
  list,
  update,
};
