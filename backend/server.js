const express = require('express');
const cors = require('cors');
const http = require('http');
const db = require('./src/db');
const websocket = require('./src/websocket');
const syncJob = require('./src/jobs/sync');
const apiRoutes = require('./src/routes/api');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB
db.initDb();

// Initialize WebSockets
websocket.init(server);

// Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/', async (req, res) => {
  try {
    await db.query('SELECT NOW()');
    res.send('StocksTrader Mirror Backend Running & DB Connected');
  } catch (err) {
    res.status(500).send('Backend Running but DB Connection Failed: ' + err.message);
  }
});

// Start Sync Job
syncJob.start();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});