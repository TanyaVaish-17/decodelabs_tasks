import { Request, Response } from 'express';
import { sessionService } from '../services/session.service';
import {
  createSessionSchema,
  updateSessionSchema,
  sessionIdParamSchema,
} from '../schemas/session.schema';
import { ApiError } from '../utils/ApiError';

export const sessionController = {
  async list(_req: Request, res: Response) {
    const sessions = await sessionService.listSessions();
    res.status(200).json({ data: sessions });
  },

  async getOne(req: Request, res: Response) {
    const { id } = sessionIdParamSchema.parse(req.params);
    const session = await sessionService.getSession(id);
    if (!session) {
      throw new ApiError(404, `No session found with id ${id}`);
    }
    res.status(200).json({ data: session });
  },

  async create(req: Request, res: Response) {
    const parsed = createSessionSchema.parse(req.body);
    const session = await sessionService.startSession(parsed);
    res.status(201).json({ data: session });
  },

  async update(req: Request, res: Response) {
    const { id } = sessionIdParamSchema.parse(req.params);
    const parsed = updateSessionSchema.parse(req.body);
    const session = await sessionService.updateSession(id, parsed);
    if (!session) {
      throw new ApiError(404, `No session found with id ${id}`);
    }
    res.status(200).json({ data: session });
  },

  async remove(req: Request, res: Response) {
    const { id } = sessionIdParamSchema.parse(req.params);
    const deleted = await sessionService.deleteSession(id);
    if (!deleted) {
      throw new ApiError(404, `No session found with id ${id}`);
    }
    res.status(204).send();
  },
};