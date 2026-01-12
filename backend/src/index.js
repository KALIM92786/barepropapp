require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Import Socket Handler
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Initialize Socket Logic
const socketHelpers = socketHandler(io);

// Middleware to pass io to routes
app.use((req, res, next) => {
  req.io = io;
  req.socketHelpers = socketHelpers;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), uptime: process.uptime() });
});

app.get('/', (req, res) => {
  res.send('BareProp Backend is Running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});