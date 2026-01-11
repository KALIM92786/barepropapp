const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function viewData() {
    const client = await pool.connect();
    try {
        const tables = ['accounts', 'positions', 'deals', 'orders', 'equity_snapshots'];
        
        for (const table of tables) {
            const res = await client.query(`SELECT * FROM ${table} LIMIT 5`);
            console.log(`\n=== ${table.toUpperCase()} (Top 5) ===`);
            if (res.rows.length === 0) {
                console.log('No data found.');
            } else {
                console.table(res.rows);
            }
        }
    } catch (err) {
        console.error('Database Error:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

viewData();