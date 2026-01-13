import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SignalsHistory() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth header is injected globally by AuthContext
    axios.get(`${API}/api/signals/history`)
      .then(r => setTrades(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading history...</div>;

  return (
    <div className="p-4 min-h-screen bg-gray-100 dark:bg-black">
      <h1 className="text-xl font-bold mb-4">Trade History</h1>

      {trades.length === 0 && <p className="text-gray-400">No trades yet</p>}

      {trades.map(t => (
        <div key={t.id} className="bg-white dark:bg-gray-900 p-3 rounded-xl mb-2 shadow">
          <div className="flex justify-between">
            <span className="font-bold">{t.ticker} <span className={t.side === 'BUY' ? "text-green-500" : "text-red-500"}>{t.side}</span></span>
            <span className={t.profit >= 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
              {t.profit.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mt-1">
             <span className="text-xs text-gray-400">Vol: {t.volume}</span>
             <span className="text-xs text-gray-400">
                {new Date(t.close_time * 1000).toLocaleString()}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
}
