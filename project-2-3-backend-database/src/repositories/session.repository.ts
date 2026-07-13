import { SessionModel, FocusSessionDocument } from '../models/session.model';

// Same method names and shapes as the in-memory version from Project 2 —
// controllers and services call this exactly the same way. Only the
// implementation changed, from an array to real persistence.
class SessionRepository {
  async findAll(): Promise<FocusSessionDocument[]> {
    return SessionModel.find().sort({ startedAt: -1 });
  }

  async findById(id: string): Promise<FocusSessionDocument | null> {
    return SessionModel.findById(id);
  }

  async create(data: Partial<FocusSessionDocument>): Promise<FocusSessionDocument> {
    return SessionModel.create(data);
  }

  async update(
    id: string,
    updates: Partial<FocusSessionDocument>
  ): Promise<FocusSessionDocument | null> {
    return SessionModel.findByIdAndUpdate(id, updates, {
      new: true,          // return the updated document, not the original
      runValidators: true, // re-run schema validation on update, not just create
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await SessionModel.findByIdAndDelete(id);
    return result !== null;
  }
}

export const sessionRepository = new SessionRepository();