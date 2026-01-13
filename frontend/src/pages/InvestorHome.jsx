import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import StatCard from '../components/StatCard';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function InvestorHome() {
  const [account, setAccount] = useState(null);
  const [equity, setEquity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Auth header is injected globally by AuthContext
        const acc = await axios.get(`${API}/api/accounts/investor/account`);
        const eq = await axios.get(`${API}/api/accounts/investor/equity`);

        setAccount(acc.data);
        setEquity(eq.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!account) return <div className="p-4 text-red-500">Unable to load account data.</div>;

  const profit = account.equity - account.balance;
  const profitPct = ((profit / account.balance) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-4">
      
      {/* Top Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 mb-4">
        <h2 className="text-gray-500 text-sm">Total Equity</h2>
        <h1 className="text-3xl font-bold">${account.equity.toFixed(2)}</h1>
        <p className={`text-sm ${profit >= 0 ? "text-green-500" : "text-red-500"}`}>
          {profit >= 0 ? "+" : ""}{profit.toFixed(2)} ({profitPct}%)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard label="Balance" value={`$${account.balance.toFixed(2)}`} />
        <StatCard label="Free Margin" value={`$${account.free_margin.toFixed(2)}`} />
        <StatCard label="Margin" value={`$${account.margin.toFixed(2)}`} />
        <StatCard label="Status" value={account.status} />
      </div>

      {/* Equity chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4 h-64">
        <h3 className="font-semibold mb-4">Equity Curve</h3>
        {equity.length > 0 ? (
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={equity} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="created_at" 
                tickFormatter={(time) => new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={['dataMin - 100', 'dataMax + 100']}
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937', // bg-gray-800
                  border: '1px solid #374151', // border-gray-700
                  borderRadius: '0.5rem',
                }}
                labelFormatter={(time) => new Date(time).toLocaleString()}
                formatter={(value) => [`$${value.toFixed(2)}`, 'Equity']}
              />
              <Area type="monotone" dataKey="equity" stroke="#82ca9d" fillOpacity={1} fill="url(#colorEquity)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-sm flex items-center justify-center h-full">No equity data available to display chart.</p>
        )}
      </div>

    </div>
  );
}
