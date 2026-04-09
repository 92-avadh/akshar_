require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const contactRoutes = require('./routes/contactRoutes'); // <-- NEW: Imported contact routes
const couponRoutes = require('./routes/couponRoutes');
const { assignRequestId, requestLogger } = require('./middleware/requestContext');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';
const requestSizeLimit = process.env.REQUEST_SIZE_LIMIT || '1mb';
const uploadsDir = path.join(__dirname, 'uploads');

connectDB();

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (process.env.TRUST_PROXY === 'true' || isProduction) {
  app.set('trust proxy', 1);
}

const allowedOrigins = (process.env.CORS_ORIGIN || process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(assignRequestId);

// <-- FIX: Commented out the request logger to stop the massive JSON spam in terminal
// app.use(requestLogger); 

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(
  express.json({
    limit: requestSizeLimit,
    verify: (req, res, buf) => {
      req.rawBody = Buffer.from(buf);
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: requestSizeLimit }));
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please try again later.' },
  })
);
app.use('/uploads', express.static(uploadsDir));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ToyBlix API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the ToyBlix API!',
    health: '/health',
  });
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes); // <-- NEW: Added contact route endpoint
app.use('/api/coupons', couponRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(
    JSON.stringify({
      level: 'info',
      type: 'server_started',
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
    })
  );
});

const shutdown = async (signal) => {
  console.log(
    JSON.stringify({
      level: 'info',
      type: 'shutdown_started',
      signal,
    })
  );

  server.close(async (error) => {
    if (error) {
      console.error(JSON.stringify({ level: 'error', type: 'shutdown_error', message: error.message }));
      process.exit(1);
    }

    try {
      await connectDB.disconnectDB();
      process.exit(0);
    } catch (disconnectError) {
      console.error(
        JSON.stringify({
          level: 'error',
          type: 'shutdown_error',
          message: disconnectError.message,
        })
      );
      process.exit(1);
    }
  });
};

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    shutdown(signal);
  });
});

process.on('unhandledRejection', (reason) => {
  console.error(
    JSON.stringify({
      level: 'error',
      type: 'unhandled_rejection',
      message: reason instanceof Error ? reason.message : String(reason),
    })
  );
});

module.exports = app;