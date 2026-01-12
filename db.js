const { Pool } = require('pg');

// Load environment variables for local development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Debug connection details (excluding password)
console.log('Database Config:', {
  host: process.env.DB_HOST || 'localhost (fallback)',
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') ? 'Enabled' : 'Disabled'
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // Enable SSL for external Render connections (local dev), disable for internal (production)
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') 
    ? { rejectUnauthorized: false } 
    : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};