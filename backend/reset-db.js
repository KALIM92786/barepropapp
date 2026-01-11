const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function resetDb() {
    const client = await pool.connect();
    try {
        console.log('Dropping existing tables...');
        await client.query('DROP TABLE IF EXISTS positions, deals, orders, equity_snapshots, accounts CASCADE');
        
        console.log('Re-creating tables from schema.sql...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        
        console.log('Database reset complete.');
    } catch (err) {
        console.error('Error resetting database:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

resetDb();