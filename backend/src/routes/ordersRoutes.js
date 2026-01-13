const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// All routes require authentication
router.use(authenticateToken);

// Trader & Admin routes - Live signals
router.get('/signals/live', authenticateToken, async (req, res) => {
  try {
    // Get active deals for live signals
    const result = await pool.query(`
      SELECT 
        d.ticker,
        d.side,
        d.volume,
        d.open_price,
        d.open_time,
        d.profit,
        d.status
      FROM deals d
      LEFT JOIN accounts a ON d.account_id = a.id
      WHERE d.status = 'open'
      ORDER BY d.open_time DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Trader & Admin routes - Signal history
router.get('/signals/history', authenticateToken, async (req, res) => {
  try {
    // Get closed deals for signal history
    const result = await pool.query(`
      SELECT 
        d.ticker,
        d.side,
        d.volume,
        d.open_price,
        d.close_price,
        d.open_time,
        d.close_time,
        d.profit,
        d.status
      FROM deals d
      LEFT JOIN accounts a ON d.account_id = a.id
      WHERE d.status = 'closed'
      ORDER BY d.close_time DESC
      LIMIT 50
    `);
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;