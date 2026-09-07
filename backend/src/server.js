// server.js
const app = require('./app');
const env = require('./config/env');
const connectDatabase = require('./config/database');

async function start() {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.log(`[server] Bookly API listening on port ${env.port} (${env.nodeEnv})`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`[server] ${signal} received, shutting down gracefully...`);
    server.close(() => {
      console.log('[server] closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (err) => {
    console.error('[server] Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });
}

start();
