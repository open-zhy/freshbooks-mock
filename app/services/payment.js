const ServiceResponseWriter = require('../helpers/serviceResponseWriter');
const db = require('../database');

function create(req) {
  if (!req.payment) {
    return ServiceResponseWriter.error('Request has no payment node', 400);
  }

  const nextId = db.nextSeq('payments');
  const paymentsModel = db.instance.get('payments');
  paymentsModel.push({ ...req.payment, payment_id: nextId }).write();

  return ServiceResponseWriter.success(`<payment_id>${nextId}</payment_id>`);
}

module.exports = {
  create,
};
