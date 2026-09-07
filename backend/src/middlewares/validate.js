// middlewares/validate.js
// Generic Zod validation middleware. Usage in a route:
//
//   const { z } = require('zod');
//   const validate = require('../middlewares/validate');
//   const schema = z.object({ body: z.object({ email: z.string().email() }) });
//   router.post('/login', validate(schema), authController.login);
//
const { sendError } = require('../utils/apiResponse');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = result.error.errors.map(
        (e) => `${e.path.slice(1).join('.')}: ${e.message}`
      );
      return sendError(res, {
        statusCode: 422,
        message: 'Validation failed',
        errors,
      });
    }

    // Overwrite with parsed/coerced values (e.g. numeric query params)
    req.body = result.data.body ?? req.body;
    req.query = result.data.query ?? req.query;
    req.params = result.data.params ?? req.params;
    next();
  };
}

module.exports = validate;
