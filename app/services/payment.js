const moment = require('moment-timezone');
const ServiceResponseWriter = require('../helpers/serviceResponseWriter');
const db = require('../database');

/**
 * Create a new payment object
 * https://www.freshbooks.com/classic-api/docs/payments#payment.create
 *
 * @param {*} req
 */
function create(req) {
  if (!req.payment) {
    return ServiceResponseWriter.error('Request has no payment node', 400);
  }

  const { payment } = req;

  if (!payment.date) {
    payment.date = moment.tz('UTC').format('YYYY-MM-DD');
  }

  const nextId = db.nextSeq('payments');
  const paymentsModel = db.instance.get('payments');
  paymentsModel.push({ ...payment, payment_id: nextId }).write();

  return ServiceResponseWriter.success(`<payment_id>${nextId}</payment_id>`);
}

/**
 * Fetch a payment object
 * https://www.freshbooks.com/classic-api/docs/payments#payment.get
 *
 * @param {*} req
 */
function get(req) {
  if (!req.payment_id) {
    return ServiceResponseWriter.error('Request has no payment id', 400);
  }

  const paymentId = req.payment_id;
  const paymentsModel = db.instance.get('payments');
  const payment = paymentsModel.find({ payment_id: paymentId })
    .value();

  if (!payment) {
    return ServiceResponseWriter.error(`payment [${paymentId}] not found`, 404);
  }

  return ServiceResponseWriter.success({ payment });
}

module.exports = {
  create, get,
};
