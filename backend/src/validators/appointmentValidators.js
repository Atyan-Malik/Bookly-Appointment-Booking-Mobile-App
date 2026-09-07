const { z } = require('zod');

const createAppointmentSchema = z.object({
  body: z.object({
    professionalId: z.string().min(1),
    serviceId: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:mm'),
    notes: z.string().optional(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
  }),
});

module.exports = { createAppointmentSchema, updateStatusSchema };