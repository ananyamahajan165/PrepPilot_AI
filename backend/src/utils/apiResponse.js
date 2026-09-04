

function success(res, statusCode, data = {}, message) {
  return res.status(statusCode).json({
    success: true,
    ...(message ? { message } : {}),
    ...data,
  });
}

function error(res, statusCode, message, extra = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...extra,
  });
}

module.exports = { success, error };
