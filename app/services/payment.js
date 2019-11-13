const moment = require('moment-timezone');
const ServiceResponseWriter = require('../helpers/serviceResponseWriter');
const db = require('../database');
const xmlConverter = require("xml-js");

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

function get(req) {
    if (!req.payment_id) {
        return ServiceResponseWriter.error('Request has no payment id', 400);
    }

    const paymentId = req.payment_id;
    const paymentsModel = db.instance.get('payments');
    try {
        var payment = paymentsModel.find({ payment_id: paymentId })
            .value();
        var conversionOptions = { compact: true, ignoreComment: true, spaces: 4 };
        var paymentResult = xmlConverter.js2xml(payment, conversionOptions)
        return ServiceResponseWriter.success(paymentResult);
    } catch (error) {
        return ServiceResponseWriter.error(error.message, error.status);
    }

}

module.exports = {
    create, get
};


