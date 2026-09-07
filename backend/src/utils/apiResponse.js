// utils/apiResponse.js
// Every controller responds through these two helpers so the response shape
// is identical across the whole API (see spec section 28).

function sendSuccess(res, { statusCode = 200, message = 'Success', data = null } = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function sendError(res, { statusCode = 500, message = 'Something went wrong', errors = [] } = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

module.exports = { sendSuccess, sendError };
