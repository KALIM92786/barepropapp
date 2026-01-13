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

// Investor routes - accessible to investors and admins
router.get('/investor/account', requireRole('investor'), async (req, res) => {
  try {
    // Get latest equity snapshot for investor's accounts
    const result = await pool.query(`
      SELECT 
        e.equity,
        e.balance,
        e.margin,
        e.free_margin,
        e.unrealized_pl,
        e.created_at as last_update
      FROM equity_snapshots e
      LEFT JOIN accounts a ON e.account_id = a.id
      WHERE a.user_id = $1
      ORDER BY e.created_at DESC
      LIMIT 1
    `, [req.user.id]);
    
    const data = result.rows[0] || {
      equity: 0,
      balance: 0,
      margin: 0,
      free_margin: 0,
      unrealized_pl: 0,
      last_update: null
    };
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/investor/equity', requireRole('investor'), async (req, res) => {
  try {
    // Get equity history for charts
    const result = await pool.query(`
      SELECT 
        e.equity,
        e.balance,
        e.created_at
      FROM equity_snapshots e
      LEFT JOIN accounts a ON e.account_id = a.id
      WHERE a.user_id = $1
      ORDER BY e.created_at ASC
      LIMIT 100
    `, [req.user.id]);
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin routes
router.get('/', requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM accounts');
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;