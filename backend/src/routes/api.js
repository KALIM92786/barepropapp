const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/positions
router.get('/positions', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM positions ORDER BY updated_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/history
router.get('/history', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM deals WHERE status = $1 ORDER BY close_time DESC LIMIT 100', ['closed']);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/equity
router.get('/equity', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM equity_snapshots ORDER BY timestamp DESC LIMIT 500');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/drawdown
router.get('/drawdown', async (req, res) => {
    try {
        // Simple drawdown calculation based on stored snapshots
        const result = await db.query('SELECT equity FROM equity_snapshots ORDER BY timestamp ASC');
        const equities = result.rows.map(r => parseFloat(r.equity));
        let maxEquity = 0;
        let maxDrawdown = 0;

        equities.forEach(eq => {
            if (eq > maxEquity) maxEquity = eq;
            const dd = (maxEquity - eq) / maxEquity * 100;
            if (dd > maxDrawdown) maxDrawdown = dd;
        });

        res.json({ max_drawdown_percent: maxDrawdown.toFixed(2) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/analytics
router.get('/analytics', async (req, res) => {
    const stats = await db.query('SELECT COUNT(*) as total_trades, SUM(profit) as total_profit FROM deals WHERE status = $1', ['closed']);
    res.json(stats.rows[0]);
});

module.exports = router;