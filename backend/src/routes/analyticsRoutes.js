const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

router.get('/:accountId', async (req, res) => {
  const { accountId } = req.params;
  try {
    // Fetch last 100 equity snapshots for the chart
    const query = `
      SELECT * FROM equity_snapshots 
      WHERE account_id = $1 
      ORDER BY created_at ASC 
      LIMIT 100
    `;
    const result = await pool.query(query, [accountId]);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;