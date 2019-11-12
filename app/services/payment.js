const moment = require('moment-timezone');
const ServiceResponseWriter = require('../helpers/serviceResponseWriter');
const db = require('../database');

/**
 * Create a new payment object
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

module.exports = {
  create,
};
