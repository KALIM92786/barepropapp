import React, { useState, useEffect } from 'react';

const Dashboard = ({ accountId }) => {
  const [status, setStatus] = useState('Connecting to Backend...');
  const [backendData, setBackendData] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Use the environment variable set in Render
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('Testing connection to:', apiUrl);

        const response = await fetch(`${apiUrl}/health`);
        const data = await response.json();

        if (data.status === 'ok') {
          setStatus('Online');
          setBackendData(data);
          
          // Fetch Analytics (Requires Auth in production, might fail here if not logged in)
          try {
             const token = localStorage.getItem('token'); // Assuming token storage
             const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
             
             const analyticsRes = await fetch(`${apiUrl}/api/analytics/${accountId}`, { headers });
             if (analyticsRes.ok) setAnalytics(await analyticsRes.json());

             const tradesRes = await fetch(`${apiUrl}/api/trades/${accountId}`, { headers });
             if (tradesRes.ok) setTrades(await tradesRes.json());

          } catch (e) {
             console.warn("Could not fetch protected data:", e);
          }
        } else {
          setStatus('Backend Error');
        }
      } catch (error) {
        console.error('Connection failed:', error);
        setStatus('Connection Failed (Check CORS/URL)');
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Trading Dashboard</h1>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">System Status</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p className="mb-2"><strong>Frontend:</strong> <span className="text-green-600">Live</span></p>
              <p className="mb-2">
                <strong>Backend Connection:</strong>{' '}
                <span className={status === 'Online' ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {status}
                </span>
              </p>
              {backendData && (
                <p className="text-xs text-gray-400">
                  Server Uptime: {Math.floor(backendData.uptime)}s
                </p>
              )}
              <p className="mt-4 pt-4 border-t"><strong>Account ID:</strong> {accountId}</p>
            </div>

            {/* Simple Analytics Preview */}
            {analytics.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h4 className="font-medium text-gray-900">Recent Performance</h4>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Current Equity: ${analytics[0].equity}</p>
                  <p>Current Balance: ${analytics[0].balance}</p>
                </div>
              </div>
            )}

            {/* Recent Trades Preview */}
            {trades.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h4 className="font-medium text-gray-900">Recent Trades</h4>
                <ul className="mt-2 divide-y divide-gray-200">
                  {trades.slice(0, 5).map((trade) => (
                    <li key={trade.id} className="py-2 flex justify-between text-sm">
                      <span>{trade.ticker} ({trade.side})</span>
                      <span className={trade.profit >= 0 ? "text-green-600" : "text-red-600"}>
                        ${trade.profit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
