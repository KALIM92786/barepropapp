import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';

const OrderForm = () => {
  const { token } = useContext(AuthContext);
  const { currentAccountId } = useContext(SocketContext);
  const [ticker, setTicker] = useState('');
  const [volume, setVolume] = useState(0.01);
  const [side, setSide] = useState('buy');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentAccountId) return setMessage({ type: 'error', text: 'No account selected' });
    
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          accountId: currentAccountId,
          ticker: ticker.toUpperCase(),
          volume: parseFloat(volume),
          side,
          type: 'market' // Default to market for now
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Order placed successfully' });
        setTicker('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Order failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 h-full">
      <h2 className="text-lg font-semibold mb-4 text-slate-200">Place Order</h2>
      {message && (
        <div className={`p-2 mb-4 rounded text-sm ${message.type === 'success' ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-400 text-xs uppercase font-bold mb-1">Symbol</label>
          <input 
            type="text" 
            value={ticker}
            onChange={e => setTicker(e.target.value)}
            className="w-full bg-slate-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none uppercase"
            placeholder="EURUSD"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-xs uppercase font-bold mb-1">Volume</label>
            <input 
              type="number" 
              step="0.01"
              min="0.01"
              value={volume}
              onChange={e => setVolume(e.target.value)}
              className="w-full bg-slate-700 text-white rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs uppercase font-bold mb-1">Side</label>
            <select 
              value={side}
              onChange={e => setSide(e.target.value)}
              className={`w-full p-2 rounded font-bold outline-none ${side === 'buy' ? 'bg-green-900/50 text-green-400 border border-green-700' : 'bg-red-900/50 text-red-400 border border-red-700'}`}
            >
              <option value="buy">BUY</option>
              <option value="sell">SELL</option>
            </select>
          </div>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 rounded font-bold text-white transition ${side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : `${side.toUpperCase()} ${ticker || '...'}`}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;