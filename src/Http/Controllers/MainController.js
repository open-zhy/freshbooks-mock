module.exports = (request, reply) => {
    const req = request.body.request ? request.body.request : null
    if (!req) {
        return reply.error('No body has been provided', 400)
    }
    reply.success('<ok>OK</ok>')
}