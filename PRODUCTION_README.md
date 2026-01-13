# BareProp Trading Platform - Production Deployment Guide

## Overview

BareProp is a private trading & investment platform that mirrors live trading data from RoboForex R-StocksTrader into a cloud dashboard. It operates as:

- **Prop Trading Firm**: Manages investor capital with transparency
- **Investor Reporting Portal**: Shows equity, profit, drawdown, performance
- **Trading Signal Subscription**: Provides live buy/sell signals to subscribers

## Architecture

```
RoboForex R-StocksTrader (Master Account)
           ↓
      BareProp Backend (Node.js + Express + PostgreSQL)
           ↓
      Real-time WebSocket Feed
           ↓
      BareProp Frontend (React + Vite)
    ↙              ↘
Investor Dashboard   Signals Dashboard
```

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL 12+
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/KALIM92786/barepropapp.git
cd barepropapp
```

### 2. Database Setup

```bash
# Create database
createdb bareprop

# Run schema
psql bareprop < backend/db/schema.sql

# Create initial admin user
node backend/create_test_user.js
```

### 3. Environment Configuration

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/bareprop
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=bareprop
DB_PASSWORD=your_secure_password
DB_PORT=5432

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_change_in_production

# Frontend URL
FRONTEND_URL=https://your-frontend-url.com

# StocksTrader API Configuration (Optional)
RSTOCK_BASE_URL=https://api.stockstrader.com/api/v1
STOCKSTRADER_TOKEN=your_stockstrader_api_token_here
STOCKSTRADER_ACCOUNT_ID=your_account_id_here

# Telegram Bot Configuration (Optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

#### Frontend (.env)

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=https://your-backend-url.com
```

### 4. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 5. Build & Run

#### Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

#### Production

```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd ../backend
npm start
```

## Render Deployment

### 1. Deploy Database

1. Go to Render Dashboard → Create New → PostgreSQL
2. Name: `bareprop-db`
3. Database: `bareprop`
4. User: `bareprop_user`
5. Plan: Free or Starter
6. Click Create
7. Copy the Internal Database URL

### 2. Deploy Backend

1. Go to Render Dashboard → Create New → Web Service
2. Connect your GitHub repository
3. Build Settings:
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node src/index.js`
4. Environment Variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: [From database]
   - `JWT_SECRET`: [Generate secure secret]
   - `FRONTEND_URL`: [Your frontend URL]
5. Click Deploy Web Service

### 3. Deploy Frontend

1. Go to Render Dashboard → Create New → Static Site
2. Connect your GitHub repository
3. Build Settings:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Environment Variables:
   - `VITE_API_URL`: [Your backend URL]
5. Click Deploy Static Site

## Role-Based Access Control

### Roles

1. **Investor**
   - Can view: Equity, Balance, Profit, Drawdown, Growth Curve
   - Cannot view: Individual trades, entry/exit points, strategy
   - Navigation: Dashboard only

2. **Trader**
   - Can view: Live signals, trade history, entries, exits
   - Cannot view: Investor accounts, financial data
   - Navigation: Live Signals, History

3. **Admin**
   - Full access to all features
   - User management
   - Account settings
   - All dashboards

### API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/accounts/investor/account` - Investor account data
- `GET /api/accounts/investor/equity` - Equity history
- `GET /api/signals/signals/live` - Live trading signals
- `GET /api/signals/signals/history` - Signal history
- `GET /api/admin/users` - List all users (admin only)
- `POST /api/admin/users` - Create user (admin only)
- `PUT /api/admin/users/:id` - Update user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

## Database Schema

### Tables

- **users** - User accounts with roles (investor, trader, admin)
- **accounts** - Trading accounts linked to users
- **equity_snapshots** - Historical equity data
- **deals** - Completed trades
- **positions** - Open positions
- **orders** - Pending orders
- **prices** - Real-time price data
- **trade_logs** - Trade event logs

## Security Best Practices

1. **Change JWT_SECRET** in production
2. **Use strong database passwords**
3. **Enable SSL** for database connections in production
4. **Set up proper CORS origins** in production
5. **Use HTTPS** for all endpoints
6. **Implement rate limiting** for API endpoints
7. **Regular security updates** for dependencies

## Troubleshooting

### Build Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Connection Error

```bash
# Check DATABASE_URL in .env
# Verify PostgreSQL is running
# Test connection:
psql $DATABASE_URL
```

### WebSocket Not Connecting

```bash
# Check backend logs for Socket.IO errors
# Verify CORS settings in backend/src/index.js
# Check firewall rules for WebSocket connections
```

### Authentication Issues

```bash
# Verify JWT_SECRET matches between frontend and backend
# Check token expiration in localStorage
# Verify user role in database:
psql bareprop -c "SELECT * FROM users;"
```

## Support

For issues and questions:
- GitHub Issues: https://github.com/KALIM92786/barepropapp/issues
- Documentation: See inline code comments

## License

Proprietary - All rights reserved

---

**BareProp Trading Platform v1.0.0**
*Professional Prop Trading & Signal Distribution*