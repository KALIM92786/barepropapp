const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'new_password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_DATABASE || 'barepropdb'}`,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function createTestUser() {
  try {
    console.log('🔌 Connecting to database...');
    
    // 1. Create User
    const email = 'kalim199919@gmail.com';
    const password = 'Kalim@2020';
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRes = await pool.query(
      `INSERT INTO users (email, password_hash, role) 
       VALUES ($1, $2, 'admin') 
       ON CONFLICT (email) DO UPDATE SET password_hash = $2
       RETURNING id`,
      [email, hashedPassword]
    );
    
    const userId = userRes.rows[0].id;
    console.log(`✅ User created: ${email} (Password: ${password})`);

    // 2. Link Account (Required for Dashboard)
    const accountId = process.env.STOCKSTRADER_ACCOUNT_ID || '93172055';
    
    await pool.query(
      `INSERT INTO accounts (id, user_id, name, type, currency, status)
       VALUES ($1, $2, 'Main Account', 'demo', 'USD', 'active')
       ON CONFLICT (id) DO UPDATE SET user_id = $2`,
      [accountId, userId]
    );
    console.log(`✅ Account linked: ${accountId}`);

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

createTestUser();