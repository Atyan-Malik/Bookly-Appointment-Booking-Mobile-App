// validators/serviceSchemas.js
// Used by the provider Services screen (add/edit service form).
import { z } from 'zod';

export const serviceFormSchema = z.object({
  name: z.string().min(2, 'Service name is required'),
  description: z.string().max(300, 'Keep the description under 300 characters').optional(),
  price: z.coerce.number().positive('Price must be greater than 0'),
  durationMinutes: z.coerce
    .number()
    .int('Duration must be a whole number')
    .positive('Duration must be greater than 0')
    .max(480, 'Duration seems too long — max 8 hours'),
});
