import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SignalsLive() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    // Initial fetch via REST to populate data immediately
    const fetchInitial = async () => {
      try {
        const res = await axios.get(`${API}/api/signals/signals/live`);
        setPositions(res.data);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Failed to fetch initial signals.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for real-time updates from the server
    socket.on("signals_update", (data) => {
      setPositions(data);
    });
    
    // Listen for individual signal updates
    socket.on("signal_open", (signal) => {
      setPositions(prev => [...prev, signal]);
    });
    
    socket.on("signal_close", (signalId) => {
      setPositions(prev => prev.filter(p => p.id !== signalId));
    });

    return () => {
      socket.off("signals_update");
    };
  }, [socket]);

  if (loading) return <div className="p-4">Loading signals…</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-4">
      <h1 className="text-xl font-bold mb-4">Live Signals</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {positions.length === 0 && !error && (
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
