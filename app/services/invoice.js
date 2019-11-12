const moment = require('moment-timezone');
const get = require('lodash.get');
const ServiceResponseWriter = require('../helpers/serviceResponseWriter');
const db = require('../database');


/**
 * Create an new invoice object
 *
 * @param {*} req
 */
function create(req) {
  if (!req.invoice) {
    return ServiceResponseWriter.error('Request has no invoice node', 400);
  }

  const nextId = db.nextSeq('invoices');

  // setup invoice data, default values
  const { invoice } = req;

  if (!invoice.number) {
    // generate automatically
    invoice.number = `FB${nextId.toString().padStart(8, '0')}`;
  }

  if (!invoice.status) {
    invoice.status = 'draft';
  }

  if (!invoice.date) {
    invoice.date = moment.tz('UTC').format('YYYY-MM-DD');
  }

  if (!invoice.discount) {
    invoice.discount = 0;
  }

  const invoicesModel = db.instance.get('invoices');
  invoicesModel.push({ ...invoice, invoice_id: nextId }).write();

  return ServiceResponseWriter.success(`<invoice_id>${nextId}</invoice_id>`);
}


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
  create,
  update,
};
