const StocksTraderClient = require('./stocksTrader');
const pool = require('../config/db');
const { decrypt } = require('../utils/encryption');

class SyncService {
    constructor(io, telegramBot) {
        this.io = io;
        this.telegramBot = telegramBot;
        this.clients = new Map();
        this.intervals = new Map();
    }

    async init(accounts) {
        for (const acc of accounts) {
            try {
                const decryptedToken = decrypt(acc.api_token);
                this.clients.set(acc.id, new StocksTraderClient(decryptedToken, acc.external_account_id));
                this.startPolling(acc.id);
            } catch (e) {
                console.error(`Failed to init account ${acc.id}:`, e.message);
            }
        }
    }

    startPolling(dbAccountId) {
        if (this.intervals.has(dbAccountId)) return;
        const interval = setInterval(async () => {
            await this.syncAccount(dbAccountId);
        }, 5000);
        this.intervals.set(dbAccountId, interval);
    }

    async syncAccount(dbAccountId) {
        const client = this.clients.get(dbAccountId);
        if (!client) return;

        try {
            const accountRes = await pool.query('SELECT last_synced_at FROM accounts WHERE id = $1', [dbAccountId]);
            const lastSynced = accountRes.rows[0]?.last_synced_at;
            const fromTimestamp = lastSynced ? new Date(lastSynced).getTime() : 0;

            const state = await client.getAccountState();
            await this.saveSnapshot(dbAccountId, state);
            
            const orders = await client.getActiveOrders();
            await this.saveOrders(dbAccountId, orders);

            const deals = await client.getDealsHistory(fromTimestamp); 
            const newDeals = await this.saveDeals(dbAccountId, deals);

            const updatePayload = {
                accountId: dbAccountId,
                equity: state.margin.equity,
                balance: state.margin.balance,
                openOrders: orders,
                timestamp: Date.now()
            };

            this.io.emit(`market_update_${dbAccountId}`, updatePayload);

            if (newDeals.length > 0) {
                this.broadcastSignals(newDeals);
            }

            await this.updateDailyStats(dbAccountId);
            await pool.query('UPDATE accounts SET last_synced_at = NOW() WHERE id = $1', [dbAccountId]);

        } catch (error) {
            console.error(`Sync failed for account ${dbAccountId}:`, error.message);
        }
    }

    async saveSnapshot(accountId, state) {
        await pool.query(`
            INSERT INTO account_snapshots (account_id, balance, equity, margin, free_margin, unrealized_pl)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [accountId, state.margin.balance, state.margin.equity, state.margin.margin, state.margin.free_margin, state.margin.unrealized_pl]);
    }

    async saveOrders(accountId, orders) {
        for (const order of orders) {
            await pool.query(`
                INSERT INTO orders (id, account_id, ticker, side, type, volume, price, status, create_time, raw_data)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                ON CONFLICT (id) DO UPDATE SET 
                    status = EXCLUDED.status, 
                    volume = EXCLUDED.volume,
                    last_modified = extract(epoch from now())
            `, [order.id, accountId, order.ticker, order.side, order.type, order.volume, order.price, order.status, order.create_time, JSON.stringify(order)]);
        }
    }

    async saveDeals(accountId, deals) {
        const newDeals = [];
        for (const deal of deals) {
            const res = await pool.query(`
                INSERT INTO deals (id, account_id, ticker, side, volume, open_price, close_price, open_time, close_time, profit, status, raw_data)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                ON CONFLICT (id) DO NOTHING
                RETURNING id
            `, [deal.id, accountId, deal.ticker, deal.side, deal.volume, deal.open_price, deal.close_price, deal.open_time, deal.close_time, deal.profit, deal.status, JSON.stringify(deal)]);
            if (res.rowCount > 0) newDeals.push(deal);
        }
        return newDeals;
    }

    broadcastSignals(deals) {
        if (!this.telegramBot || !process.env.TELEGRAM_CHAT_ID) return;
        deals.forEach(deal => {
            const message = `🔔 *New Trade Closed*\nSymbol: ${deal.ticker}\nSide: ${deal.side}\nProfit: ${deal.profit}`;
            this.telegramBot.sendMessage(process.env.TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' })
                .catch(err => console.error('Telegram Error:', err.message));
        });
    }

    async updateDailyStats(accountId) {
        const query = `
            INSERT INTO daily_stats (account_id, date, daily_pl, peak_equity, max_drawdown)
            WITH today_deals AS (
                SELECT COALESCE(SUM(profit), 0) as total_pl
                FROM deals
                WHERE account_id = $1 AND to_timestamp(close_time / 1000.0)::date = CURRENT_DATE
            ),
            today_snapshots AS (
                SELECT MAX(equity) as peak, MIN(equity) as low
                FROM account_snapshots
                WHERE account_id = $1 AND timestamp::date = CURRENT_DATE
            )
            SELECT
                $1, CURRENT_DATE,
                (SELECT total_pl FROM today_deals),
                COALESCE((SELECT peak FROM today_snapshots), 0),
                COALESCE((SELECT peak - low FROM today_snapshots), 0)
            ON CONFLICT (account_id, date) DO UPDATE SET
                daily_pl = EXCLUDED.daily_pl,
                peak_equity = EXCLUDED.peak_equity,
                max_drawdown = EXCLUDED.max_drawdown
        `;
        try {
            await pool.query(query, [accountId]);
        } catch (err) {
            console.error(`Stats update failed for ${accountId}:`, err.message);
        }
    }
}
module.exports = SyncService;