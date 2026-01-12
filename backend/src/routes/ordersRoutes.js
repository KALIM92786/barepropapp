const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

router.post('/', async (req, res) => {
  const { accountId, ticker, volume, side, type } = req.body;
  
  // Basic validation
  if (!accountId || !ticker || !volume || !side) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // In a real app, this would call the StocksTrader API
    // For now, we just log it to the database as a pending order
    const orderId = `ord_${Date.now()}`;
    const query = `
      INSERT INTO orders (id, account_id, ticker, side, type, volume, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending', $7)
      RETURNING *
    `;
    const result = await pool.query(query, [orderId, accountId, ticker, side, type || 'market', volume, Date.now()]);
    res.status(201).json({ message: 'Order placed', order: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
});

module.exports = router;