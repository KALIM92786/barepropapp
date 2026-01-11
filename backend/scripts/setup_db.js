const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { encrypt } = require('../src/utils/encryption');

async function setup() {
    console.log('--- BareProp Database Setup ---');

    // 1. Create DB if not exists (Connect to default 'postgres' db)
    const sysClient = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: 'postgres'
    });

    try {
        await sysClient.connect();
        const dbName = process.env.DB_DATABASE;
        const res = await sysClient.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        
        if (res.rowCount > 0) {
            console.log(`Dropping database "${dbName}"...`);
            // Terminate other connections to the database
            await sysClient.query(`
                SELECT pg_terminate_backend(pid) FROM pg_stat_activity 
                WHERE datname = '${dbName}' AND pid <> pg_backend_pid()
            `);
            await sysClient.query(`DROP DATABASE "${dbName}"`);
        }
        
        console.log(`Creating database "${dbName}"...`);
        await sysClient.query(`CREATE DATABASE "${dbName}"`);
    } catch (e) {
        console.error('Error checking/creating database:', e.message);
        process.exit(1);
    } finally {
        await sysClient.end();
    }

    // 2. Run Schema & Seed (Connect to actual app db)
    const db = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await db.connect();

        console.log('Applying schema...');
        const schema = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
        await db.query(schema);

        console.log('Seeding initial data...');
        // Insert Admin User
        const adminPassword = await bcrypt.hash('admin123', 10);
        
        await db.query(`
            INSERT INTO users (username, password_hash, role)
            VALUES ('admin', $1, 'admin')
            ON CONFLICT (username) DO NOTHING
        `, [adminPassword]);

        // Insert Master Account from ENV
        if (process.env.RSTOCK_ACCOUNT_ID && process.env.RSTOCK_TOKEN) {
             const encryptedToken = encrypt(process.env.RSTOCK_TOKEN);
             await db.query(`
                INSERT INTO accounts (user_id, external_account_id, name, api_token, is_active)
                VALUES ((SELECT id FROM users WHERE username='admin'), $1, 'Master Account', $2, true)
                ON CONFLICT (external_account_id) DO UPDATE SET api_token = EXCLUDED.api_token
            `, [process.env.RSTOCK_ACCOUNT_ID, encryptedToken]);
            console.log(`Master account ${process.env.RSTOCK_ACCOUNT_ID} seeded.`);
        }

        console.log('✅ Setup complete.');
    } catch (e) {
        console.error('❌ Setup failed:', e.message);
    } finally {
        await db.end();
    }
}
setup();