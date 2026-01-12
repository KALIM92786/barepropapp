import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';

const Header = () => {
  const { user, logout, token } = useContext(AuthContext);
  const { isConnected, currentAccountId, setCurrentAccountId } = useContext(SocketContext);
  const [accounts, setAccounts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/accounts`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.data) {
          setAccounts(data.data);
          // Auto-select first account if none selected
          if (!currentAccountId && data.data.length > 0) {
            setCurrentAccountId(data.data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load accounts", err);
      }
    };
    if (token) fetchAccounts();
  }, [token, API_URL, currentAccountId, setCurrentAccountId]);

  return (
    <header className="bg-slate-800 border-b border-slate-700 h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-blue-500 tracking-tight">BareProp</h1>
        <div className={`px-2 py-0.5 rounded text-xs font-medium ${isConnected ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
          {isConnected ? 'LIVE' : 'OFFLINE'}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <select 
          className="bg-slate-700 text-white text-sm rounded px-3 py-1.5 border-none focus:ring-2 focus:ring-blue-500 outline-none"
          value={currentAccountId || ''}
          onChange={(e) => setCurrentAccountId(e.target.value)}
        >
          {accounts.map(acc => (
            <option key={acc.id} value={acc.id}>{acc.name} ({acc.id})</option>
          ))}
        </select>
        <button onClick={logout} className="text-sm text-slate-400 hover:text-white">Logout</button>
      </div>
    </header>
  );
};

export default Header;