// validators/profileSchemas.js
import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-]{7,15}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  city: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
