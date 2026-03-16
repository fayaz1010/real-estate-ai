// Inspection Validation
import { z } from 'zod';

export const createInspectionSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid(),
    type: z.enum(['IN_PERSON', 'VIRTUAL', 'OPEN_HOUSE']),
    scheduledDate: z.string(),
    scheduledTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    duration: z.number().int().min(15).max(180).optional(),
    attendees: z.array(z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
    })).optional(),
    tenantNotes: z.string().optional(),
  }),
});

export const updateInspectionSchema = z.object({
  body: z.object({
    status: z.enum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED']).optional(),
    scheduledDate: z.string().optional(),
    scheduledTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    tenantNotes: z.string().optional(),
    landlordNotes: z.string().optional(),
    cancellationReason: z.string().optional(),
  }),
});
