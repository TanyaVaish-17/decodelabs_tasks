import { FocusSessionDocument, SessionMode } from '../models/session.model';
import { sessionRepository } from '../repositories/session.repository';
import { CreateSessionInput, UpdateSessionInput } from '../schemas/session.schema';

export const sessionService = {
  async listSessions(): Promise<FocusSessionDocument[]> {
    return sessionRepository.findAll();
  },

  async getSession(id: string): Promise<FocusSessionDocument | null> {
    return sessionRepository.findById(id);
  },

  async startSession(input: CreateSessionInput): Promise<FocusSessionDocument> {
    return sessionRepository.create({
      mode: input.mode as SessionMode,
      durationMinutes: input.durationMinutes,
      note: input.note ?? null,
    });
  },

  async updateSession(
    id: string,
    input: UpdateSessionInput
  ): Promise<FocusSessionDocument | null> {
    const updates: Partial<FocusSessionDocument> = {};

    if (input.note !== undefined) {
      updates.note = input.note;
    }
    if (input.completedAt !== undefined) {
      updates.completedAt = new Date(input.completedAt);
    }

    return sessionRepository.update(id, updates);
  },

  async deleteSession(id: string): Promise<boolean> {
    return sessionRepository.delete(id);
  },
};