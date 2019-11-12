function error(message, code = 500) {
  return {
    success: false,
    error: message,
    errorCode: code,
  };
}

function success(results = '') {
  return {
    success: true,
    results,
  };
}

module.exports = {
  error,
  success,
};
