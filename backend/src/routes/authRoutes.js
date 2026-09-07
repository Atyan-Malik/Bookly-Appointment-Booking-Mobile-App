const express = require('express');
const controller = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimiter');
const {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validators/authValidators');

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), controller.register);
router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/refresh', validate(refreshSchema), controller.refresh);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), controller.resetPassword);
router.post('/logout', controller.logout);

module.exports = router;