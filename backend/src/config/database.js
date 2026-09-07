// config/database.js
const mongoose = require('mongoose');
const env = require('./env');

async function connectDatabase() {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.mongodbUri);
    console.log(`[db] connected -> ${mongoose.connection.name}`);
  } catch (error) {
    console.error('[db] connection failed:', error.message);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[db] error:', err.message);
  });
}

module.exports = connectDatabase;
