require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

// Internal Imports
const pool = require('./config/db');
const SyncService = require('./services/syncService');
const authRoutes = require('./routes/authRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');

const app = express();
const server = http.createServer(app);

// Production CORS Setup
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
};

const io = new Server(server, {
    cors: corsOptions
});

const telegramBot = process.env.TELEGRAM_BOT_TOKEN 
    ? new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false }) 
    : null;

const syncService = new SyncService(io, telegramBot);

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', authRoutes);

// --- Health Check ---
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), uptime: process.uptime() });
});

// --- API Endpoints ---
app.get('/api/analytics/:accountId', authenticateToken, async (req, res) => {
    try {
        const { accountId } = req.params;
        const result = await pool.query(`
            SELECT timestamp, equity, balance 
            FROM account_snapshots 
            WHERE account_id = $1 
            ORDER BY timestamp DESC LIMIT 500
        `, [accountId]);
        res.json(result.rows.reverse());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/trades/:accountId', authenticateToken, async (req, res) => {
    try {
        const { accountId } = req.params;
        const result = await pool.query(`
            SELECT * FROM deals WHERE account_id = $1 ORDER BY close_time DESC LIMIT 100
        `, [accountId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
    console.log(`BareProp Server running on port ${PORT}`);
    // Initialize Sync
    const { rows: accounts } = await pool.query('SELECT * FROM accounts WHERE is_active = true');
    if (accounts.length > 0) await syncService.init(accounts);
});