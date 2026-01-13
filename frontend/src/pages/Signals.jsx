import React from 'react';
import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const Signals = () => {
    const { history } = useContext(SocketContext);
    // In a real app, this would be a separate feed of "signals" (entry points), 
    // but here we can visualize recent trades as signals.
    const recentTrades = history.slice(0, 10);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Signal Feed</h2>
            {recentTrades.map(trade => (
                <div key={trade.id} className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500 flex justify-between items-center">
                    <div>
                        <div className="font-bold text-lg text-white">{trade.ticker}</div>
                        <div className="text-sm text-gray-400">{new Date(trade.close_time * 1000).toLocaleString()}</div>
                    </div>
                    <div className={`text-xl font-bold ${trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.side.toUpperCase()}
                    </div>
                </div>
            ))}
        </div>
    );
};
export default Signals;