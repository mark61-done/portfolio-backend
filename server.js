const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import middleware
const { auth, adminAuth } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);

// ----------------------
// Socket.io setup
// ----------------------
const io = new Server(server, {
  cors: { origin: '*' } // adjust in production
});

// Make io accessible in routes if needed
app.set('io', io);

// ----------------------
// Middleware
// ----------------------
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debug logger
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📍 Body:', req.body);
  }
  next();
});

// ----------------------
// Helper to safely import routers
// ----------------------
const safeImport = (routerPath) => {
  const router = require(routerPath);
  if (!router || (typeof router !== 'function' && !router.stack)) {
    console.error(`❌ Invalid router export from ${routerPath}. Must export Express router.`);
    process.exit(1);
  }
  return router;
};

// ----------------------
// Public Routes
// ----------------------
app.use('/api/projects', safeImport('./routes/projects'));
app.use('/api/skills', safeImport('./routes/skills'));

// Pass io to contact route
app.use('/api/contact', require('./routes/contact')(io));

app.use('/api/auth', safeImport('./routes/auth'));

// ----------------------
// Admin Routes (Protected)
// ----------------------
app.use('/api/admin/projects', auth, adminAuth, safeImport('./routes/admin/projects'));
app.use('/api/admin/messages', auth, adminAuth, safeImport('./routes/admin/messages'));
app.use('/api/admin/skills', auth, adminAuth, safeImport('./routes/admin/skills'));

// ----------------------
// Basic test route
// ----------------------
app.get('/', (req, res) => res.json({ message: 'Portfolio API is running!' }));

// ----------------------
// MongoDB Connection
// ----------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
connectDB();

// ----------------------
// Start server
// ----------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
