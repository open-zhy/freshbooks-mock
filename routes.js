var mainController = require('./src/Http/Controllers/MainController')

module.exports = (fastify) => {

  // Freshbooks single entry point
  fastify.route({
    method: ['POST'],    
    url: '/api/2.1/xml-in',
    schema: {
      headers: {
        type: 'object',
        properties: {
          'Content-Type': {type: 'string', 'const': 'text/xml'},
          'Authorization': {type: 'string'}
        },
        required: ['Authorization']
      }
    },
    handler: mainController
  })

}