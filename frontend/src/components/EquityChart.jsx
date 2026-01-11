import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const EquityChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="h-64 flex items-center justify-center bg-gray-50 text-gray-400">No equity data available</div>;
    }

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    };

    return (
        <div className="h-64 w-full bg-white p-4 rounded shadow border">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Equity Curve</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis 
                        dataKey="timestamp" 
                        tickFormatter={formatTime} 
                        minTickGap={30}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                        domain={['auto', 'auto']} 
                        tick={{ fontSize: 12 }}
                        width={60}
                    />
                    <Tooltip 
                        labelFormatter={formatTime}
                        formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Equity']}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="equity" 
                        stroke="#2563eb" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};