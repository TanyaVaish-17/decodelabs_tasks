import { Schema, model, Document } from 'mongoose';

export type SessionMode = 'focus' | 'break';

export interface FocusSessionDocument extends Document {
  mode: SessionMode;
  durationMinutes: number;
  startedAt: Date;
  completedAt: Date | null;
  note: string | null;
}

const sessionSchema = new Schema<FocusSessionDocument>(
  {
    mode: {
      type: String,
      enum: {
        values: ['focus', 'break'],
        message: '{VALUE} is not a valid session mode',
      },
      required: [true, 'mode is required'],
    },
    durationMinutes: {
      type: Number,
      required: [true, 'durationMinutes is required'],
      min: [1, 'durationMinutes must be at least 1'],
      max: [120, 'durationMinutes cannot exceed 120'],
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [280, 'note cannot exceed 280 characters'],
      default: null,
    },
  },
  {
    // Adds createdAt/updatedAt automatically — useful audit trail
    // we get for free without adding fields ourselves
    timestamps: true,
  }
);

// Index on mode since "list sessions by mode" is a likely future query
// pattern (e.g. "show me all focus sessions") — cheap to add now,
// expensive to realize you need it once the collection is large
sessionSchema.index({ mode: 1 });

export const SessionModel = model<FocusSessionDocument>('Session', sessionSchema);