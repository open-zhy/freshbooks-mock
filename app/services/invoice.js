const get = require('lodash.get');

const ServiceResponseWriter = require('../helpers/serviceResponseWriter');
const db = require('../database');

const update = (req) => {
  if (!req.invoice) {
    return ServiceResponseWriter.error('Request has no invoice node', 400);
  }
  const invoiceId = get(req, 'invoice.invoice_id');

  if (!invoiceId) {
    return ServiceResponseWriter.error('Request has no invoice_id node', 400);
  }

  try {
    db.instance.get('invoices').find({ invoice_id: invoiceId }).assign(get(req, 'invoice'))
      .write();

    return ServiceResponseWriter.success();
  } catch (error) {
    return ServiceResponseWriter.error(error.message, error.status);
  }
};


module.exports = {
  update,
};
