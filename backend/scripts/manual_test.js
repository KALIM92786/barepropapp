const { Client } = require('pg');
const axios = require('axios');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

async function runDiagnostics() {
    console.log('🔍 --- BareProp System Diagnostics ---');

    // 1. Test Database Connection
    console.log('\n1️⃣  Testing Database Connection...');
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await client.connect();
        console.log('   ✅ Database Connected');

        // Check for Seed Data
        const userRes = await client.query("SELECT count(*) FROM users WHERE username='admin'");
        const accountRes = await client.query("SELECT count(*) FROM accounts");
        
        if (parseInt(userRes.rows[0].count) > 0) {
            console.log('   ✅ Admin User Found');
        } else {
            console.warn('   ⚠️  Admin User Missing (Run setup_db.js)');
        }
        console.log(`   ℹ️  Active Accounts: ${accountRes.rows[0].count}`);

    } catch (err) {
        console.error('   ❌ Database Error:', err.message);
    } finally {
        await client.end();
    }

    // 2. Test Server Health Endpoint
    console.log('\n2️⃣  Testing Server API...');
    try {
        const res = await axios.get(`${BASE_URL}/health`);
        if (res.status === 200 && res.data.status === 'ok') {
            console.log('   ✅ Server is Running (Health Check Passed)');
            console.log(`   ℹ️  Server Uptime: ${res.data.uptime.toFixed(2)}s`);
        }
    } catch (err) {
        console.error(`   ❌ Server Unreachable at ${BASE_URL}`);
        console.error('      Ensure server is running: npm start');
    }
}

runDiagnostics();