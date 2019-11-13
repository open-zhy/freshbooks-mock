const Parser = require('fast-xml-parser').j2xParser;

const xmlParesOptions = require('../constants/xmlParseOptions');

function error(message, code = 500) {
  return {
    success: false,
    error: message,
    errorCode: code,
  };
}

function success(results = '') {
  if (typeof results === 'object') {
    // we should convert into xml first before sending it to the output decorator
    const parser = new Parser(xmlParesOptions);
    // eslint-disable-next-line no-param-reassign
    results = parser.parse(results);
  }

  return {
    success: true,
    results,
  };
}

module.exports = {
  error,
  success,
};
