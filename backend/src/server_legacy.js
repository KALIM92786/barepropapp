require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { Pool } = require('pg');
const TelegramBot = require('node-telegram-bot-api');
const SyncService = require('./syncService');
const { authenticateToken } = require('./authMiddleware');
const authRoutes = require('./authRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const telegramBot = process.env.TELEGRAM_BOT_TOKEN 
    ? new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false }) 
    : null;
const syncService = new SyncService(io, telegramBot);

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// --- Health Check ---
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), uptime: process.uptime() });
});

// --- API Endpoints ---

// Get Account Analytics (Equity Curve)
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

// Get Trade History
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

// --- WebSocket Connection ---
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('subscribe', (accountId) => {
        socket.join(`account_${accountId}`);
    });
});

// --- Start Server & Sync ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
    console.log(`BareProp Server running on port ${PORT}`);
    
    try {
        const { rows: accounts } = await pool.query('SELECT * FROM accounts WHERE is_active = true');
        if (accounts.length > 0) {
            console.log(`Initializing sync for ${accounts.length} accounts...`);
            await syncService.init(accounts);
        } else {
            console.log('No active accounts found to sync.');
        }
    } catch (err) {
        console.error('Failed to initialize sync service:', err.message);
    }
});