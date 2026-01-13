import React from 'react';
import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const Account = () => {
    const { isConnected } = useContext(SocketContext);
    
    return (
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Account Transparency</h2>
            <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Broker</span>
                    <span className="text-white">RoboForex R StocksTrader</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Data Source Status</span>
                    <span className={`font-bold ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>
        </div>
    );
};
export default Account;