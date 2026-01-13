import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function SignalsHistory() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/signals/history`, { withCredentials: true })
      .then(r => setTrades(r.data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-4 min-h-screen bg-gray-100 dark:bg-black">
      <h1 className="text-xl font-bold mb-4">Trade History</h1>

      {trades.length === 0 && <p className="text-gray-400">No trades yet</p>}

      {trades.map(t => (
        <div key={t.id} className="bg-white dark:bg-gray-900 p-3 rounded-xl mb-2 shadow">
          <div className="flex justify-between">
            <span>{t.ticker} {t.side}</span>
            <span className={t.profit >= 0 ? "text-green-500" : "text-red-500"}>
              {t.profit.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {new Date(t.close_time * 1000).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
