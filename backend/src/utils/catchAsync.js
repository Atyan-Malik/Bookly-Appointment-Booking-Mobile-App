// utils/catchAsync.js
// Wrap every async controller with this instead of writing try/catch blocks —
// rejected promises are forwarded to the global error handler automatically.
module.exports = function catchAsync(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
