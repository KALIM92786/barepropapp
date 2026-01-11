# BareProp Action Plan and Progress

## Phase 1: Initialization & Configuration
- [x] Define Database Schema (`schema.sql`)
- [x] Create Core Backend Logic (`server.js`, `syncService.js`, `stocksTrader.js`)
- [x] Create Project Configuration (`package.json`, `.env`)
- [x] Fix Import Paths to match file structure

## Phase 2: Frontend Setup
- [x] Create Dashboard Component (`Dashboard.jsx`)
- [x] Setup React Build Tool (Vite)
- [x] Create Entry Points (`index.html`, `main.jsx`)
- [x] Move Frontend files to `frontend/` directory

## Phase 3: Deployment & Testing
- [x] Create Database Setup Script (`setup_db.js`)
- [x] Update Server to load accounts (`server.js`)
- [x] Fix Database Setup Script & Env Vars
- [x] Install Backend Dependencies & Start Server
- [x] Start Frontend Dev Server
- [x] Verify Real-time WebSocket Connection

## Phase 4: User Interface & Security
- [x] Add Connection Status Indicator to Dashboard
- [x] Implement User Login & Authentication (Backend)
- [x] Implement Frontend Login UI and Route Protection
- [x] Create Role-based Dashboards (Admin vs Investor)

## Phase 5: Containerization & Deployment
- [x] Create Backend Dockerfile
- [x] Create Frontend Dockerfile & Nginx Config
- [x] Create Docker Compose Configuration
- [x] Verify Docker Deployment

## Phase 6: Enhancements & Optimization
- [x] Integrate Telegram Bot for Signal Broadcasting
- [x] Implement Daily Stats Aggregation
- [x] Encrypt API Tokens at rest
- [x] Optimize Deal History Sync (Incremental Sync)

## Current Task
Phase 6 Complete. System Fully Optimized.

## Backend API Documentation

### HTTP Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Authenticates user, returns JWT token. |
| GET | `/health` | No | Returns server status and uptime. |
| GET | `/api/analytics/:accountId` | Yes | Returns historical equity/balance snapshots. |
| GET | `/api/trades/:accountId` | Yes | Returns recent trade history (deals). |

### WebSocket Events
| Direction | Event Name | Description |
|-----------|------------|-------------|
| Client -> Server | `subscribe` | Client requests to join account room (payload: `accountId`). |
| Server -> Client | `market_update_{accountId}` | Real-time update containing equity, balance, and open orders. |

### Backend Architecture
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **External Integration**: RoboForex R StocksTrader API (Polled every 5s via `SyncService`)