import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import sessionRoutes from './routes/session.routes';
import { requestLogger } from './middleware/requestLogger';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/sessions', sessionRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}