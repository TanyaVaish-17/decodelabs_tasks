import { z } from 'zod';

// Applied when a session is created (POST /api/sessions)
export const createSessionSchema = z.object({
  mode: z.enum(['focus', 'break'], {
    error: (issue) =>
      issue.input === undefined
        ? "mode is required"
        : "mode must be either 'focus' or 'break'",
  }),
  durationMinutes: z
    .number({ error: 'durationMinutes must be a number' })
    .int('durationMinutes must be a whole number')
    .min(1, 'durationMinutes must be at least 1')
    .max(120, 'durationMinutes cannot exceed 120'),
  note: z.string().trim().max(280, 'note cannot exceed 280 characters').optional(),
});

// Applied when a session is updated (PUT /api/sessions/:id)
// Everything optional — a partial update shouldn't require resending the whole object
export const updateSessionSchema = z.object({
  completedAt: z
    .string()
    .datetime({ error: 'completedAt must be a valid ISO timestamp' })
    .optional(),
  note: z.string().trim().max(280, 'note cannot exceed 280 characters').optional(),
});

// Applied to the :id route param on every session route.
// MongoDB ObjectIds are 24-character hex strings, not UUIDs.
export const sessionIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'id must be a valid MongoDB ObjectId'),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;