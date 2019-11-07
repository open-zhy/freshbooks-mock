module.exports = (fastify) => {
    fastify.decorateReply('success', function(payload) {
        this.header('Content-Type', 'text / xml');

        this.send(`<?xml version="1.0" encoding="utf-8"?>
            <response xmlns="https://www.freshbooks.com/api/" status="ok">
                ${payload}
            </response>
        `);
    });

    fastify.decorateReply('error', function (errorMessage, code = 40010) {
        this.header('Content-Type', 'text / xml');

        this.send(`<?xml version="1.0" encoding="utf-8"?>
                <response xmlns="https://www.freshbooks.com/api/" status="fail">
                <error>${errorMessage}</error>
                <code>${code}</code>
            </response>
        `);
    });
}