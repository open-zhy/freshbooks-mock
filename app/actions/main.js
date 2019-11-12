const clientService = require('../services/client');
const paymentService = require('../services/payment');

module.exports = (request, reply) => {
  const req = request.body.request ? request.body.request : null;
  if (!req) {
    return reply.error('Malformed request', 400);
  }

  /* eslint-disable dot-notation */
  const method = req['_attr_method'] || null;
  const allowedMethods = {
    'client.create': clientService.create,
    'client.update': null,
    'client.list': clientService.list,
    'invoice.get': null,
    'invoice.create': null,
    'invoice.update': null,
    'invoice.list': null,
    'payment.get': null,
    'payment.create': paymentService.create,
  };
  if (!Object.keys(allowedMethods).includes(method)) {
    return reply.error(`Method [${method}] is not allowed`, 405);
  }

  if (typeof allowedMethods[method] !== 'function') {
    return reply.error(`Method [${method}] exists but is not implemented yet`, 404);
  }

  // Get the work done by the corresponding service
  const serviceResponse = allowedMethods[method](req);

  return serviceResponse.success
    ? reply.success(serviceResponse.results)
    : reply.error(serviceResponse.error, serviceResponse.errorCode);
};
