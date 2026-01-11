-- Users and Roles
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'trader', 'investor', 'signal_user')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Master Accounts
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    external_account_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    api_token TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMP
);

-- Account Performance Snapshots
CREATE TABLE IF NOT EXISTS account_snapshots (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    balance DECIMAL(15, 2),
    equity DECIMAL(15, 2),
    margin DECIMAL(15, 2),
    free_margin DECIMAL(15, 2),
    unrealized_pl DECIMAL(15, 2)
);

-- Orders (Active and History)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    ticker VARCHAR(20) NOT NULL,
    side VARCHAR(10),
    type VARCHAR(20),
    volume DECIMAL(15, 6),
    price DECIMAL(15, 6),
    status VARCHAR(20),
    create_time BIGINT,
    last_modified BIGINT,
    raw_data JSONB
);

-- Deals (Executed Trades)
CREATE TABLE IF NOT EXISTS deals (
    id VARCHAR(50) PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    ticker VARCHAR(20) NOT NULL,
    side VARCHAR(10),
    volume DECIMAL(15, 6),
    open_price DECIMAL(15, 6),
    close_price DECIMAL(15, 6),
    open_time BIGINT,
    close_time BIGINT,
    profit DECIMAL(15, 2),
    status VARCHAR(20),
    raw_data JSONB
);

-- Daily Stats
CREATE TABLE IF NOT EXISTS daily_stats (
    account_id INTEGER REFERENCES accounts(id),
    date DATE,
    daily_pl DECIMAL(15, 2),
    peak_equity DECIMAL(15, 2),
    max_drawdown DECIMAL(15, 2),
    PRIMARY KEY (account_id, date)
);

-- Trade Logs (Audit Trail)
CREATE TABLE IF NOT EXISTS trade_logs (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    message TEXT,
    level VARCHAR(20) DEFAULT 'INFO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Views
CREATE OR REPLACE VIEW open_positions AS 
SELECT * FROM orders WHERE status = 'active' OR status = 'working';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_snapshots_account_time ON account_snapshots(account_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_orders_account ON orders(account_id);
CREATE INDEX IF NOT EXISTS idx_deals_account ON deals(account_id);