import React, { useState, useEffect } from 'react';

const Dashboard = ({ accountId }) => {
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    // Simulate connection or fetch data here
    setStatus('Connected');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Trading Dashboard</h1>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Account Overview</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p><strong>Account ID:</strong> {accountId}</p>
              <p><strong>System Status:</strong> <span className="text-green-600">{status}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
