const db = require('../db');
const api = require('../services/stocksTrader');
const ws = require('../websocket');

const ACCOUNT_ID = process.env.STOCKSTRADER_ACCOUNT_ID;

const syncData = async () => {
    if (!ACCOUNT_ID) {
        console.error('STOCKSTRADER_ACCOUNT_ID is missing in .env');
        return;
    }

    try {
        // 1. Fetch Account State
        const accountRes = await api.getAccount(ACCOUNT_ID);
        if (accountRes && accountRes.data) {
            const { margin } = accountRes.data;
            
            // Update Account Table
            await db.query(
                `INSERT INTO accounts (account_id, balance, equity, margin, free_margin)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (account_id) DO UPDATE 
                 SET balance = EXCLUDED.balance, equity = EXCLUDED.equity, 
                     margin = EXCLUDED.margin, free_margin = EXCLUDED.free_margin, updated_at = NOW()`,
                [ACCOUNT_ID, margin.balance, margin.equity, margin.margin, margin.free_margin]
            );

            // Record Equity Snapshot
            await db.query(
                `INSERT INTO equity_snapshots (account_id, equity, balance) VALUES ($1, $2, $3)`,
                [ACCOUNT_ID, margin.equity, margin.balance]
            );

            ws.broadcast('equity_update', { equity: margin.equity, balance: margin.balance });
        }

        // 2. Fetch Deals & Positions
        const dealsRes = await api.getDeals(ACCOUNT_ID);
        if (dealsRes && dealsRes.data) {
            const deals = dealsRes.data;
            
            // Process Closed Deals (History)
            for (const deal of deals) {
                if (deal.status === 'closed') {
                    await db.query(
                        `INSERT INTO deals (id, account_id, ticker, volume, side, open_price, open_time, close_price, close_time, profit, status)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                         ON CONFLICT (id) DO NOTHING`,
                        [deal.id, ACCOUNT_ID, deal.ticker, deal.volume, deal.side, deal.open_price, deal.open_time, deal.close_price, deal.close_time, deal.profit, deal.status]
                    );
                }
            }

            // Process Open Deals (Positions)
            // We clear positions and rewrite them to ensure sync
            await db.query('DELETE FROM positions WHERE account_id = $1', [ACCOUNT_ID]);
            
            const openDeals = deals.filter(d => d.status === 'open' || d.status === 'active'); // Adjust based on actual API status for open trades
            
            for (const pos of openDeals) {
                // For positions, we might need current price. 
                // In a real scenario, we'd fetch quote for each, but here we just store what we have or fetch XAUUSD as requested.
                await db.query(
                    `INSERT INTO positions (id, account_id, ticker, volume, side, open_price, profit)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [pos.id, ACCOUNT_ID, pos.ticker, pos.volume, pos.side, pos.open_price, pos.profit]
                );
            }
            
            ws.broadcast('positions_update', openDeals);
        }

        // 3. Fetch Orders
        const ordersRes = await api.getOrders(ACCOUNT_ID);
        if (ordersRes && ordersRes.data) {
            for (const order of ordersRes.data) {
                await db.query(
                    `INSERT INTO orders (id, account_id, ticker, volume, side, type, status, price)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                     ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status`,
                    [order.id, ACCOUNT_ID, order.ticker, order.volume, order.side, order.type, order.status, order.price]
                );
            }
            ws.broadcast('orders_update', ordersRes.data);
        }

        // 4. Fetch XAUUSD Quote
        const quoteRes = await api.getQuote(ACCOUNT_ID, 'XAUUSD');
        if (quoteRes && quoteRes.data) {
            ws.broadcast('price_update', { ticker: 'XAUUSD', ...quoteRes.data });
        }

    } catch (err) {
        console.error('Sync Job Error:', err.message);
    }
};

const start = () => {
    console.log('Starting Data Sync Service (Interval: 3s)...');
    // Initial run
    syncData();
    // Loop
    setInterval(syncData, 3000);
};

module.exports = { start };