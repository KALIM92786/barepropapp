import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function SignalsLive() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`${API}/api/signals/live`, { withCredentials: true });
        setPositions(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-4">Loading signals…</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-4">
      <h1 className="text-xl font-bold mb-4">Live Signals</h1>

      {positions.length === 0 && (
        <p className="text-gray-400">No active trades</p>
      )}

      <div className="space-y-3">
        {positions.map(p => (
          <SignalCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}

function SignalCard({ p }) {
  const isBuy = p.side === "BUY";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
      <div className="flex justify-between">
        <div>
          <h2 className="font-bold">{p.ticker}</h2>
          <p className={`text-sm ${isBuy ? "text-green-500" : "text-red-500"}`}>
            {p.side}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Entry</p>
          <p className="font-bold">{p.open_price}</p>
        </div>
      </div>

      <div className="mt-2 flex justify-between text-sm">
        <div>
          <p className="text-gray-400">Volume</p>
          <p>{p.volume}</p>
        </div>
        <div>
          <p className="text-gray-400">Floating P/L</p>
          <p className={p.floating_profit >= 0 ? "text-green-500" : "text-red-500"}>
            {p.floating_profit.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
