import React from 'react';
import { useSocket } from '../context/SocketContext';

const Positions = () => {
    const { liveData } = useSocket();
    const orders = liveData.openOrders || [];

    return (
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Live Open Positions</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50 text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="p-4">Symbol</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Volume</th>
                            <th className="p-4">Entry Price</th>
                            <th className="p-4">Current Price</th>
                            <th className="p-4">Profit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">No open positions</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="p-4 font-bold text-white">{order.ticker}</td>
                                    <td className={`p-4 font-semibold ${order.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>{order.side.toUpperCase()}</td>
                                    <td className="p-4 text-gray-300">{order.volume}</td>
                                    <td className="p-4 text-gray-300">{order.price}</td>
                                    <td className="p-4 text-gray-300">--</td> {/* Current price requires quote feed */}
                                    <td className="p-4 text-gray-300">--</td> {/* Floating PL requires quote feed */}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Positions;