const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('subscribe', async ({ accountId }) => {
      console.log(`Client ${socket.id} subscribed to account ${accountId}`);
      socket.join(`account_${accountId}`);
      
      // Send immediate initial data
      try {
        const positionsRes = await pool.query('SELECT * FROM positions WHERE account_id = $1', [accountId]);
        const snapshotRes = await pool.query('SELECT * FROM equity_snapshots WHERE account_id = $1 ORDER BY created_at DESC LIMIT 1', [accountId]);
        
        const snapshot = snapshotRes.rows[0] || {};
        
        socket.emit(`market_update_${accountId}`, {
          balance: parseFloat(snapshot.balance || 0),
          equity: parseFloat(snapshot.equity || 0),
          margin: parseFloat(snapshot.margin || 0),
          freeMargin: parseFloat(snapshot.free_margin || 0),
          positions: positionsRes.rows
        });
      } catch (err) {
        console.error('Error fetching initial socket data:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Helper to broadcast updates (can be imported elsewhere)
  return {
    broadcastUpdate: (accountId, data) => {
      io.to(`account_${accountId}`).emit(`market_update_${accountId}`, data);
    }
  };
};