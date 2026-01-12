const { Pool } = require("pg");
require("dotenv").config();

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
  // Enable SSL for Render connections, disable for local if needed
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') 
    ? { rejectUnauthorized: false } 
    : false,
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
