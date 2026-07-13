import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase } from './config/db';

async function startServer() {
  await connectDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Focal API running on http://localhost:${env.port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});