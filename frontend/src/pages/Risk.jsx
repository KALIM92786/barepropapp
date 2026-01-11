import React from 'react';
import { useSocket } from '../context/SocketContext';

const Risk = () => {
    const { liveData } = useSocket();
    const equity = liveData.equity || 1; // Avoid div by zero
    const totalExposure = liveData.openOrders.reduce((acc, order) => acc + (order.volume * 100000), 0); // Assuming standard lots
    const leverageUsed = totalExposure / equity;

    return (
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Risk Management</h2>
            <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Effective Leverage</span>
                    <span className="text-white font-bold">{leverageUsed.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Total Exposure (Est. USD)</span>
                    <span className="text-white font-bold">${totalExposure.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};
export default Risk;