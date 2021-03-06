/**
 * Add success and error methods to replies
 * that wraps response in freshbooks xml markup
 * and then send the reply
 * We always respond with application/xml as
 * Content-Type as this is what freshbooks API returns
 */
module.exports = (fastify) => {
  fastify.decorateReply('success', function (payload) {
    this.header('Content-Type', 'application/xml; charset=utf-8');

    this.send(`<?xml version="1.0" encoding="utf-8"?>
            <response xmlns="https://www.freshbooks.com/api/" status="ok">
                ${payload}
            </response>
        `);
  });

  fastify.decorateReply('error', function (errorMessage, code = 40010) {
    this.header('Content-Type', 'application/xml; charset=utf-8');

    // as defined here https://www.freshbooks.com/api/errors
    // error code could be out of scope of standard HTTP error
    // in these cases, we return badRequest
    this.code(code > 510 ? 400 : code);
    this.send(`<?xml version="1.0" encoding="utf-8"?>
                <response xmlns="https://www.freshbooks.com/api/" status="fail">
                <error>${errorMessage}</error>
                <code>${code}</code>
            </response>
        `);
  });
};
