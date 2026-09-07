// validators/bookingSchemas.js
import { z } from 'zod';

// Used to validate the payload assembled across ServiceSelection ->
// DateTimeSelection -> BookingConfirmation before it's sent to
// appointmentService.create().
export const createAppointmentSchema = z.object({
  professionalId: z.string().min(1, 'Professional is required'),
  serviceId: z.string().min(1, 'Please select a service'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a date'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Please select a time slot'),
  notes: z.string().max(500, 'Notes must be under 500 characters').optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().max(500, 'Comment must be under 500 characters').optional(),
});
