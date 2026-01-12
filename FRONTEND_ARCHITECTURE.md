# Frontend Architecture & Feature Design

This document outlines the design for upgrading the BareProp frontend from a simple status page to a full trading dashboard.

## 1. Tech Stack & Dependencies
- **Framework**: React 18 (Vite)
- **State Management**: React Context (AuthProvider, SocketProvider)
- **Styling**: Tailwind CSS (Dark Mode optimized)
- **Charts**: Recharts (for Equity/Balance curves)
- **Real-time**: Socket.IO Client
- **Routing**: React Router DOM

## 2. Component Structure

```text
src/
├── components/
│   ├── Layout/
│   │   ├── Sidebar.jsx       # Navigation (Dashboard, History, Settings)
│   │   └── Header.jsx        # Account Selector, Connection Status
│   ├── Dashboard/
│   │   ├── StatCard.jsx      # Reusable card for Balance, Equity, Margin
│   │   ├── EquityChart.jsx   # Line chart of historical performance
│   │   └── PositionsTable.jsx# Active open positions grid
│   ├── Trading/
│   │   └── OrderForm.jsx     # Buy/Sell/Limit order entry
│   └── History/
│       └── DealsTable.jsx    # Closed trade history
├── context/
│   ├── AuthContext.jsx       # User session & JWT handling
│   └── SocketContext.jsx     # WebSocket connection & event listeners
└── pages/
    ├── Login.jsx
    └── Dashboard.jsx         # Main composition
```

## 3. Feature Specifications

### A. Account Selector (Header)
- **Function**: Allows switching between multiple trading accounts.
- **Data Source**: `GET /api/accounts`
- **Behavior**: Changing account updates the global `currentAccountId` context, triggering a refresh of all dashboard widgets.

### B. Equity Curve Chart
- **Visual**: Area/Line chart showing Account Growth.
- **Data Source**: `GET /api/analytics/:accountId` (Backend queries `equity_snapshots` table).
- **X-Axis**: Time (formatted).
- **Y-Axis**: Balance (Blue) and Equity (Green).
- **Tooltip**: Shows exact values on hover.

### C. Active Positions Grid
- **Data Source**: Initial load via API, updates via WebSocket `market_update` event.
- **Columns**:
  - Symbol (e.g., EURUSD)
  - Type (Buy/Sell)
  - Volume (Lots)
  - Open Price vs Current Price
  - **Profit/Loss** (Color-coded: Green/Red)
- **Actions**: "Close" button (calls `DELETE /api/orders/:id`).

### D. Order Entry Terminal
- **Inputs**: Symbol, Volume, Order Type (Market/Limit), SL/TP.
- **Validation**: Ensure volume > 0, SL/TP logic.
- **API**: `POST /api/orders`.

## 4. Data Flow & State

### WebSocket Events
The frontend should listen for these events from `bareprop_backend`:

| Event Name | Payload | Action |
|------------|---------|--------|
| `connect` | - | Set status to "Online" |
| `market_update_:accountId` | `{ equity, balance, positions[] }` | Update Stats & Positions Table |
| `order_update` | `{ orderId, status }` | Toast notification (Filled/Rejected) |

## 5. Proposed Dashboard Layout (Code Draft)

Below is a conceptual implementation for the main Dashboard component.

```jsx
// src/pages/Dashboard.jsx
import React, { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import StatCard from '../components/Dashboard/StatCard';
import EquityChart from '../components/Dashboard/EquityChart';
import PositionsTable from '../components/Dashboard/PositionsTable';

const Dashboard = () => {
  const { accountState, isConnected } = useContext(SocketContext);
  
  // Default values if data hasn't streamed in yet
  const { 
    balance = 0, 
    equity = 0, 
    margin = 0, 
    freeMargin = 0, 
    positions = [] 
  } = accountState || {};

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Balance" value={balance} prefix="$" />
        <StatCard title="Equity" value={equity} prefix="$" highlight />
        <StatCard title="Margin" value={margin} prefix="$" />
        <StatCard title="Free Margin" value={freeMargin} prefix="$" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Charts & Positions (Takes 2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Performance Growth</h2>
            <EquityChart />
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Open Positions ({positions.length})</h2>
            <PositionsTable data={positions} />
          </div>
        </div>

        {/* Right Col: Trading Terminal (Takes 1/3 width) */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 p-4 rounded-lg shadow-lg h-full">
            <h2 className="text-xl font-bold mb-4">Place Order</h2>
            {/* <OrderForm /> component goes here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```