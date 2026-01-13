import React from 'react';
import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const Analytics = () => {
    const { history } = useContext(SocketContext);

    // Calculate Metrics
    const totalTrades = history.length;
    const winningTrades = history.filter(d => d.profit > 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const totalProfit = history.reduce((acc, curr) => acc + curr.profit, 0);
    const avgWin = history.filter(d => d.profit > 0).reduce((acc, curr) => acc + curr.profit, 0) / (winningTrades || 1);
    const avgLoss = history.filter(d => d.profit < 0).reduce((acc, curr) => acc + curr.profit, 0) / ((totalTrades - winningTrades) || 1);
    const profitFactor = Math.abs(avgLoss) > 0 ? (avgWin * winningTrades) / Math.abs(avgLoss * (totalTrades - winningTrades)) : 0;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm">Win Rate</div>
                    <div className="text-3xl font-bold text-green-400">{winRate.toFixed(1)}%</div>
                    <div className="w-full bg-gray-700 h-2 mt-2 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${winRate}%` }}></div>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm">Profit Factor</div>
                    <div className="text-3xl font-bold text-blue-400">{profitFactor.toFixed(2)}</div>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm">Total Net Profit</div>
                    <div className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${totalProfit.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm mb-2">Average Win</div>
                    <div className="text-2xl font-bold text-green-400">${avgWin.toFixed(2)}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-sm mb-2">Average Loss</div>
                    <div className="text-2xl font-bold text-red-400">${avgLoss.toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;