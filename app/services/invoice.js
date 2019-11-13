const moment = require('moment-timezone');
const get = require('lodash.get');
const Parser = require('fast-xml-parser').j2xParser;
const ServiceResponseWriter = require('../helpers/serviceResponseWriter');
const db = require('../database');
const xmlParesOptions = require('../constants/xmlParseOptions');


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

const getInvoice = (req) => {
  const invoiceId = get(req, 'invoice_id');

  if (!invoiceId) {
    return ServiceResponseWriter.error('Request has no invoice_id node', 400);
  }

  try {
    const value = db.instance.get('invoices').find({ invoice_id: invoiceId }).value();
    const parser = new Parser(xmlParesOptions);
    const parsedValue = parser.parse(value);
    return ServiceResponseWriter.success(`<invoice>${parsedValue}</invoice>`);
  } catch (error) {
    return ServiceResponseWriter.error(error.message, error.status);
  }
};
const list = (req) => {
  let options = {}
  const invoicesModel = db.instance.get('invoices');
  try {

    const xmlConverter = require("xml-js");
    let results = invoicesModel.find(options).value();
    var conversionOptions = { compact: true, ignoreComment: true, spaces: 4 };
    xmlResult = xmlConverter.js2xml(results, conversionOptions)

  } catch (error) {
    return ServiceResponseWriter.error(error.message, error.status);
  }


}

module.exports = {
  create,
  update,
  getInvoice,
  list
};
