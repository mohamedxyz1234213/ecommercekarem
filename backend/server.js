const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Database connection
const connectDB = require('./config/db');

// Passport config
require('./config/passport')(passport);

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');

const sessionSecret =
  process.env.SESSION_SECRET ||
  (isProduction ? null : crypto.randomBytes(32).toString('hex'));

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set in production');
}

if (!process.env.SESSION_SECRET && !isProduction) {
  console.warn('SESSION_SECRET is not set. Using ephemeral session secret for development only.');
}

if (isProduction) {
  app.set('trust proxy', 1);
}

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(isProduction ? 'combined' : 'dev'));
}

// CORS — in development, allow any origin so phone (LAN IP + Vite port) can reach the API.
const normalizeOrigin = (value) => String(value || '').trim().replace(/\/$/, '');

const extraAllowedOrigins = String(process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const allowedOrigins = new Set(
  [
    process.env.CLIENT_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    ...extraAllowedOrigins,
  ]
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean)
);

const corsAllowAny =
  !isProduction || process.env.CORS_ALLOW_ALL === 'true';
const allowVercelPreviews = process.env.CORS_ALLOW_VERCEL_PREVIEWS === 'true';

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      const normalized = normalizeOrigin(origin);
      const isVercelPreview = normalized.endsWith('.vercel.app');

      if (
        corsAllowAny ||
        allowedOrigins.has(normalized) ||
        (allowVercelPreviews && isVercelPreview)
      ) {
        return callback(null, true);
      }
      console.warn(`CORS blocked for origin: ${normalized}`);
      return callback(new Error(`CORS blocked for origin: ${normalized}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session
app.use(
  session({
    secret: sessionSecret,
    proxy: isProduction,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static files — serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/settings', require('./routes/settings'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Warmup endpoint (useful for scheduled pings on serverless platforms).
// This does not fully eliminate cold starts on Vercel, but helps reduce them.
app.get('/api/warmup', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    // Optional lightweight DB roundtrip if connected.
    if (dbState === 1) {
      await mongoose.connection.db.admin().ping();
    }
    return res.json({
      status: 'warmed',
      dbConnected: dbState === 1,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      status: 'warmup_failed',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, HOST, () => {
      const mode = process.env.NODE_ENV || 'development';
      console.log(`Server listening on http://${HOST}:${PORT} (${mode})`);
      if (HOST === '0.0.0.0') {
        console.log('Reachable on your LAN — use this PC IP from phone (e.g. http://192.168.x.x:' + PORT + '/api)');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
