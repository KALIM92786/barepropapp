import React, { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import StatCard from '../components/Dashboard/StatCard';
import EquityChart from '../components/Dashboard/EquityChart';
import PositionsTable from '../components/Dashboard/PositionsTable';
import Header from '../components/Layout/Header';
import OrderForm from '../components/Trading/OrderForm';

const Dashboard = () => {
  const { accountState } = useContext(SocketContext);
  
  // Default values if data hasn't streamed in yet
  const { 
    balance = 0, 
    equity = 0, 
    margin = 0, 
    freeMargin = 0, 
    positions = [] 
  } = accountState || {};

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      
      <main className="p-6 max-w-7xl mx-auto">
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
            <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-slate-200">Performance Growth</h2>
              <EquityChart />
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-slate-200">Open Positions ({positions.length})</h2>
              <PositionsTable data={positions} />
            </div>
          </div>

          {/* Right Col: Trading Terminal Placeholder */}
          <div className="lg:col-span-1">
            <OrderForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;