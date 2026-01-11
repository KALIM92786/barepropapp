import React from 'react';
import { LiveDashboard } from './components/LiveDashboard';
import { EquityChart } from './components/EquityChart';
import { useSocketData } from './hooks/useSocketData';

function App() {
  const { isConnected, equityHistory } = useSocketData();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">StocksTrader Mirror</h1>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isConnected ? '● Live Connected' : '○ Disconnected'}
          </div>
        </div>

        {/* Chart Section */}
        <EquityChart data={equityHistory} />

        {/* Dashboard Grid */}
        <LiveDashboard />
        
      </div>
    </div>
  );
}

export default App;