BEGIN;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255),
    type VARCHAR(50),
    currency VARCHAR(10),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equity_snapshots (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(50) REFERENCES accounts(id),
    balance NUMERIC(18,2),
    equity NUMERIC(18,2),
    margin NUMERIC(18,2),
    free_margin NUMERIC(18,2),
    unrealized_pl NUMERIC(18,2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deals (
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

CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    deal_id VARCHAR(50),
    account_id VARCHAR(50),
    ticker VARCHAR(20),
    side VARCHAR(10),
    volume NUMERIC(18,4),
    open_price NUMERIC(18,5),
    open_time BIGINT,
    current_price NUMERIC(18,5),
    profit NUMERIC(18,2),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
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

CREATE TABLE IF NOT EXISTS trade_logs (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50),
    reference_id VARCHAR(50),
    payload JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prices (
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(20),
    bid NUMERIC(18,5),
    ask NUMERIC(18,5),
    last NUMERIC(18,5),
    timestamp BIGINT
);

CREATE INDEX IF NOT EXISTS idx_deals_account ON deals(account_id);
CREATE INDEX IF NOT EXISTS idx_equity_account ON equity_snapshots(account_id);
CREATE INDEX IF NOT EXISTS idx_positions_account ON positions(account_id);
CREATE INDEX IF NOT EXISTS idx_prices_symbol ON prices(ticker);
CREATE INDEX IF NOT EXISTS idx_orders_account ON orders(account_id);

COMMIT;
