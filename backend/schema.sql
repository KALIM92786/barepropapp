CREATE TABLE IF NOT EXISTS accounts (
    account_id VARCHAR(50) PRIMARY KEY,
    currency VARCHAR(10),
    balance DECIMAL(15, 2),
    equity DECIMAL(15, 2),
    margin DECIMAL(15, 2),
    free_margin DECIMAL(15, 2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deals (
    id VARCHAR(50) PRIMARY KEY,
    account_id VARCHAR(50),
    ticker VARCHAR(20),
    volume DECIMAL(15, 2),
    side VARCHAR(10),
    open_price DECIMAL(15, 5),
    open_time BIGINT,
    close_price DECIMAL(15, 5),
    close_time BIGINT,
    profit DECIMAL(15, 2),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    account_id VARCHAR(50),
    ticker VARCHAR(20),
    volume DECIMAL(15, 2),
    side VARCHAR(10),
    type VARCHAR(20),
    status VARCHAR(20),
    price DECIMAL(15, 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS positions (
    id VARCHAR(50) PRIMARY KEY,
    account_id VARCHAR(50),
    ticker VARCHAR(20),
    volume DECIMAL(15, 2),
    side VARCHAR(10),
    open_price DECIMAL(15, 5),
    current_price DECIMAL(15, 5),
    profit DECIMAL(15, 2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS equity_snapshots (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(50),
    equity DECIMAL(15, 2),
    balance DECIMAL(15, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);