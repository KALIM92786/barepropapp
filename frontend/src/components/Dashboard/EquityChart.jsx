import React, { useEffect, useState, useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SocketContext } from '../../context/SocketContext';
import { AuthContext } from '../../context/AuthContext';

const EquityChart = () => {
  const { currentAccountId } = useContext(SocketContext);
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!currentAccountId || !token) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/analytics/${currentAccountId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const result = await response.json();
          // Transform data for Recharts if necessary
          // Assuming backend returns { data: [{ timestamp, balance, equity }, ...] }
          const formattedData = result.data.map(item => ({
            ...item,
            time: new Date(item.created_at || item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch chart data", error);
      }
    };

    fetchData();
    // Set up an interval to refresh chart data periodically or listen to socket updates
    const interval = setInterval(fetchData, 60000); 
    return () => clearInterval(interval);
  }, [currentAccountId, token, API_URL]);

  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-slate-500">No chart data available</div>;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis dataKey="time" stroke="#9ca3af" tick={{fontSize: 12}} />
          <YAxis stroke="#9ca3af" domain={['auto', 'auto']} tick={{fontSize: 12}} />
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }} />
          <Area type="monotone" dataKey="equity" stroke="#10b981" fillOpacity={1} fill="url(#colorEquity)" strokeWidth={2} />
          <Area type="monotone" dataKey="balance" stroke="#3b82f6" fill="none" strokeWidth={2} strokeDasharray="5 5" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EquityChart;