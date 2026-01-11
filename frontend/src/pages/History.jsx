import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';

const History = () => {
    const { history } = useSocket();
    const [filter, setFilter] = useState('');

    const filteredHistory = history.filter(deal => 
        deal.ticker.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Trade History</h2>
                <input 
                    type="text" 
                    placeholder="Filter by symbol..." 
                    className="bg-gray-900 border border-gray-600 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-green-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50 text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="p-4">Close Time</th>
                            <th className="p-4">Symbol</th>
                            <th className="p-4">Side</th>
                            <th className="p-4">Volume</th>
                            <th className="p-4">Entry</th>
                            <th className="p-4">Exit</th>
                            <th className="p-4">Profit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredHistory.map((deal) => (
                            <tr key={deal.id} className="hover:bg-gray-700/30 transition-colors">
                                <td className="p-4 text-gray-400 text-sm">{new Date(deal.close_time * 1000).toLocaleString()}</td>
                                <td className="p-4 font-bold text-white">{deal.ticker}</td>
                                <td className={`p-4 font-semibold ${deal.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>{deal.side.toUpperCase()}</td>
                                <td className="p-4 text-gray-300">{deal.volume}</td>
                                <td className="p-4 text-gray-300">{deal.open_price}</td>
                                <td className="p-4 text-gray-300">{deal.close_price}</td>
                                <td className={`p-4 font-bold ${deal.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    ${deal.profit.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;