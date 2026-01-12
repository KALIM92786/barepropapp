const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
require("dotenv").config();

// Safety check
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set. Aborting.");
  process.exit(1);
}

if (!process.env.STOCKSTRADER_ACCOUNT_ID) {
  console.error("❌ STOCKSTRADER_ACCOUNT_ID is not set. Aborting.");
  process.exit(1);
}

// Connect to Render PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createTestUser() {
  try {
    console.log("🔌 Connecting to Render PostgreSQL...");

    const email = "kalim199919@gmail.com";
    const password = "Kalim@2020";
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ Create or update user
    const userRes = await pool.query(
      `
      INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, 'admin')
      ON CONFLICT (email)
      DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin'
      RETURNING id, email, role
      `,
      [email, hashedPassword]
    );

    const user = userRes.rows[0];
    console.log("✅ User ready:", user.email, "Role:", user.role);

    // 2️⃣ Link RoboForex account
    const accountId = process.env.STOCKSTRADER_ACCOUNT_ID;

    await pool.query(
      `
      INSERT INTO accounts (id, user_id, currency, status)
      VALUES ($1, $2, 'USD', 'active')
      ON CONFLICT (id)
      DO UPDATE SET user_id = EXCLUDED.user_id, status = 'active'
      `,
      [accountId, user.id]
    );

    console.log("✅ RoboForex account linked:", accountId);
    console.log("👉 Login Email:", email);
    console.log("👉 Login Password:", password);
    console.log("🎯 You can now log in at https://bareprop-frontend.onrender.com");

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await pool.end();
  }
}

createTestUser();
