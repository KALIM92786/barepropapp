-- Users and Roles
-- =========================================
-- BAREPROP DATABASE SCHEMA
-- =========================================

BEGIN;

-- USERS (admin, trader, investor, signal)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password_hash TEXT,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ROBOFOREX ACCOUNTS
CREATE TABLE accounts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(50),
    currency VARCHAR(10),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ACCOUNT SNAPSHOTS (Equity & Margin)
CREATE TABLE equity_snapshots (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(50) REFERENCES accounts(id),
    balance NUMERIC(18,2),
    equity NUMERIC(18,2),
    margin NUMERIC(18,2),
    free_margin NUMERIC(18,2),
    unrealized_pl NUMERIC(18,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- OPEN & CLOSED DEALS (Positions)
CREATE TABLE deals (
    id VARCHAR(50) PRIMARY KEY,
    account_id VARCHAR(50) REFERENCES accounts(id),
    ticker VARCHAR(20) NOT NULL,
    side VARCHAR(10),
    volume NUMERIC(18,4),
    open_price NUMERIC(18,5),
    open_time BIGINT,
    close_price NUMERIC(18,5),
    close_time BIGINT,
    profit NUMERIC(18,2),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ACTIVE POSITIONS (Fast access)
CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    deal_id VARCHAR(50) REFERENCES deals(id),
    account_id VARCHAR(50),
    ticker VARCHAR(20),
    side VARCHAR(10),
    volume NUMERIC(18,4),
    open_price NUMERIC(18,5),
    open_time BIGINT,
    floating_profit NUMERIC(18,2),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ORDERS (limit, stop, history)
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    account_id VARCHAR(50),
    ticker VARCHAR(20),
    side VARCHAR(10),
    type VARCHAR(20),
    volume NUMERIC(18,4),
    price NUMERIC(18,5),
    status VARCHAR(20),
    created_at BIGINT
);

-- TRADE LOG (Everything that changes)
CREATE TABLE trade_logs (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50),
    reference_id VARCHAR(50),
    payload JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRICE HISTORY (XAUUSD quotes)
CREATE TABLE prices (
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(20),
    bid NUMERIC(18,5),
    ask NUMERIC(18,5),
    last NUMERIC(18,5),
    timestamp BIGINT
);

-- INDEXES FOR SPEED
CREATE INDEX idx_deals_account ON deals(account_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_equity_account ON equity_snapshots(account_id);
CREATE INDEX idx_positions_account ON positions(account_id);
CREATE INDEX IF NOT EXISTS idx_orders_account ON orders(account_id);
CREATE INDEX idx_prices_symbol ON prices(ticker);

COMMIT;