// app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');

const env = require('./config/env');
const { apiLimiter } = require('./middlewares/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { sendSuccess } = require('./utils/apiResponse');
const routes = require('./routes'); // aggregated router — populated module by module

const app = express();

// --- Security & core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl === '*' ? true : env.clientUrl,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize()); // strips $ and . from req.body/query/params keys
app.use((req, res, next) => {
  console.log('📥 REQUEST RECEIVED');
  console.log(req.method, req.originalUrl);
  console.log('Body:', req.body);
  next();
});
// --- Logging ---
app.use(morgan(env.isProd ? 'combined' : 'dev'));

// --- Rate limiting (applied to all /api routes; auth routes get a stricter
// limiter layered on top in their own route file) ---
app.use('/api', apiLimiter);

// --- Static file serving for local uploads (dev only; Cloudinary in prod) ---
app.use('/uploads', express.static('uploads'));

// --- Health check ---
app.get('/health', (req, res) => {
  sendSuccess(res, { message: 'Bookly API is running', data: { uptime: process.uptime() } });
});

// --- API routes ---
app.use('/api', routes);

// --- 404 + global error handler (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
