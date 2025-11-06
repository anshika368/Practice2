require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middleware/errorHandler');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const zoneRoutes = require('./src/routes/zoneRoutes');
const lostPersonRoutes = require('./src/routes/lostPersonRoutes');
const medicalRoutes = require('./src/routes/medicalRoutes');
const emergencyExitRoutes = require('./src/routes/emergencyExitRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');

// Initialize express
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/lost-persons', lostPersonRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/emergency-exits', emergencyExitRoutes);
app.use('/api/feedback', feedbackRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Crowd Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      events: '/api/events',
      zones: '/api/zones',
      lostPersons: '/api/lost-persons',
      medical: '/api/medical',
      emergencyExits: '/api/emergency-exits',
      feedback: '/api/feedback'
    }
  });
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinEvent', (eventId) => {
    socket.join(`event-${eventId}`);
    console.log(`Client ${socket.id} joined event ${eventId}`);
  });

  socket.on('updateZoneCrowd', (data) => {
    io.to(`event-${data.eventId}`).emit('zoneCrowdUpdated', data);
  });

  socket.on('updateExitStatus', (data) => {
    io.to(`event-${data.eventId}`).emit('exitStatusUpdated', data);
  });

  socket.on('newLostPerson', (data) => {
    io.to(`event-${data.eventId}`).emit('lostPersonReported', data);
  });

  socket.on('medicalEmergency', (data) => {
    io.to(`event-${data.eventId}`).emit('medicalAlert', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };
