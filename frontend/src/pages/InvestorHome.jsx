import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function InvestorHome() {
  const [account, setAccount] = useState(null);
  const [equity, setEquity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const acc = await axios.get(`${API}/api/investor/account`, { withCredentials: true });
        const eq = await axios.get(`${API}/api/investor/equity`, { withCredentials: true });

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
        <Stat label="Balance" value={`$${account.balance.toFixed(2)}`} />
        <Stat label="Free Margin" value={`$${account.free_margin.toFixed(2)}`} />
        <Stat label="Margin" value={`$${account.margin.toFixed(2)}`} />
        <Stat label="Status" value={account.status} />
      </div>

      {/* Equity chart placeholder */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4">
        <h3 className="font-semibold mb-2">Equity Curve</h3>
        {equity.length === 0 && <p className="text-gray-400 text-sm">No data yet</p>}
        {equity.length > 0 && (
          <ul className="text-xs">
            {equity.slice(-7).map((e, i) => (
              <li key={i}>${e.equity} – {new Date(e.created_at).toLocaleDateString()}</li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
