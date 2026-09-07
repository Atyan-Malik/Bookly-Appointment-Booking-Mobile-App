const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['customer', 'provider']).optional(),
    phone: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

const forgotPasswordSchema = z.object({
  body: z.object({ email: z.string().email('Enter a valid email') }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};