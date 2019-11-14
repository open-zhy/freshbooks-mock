const moment = require('moment-timezone');
const get = require('lodash.get');
const pick = require('lodash.pick');
const ServiceResponseWriter = require('../helpers/serviceResponseWriter');
const Paginator = require('../helpers/paginate');
const db = require('../database');


/**
 * Create an new invoice object
 * https://www.freshbooks.com/classic-api/docs/invoices#invoice.create
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


/**
 * Update an invoice
 * https://www.freshbooks.com/classic-api/docs/invoices#invoice.update
 *
 * @param {*} req
 */
const update = (req) => {
  if (!req.invoice) {
    return ServiceResponseWriter.error('Request has no invoice node', 400);
  }
  const invoiceId = get(req, 'invoice.invoice_id');

  if (!invoiceId) {
    return ServiceResponseWriter.error('Request has no invoice_id node', 400);
  }

  const invoice = db.instance.get('invoices').find({ invoice_id: invoiceId });

  if (invoice.isEmpty().value()) {
    return ServiceResponseWriter.error(`Invoice [${invoiceId}] not found`, 404);
  }

  invoice.assign(req.invoice).write();

  return ServiceResponseWriter.success();
};

/**
 * Fetch an invoice by its invoice_id
 * https://www.freshbooks.com/classic-api/docs/invoices#invoice.get
 *
 * @param {*} req
 */
const getInvoice = (req) => {
  const invoiceId = get(req, 'invoice_id');

  if (!invoiceId) {
    return ServiceResponseWriter.error('Request has no invoice_id node', 400);
  }

  const invoice = db.instance.get('invoices').find({ invoice_id: invoiceId }).value();

  if (!invoice) {
    return ServiceResponseWriter.error(`Invoice [${invoiceId}] not found`, 404);
  }

  return ServiceResponseWriter.success({ invoice });
};


/**
 * Search and list invoices
 * https://www.freshbooks.com/classic-api/docs/invoices#invoice.list
 *
 * @param {*} req
 */
const list = (req) => {
  const invoicesModel = db.instance.get('invoices');
  const paginator = new Paginator(req);

  const results = paginator.decorate(
    'invoices',
    'invoice',
    invoicesModel.filter(
      // todo: complete filter ability with: date_from, date_to, updated_from, updated_to
      pick(req, ['client_id', 'recurring_id', 'status', 'number', 'notes']),
    ),
  );
  return ServiceResponseWriter.success(results);
};

module.exports = {
  create,
  update,
  getInvoice,
  list,
};
