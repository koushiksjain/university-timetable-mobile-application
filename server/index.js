require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

// Import configurations
const dbConfig = require('./config/db');
const authConfig = require('./config/auth');
const constants = require('./config/constants');

// Import middleware
const { authenticate, optionalAuthenticate } = require('./middleware/auth');
const { requireRole } = require('./middleware/role');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const commonRoutes = require('./routes/common.routes');
const coordinatorRoutes = require('./routes/coordinator.routes');
const studentRoutes = require('./routes/student.routes');
const teacherRoutes = require('./routes/teacher.routes');

// Import services
// const { validatePythonEnvironment } = require('./services/timetable/pythonExecutor.service');
const { logger, morganStream } = require('./utils/logger');

// Initialize Express app
const app = express();

// Database connection
dbConfig();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://172.16.0.48:8081',
    'exp://172.16.0.48:8081',
    process.env.FRONTEND_PROD_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: morganStream }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', apiLimiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/common', authenticate, commonRoutes);
app.use('/api/coordinator', authenticate, requireRole('coordinator'), coordinatorRoutes);
app.use('/api/student', authenticate, requireRole('student'), studentRoutes);
app.use('/api/teacher', authenticate, requireRole('teacher'), teacherRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Python environment validation (on startup)
// validatePythonEnvironment()
//   .then(() => logger.info('Python environment validated successfully'))
//   .catch(err => logger.error('Python environment validation failed:', err.message));

// Server startup
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;