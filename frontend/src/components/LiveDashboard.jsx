import React from 'react';
import { useSocketData } from '../hooks/useSocketData';

export const LiveDashboard = () => {
    const { isConnected, equity, positions, tradeHistory, prices } = useSocketData();

    if (!isConnected) {
        return <div className="p-4 text-center text-gray-500">Connecting to live feed...</div>;
    }

    return (
        <div className="p-4 space-y-6">
            {/* Account Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Summary</h2>
                {equity ? (
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Balance</p>
                            <p className="text-2xl font-mono font-medium text-gray-900">${Number(equity.balance).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Equity</p>
                            <p className="text-2xl font-mono font-medium text-gray-900">${Number(equity.equity).toFixed(2)}</p>
                        </div>
                    </div>
                ) : <p className="text-gray-400 italic">Waiting for data...</p>}
            </div>

            {/* Open Positions Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Open Positions</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Side</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Open Price</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {positions.map(pos => (
                                <tr key={pos.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pos.ticker}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pos.side === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {pos.side.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{pos.volume}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{Number(pos.open_price).toFixed(5)}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${pos.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {pos.profit >= 0 ? '+' : ''}{Number(pos.profit).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            {positions.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">
                                        No open positions
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Trade History Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Trade History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Side</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Closed</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tradeHistory && tradeHistory.map(trade => (
                                <tr key={trade.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trade.ticker}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${trade.side === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {trade.side.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{trade.volume}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                        <div className="text-xs text-gray-400">Open: {Number(trade.open_price).toFixed(5)}</div>
                                        <div>{Number(trade.close_price).toFixed(5)}</div>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {trade.profit >= 0 ? '+' : ''}{Number(trade.profit).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                        {new Date(Number(trade.close_time)).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {(!tradeHistory || tradeHistory.length === 0) && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500 italic">
                                        No trade history available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Live Quotes */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Live Quotes</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.values(prices).map(quote => (
                        <div key={quote.ticker} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div className="text-sm font-medium text-gray-500">{quote.ticker}</div>
                            <div className="text-xl font-bold text-gray-900 mt-1">{Number(quote.last_price).toFixed(2)}</div>
                            <div className="text-xs text-gray-400 mt-2">
                                {new Date(quote.last_price_time * 1000).toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                    {Object.keys(prices).length === 0 && <p className="text-gray-400 italic col-span-full">Waiting for quotes...</p>}
                </div>
            </div>
        </div>
    );
};