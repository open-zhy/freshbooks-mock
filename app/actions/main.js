const clientService = require('../services/client');
const paymentService = require('../services/payment');
const invoiceService = require('../services/invoice');

module.exports = (request, reply) => {
  const req = request.body.request ? request.body.request : null;
  if (!req) {
    return reply.error('Malformed request', 400);
  }

  /* eslint-disable dot-notation */
  const method = req['_attr_method'] || null;
  const allowedMethods = {
    // client
    'client.create': clientService.create,
    'client.get': clientService.getClient,
    'client.update': clientService.update,
    'client.list': clientService.list,

    // invoice
    'invoice.get': invoiceService.getInvoice,
    'invoice.create': invoiceService.create,
    'invoice.update': invoiceService.update,
    'invoice.list': invoiceService.list,

    // payment
    'payment.get': paymentService.get,
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
