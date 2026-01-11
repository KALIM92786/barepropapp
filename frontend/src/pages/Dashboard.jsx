import React from 'react';
import { useSocket } from '../context/SocketContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
    const { liveData, chartData } = useSocket();
    
    // Calculate basic metrics
    const equity = liveData.equity || 0;
    const balance = liveData.balance || 0;
    const floatingPL = equity - balance;
    const maxDrawdown = chartData.length > 0 
        ? Math.min(...chartData.map(d => d.equity)) - Math.max(...chartData.map(d => d.equity)) 
        : 0;

    const riskStatus = floatingPL < -1000 ? 'Critical' : floatingPL < -500 ? 'Warning' : 'Safe';
    const riskColor = riskStatus === 'Critical' ? 'text-red-500' : riskStatus === 'Warning' ? 'text-orange-500' : 'text-green-500';

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Account Equity</div>
                    <div className="text-3xl font-bold text-white">${equity.toFixed(2)}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Balance</div>
                    <div className="text-3xl font-bold text-white">${balance.toFixed(2)}</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Floating P/L</div>
                    <div className={`text-3xl font-bold ${floatingPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${floatingPL.toFixed(2)}
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                    <div className="text-gray-400 text-sm mb-1">Risk Status</div>
                    <div className={`text-3xl font-bold ${riskColor}`}>{riskStatus}</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 text-gray-200">Equity Curve</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="timestamp" hide />
                                <YAxis domain={['auto', 'auto']} stroke="#6b7280" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                                    itemStyle={{ color: '#10b981' }}
                                />
                                <Area type="monotone" dataKey="equity" stroke="#10b981" fillOpacity={1} fill="url(#colorEquity)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 text-gray-200">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                            <span className="text-gray-400">Open Trades</span>
                            <span className="font-bold text-white">{liveData.openOrders.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                            <span className="text-gray-400">Est. Drawdown</span>
                            <span className="font-bold text-red-400">{maxDrawdown.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;