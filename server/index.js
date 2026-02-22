const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route - THIS FIXES THE "CANNOT GET /" ERROR
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: '🎮 GeoGuessr Backend Server',
    endpoints: {
      health: '/api/health',
      socket: 'WebSocket on same port'
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'GeoGuessr API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    data: { 
      message: 'Backend is working!',
      time: new Date().toLocaleTimeString()
    }
  });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('🎮 New client connected:', socket.id);
  
  // Send welcome message
  socket.emit('welcome', { 
    message: 'Connected to GeoGuessr server!',
    id: socket.id 
  });
  
  // Handle matchmaking
  socket.on('join-matchmaking', (data) => {
    console.log('Player joining matchmaking:', data);
    socket.join('matchmaking');
    socket.emit('matchmaking-joined', { 
      status: 'waiting',
      message: 'Looking for opponent...'
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎮 Test route: http://localhost:${PORT}/api/test`);
  console.log('='.repeat(50) + '\n');
});