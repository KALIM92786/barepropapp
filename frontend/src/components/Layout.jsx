import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

const Layout = ({ children, userRole }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isConnected, liveData } = useSocket();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        { path: '/', label: 'Dashboard', roles: ['admin', 'trader', 'investor', 'signal_user'] },
        { path: '/positions', label: 'Live Positions', roles: ['admin', 'trader'] },
        { path: '/history', label: 'Trade History', roles: ['admin', 'trader', 'investor'] },
        { path: '/analytics', label: 'Analytics', roles: ['admin', 'trader', 'investor'] },
        { path: '/risk', label: 'Risk & Exposure', roles: ['admin', 'trader'] },
        { path: '/signals', label: 'Signal Feed', roles: ['admin', 'signal_user', 'trader'] },
        { path: '/account', label: 'Account Info', roles: ['admin', 'trader', 'investor'] },
    ];

    return (
        <div className="flex min-h-screen bg-gray-900 text-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-green-500 tracking-wider">BAREPROP</h1>
                    <div className="text-xs text-gray-400 mt-1">Real-time Mirroring</div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        item.roles.includes(userRole) && (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`block px-4 py-3 rounded-lg transition-colors ${
                                    location.pathname === item.path
                                        ? 'bg-green-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                {item.label}
                            </Link>
                        )
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-gray-500">Connection</span>
                        <span className={`text-xs font-bold ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                            {isConnected ? '● ONLINE' : '○ OFFLINE'}
                        </span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full py-2 px-4 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded transition-colors text-sm"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-8 shadow-sm">
                    <h2 className="text-lg font-semibold text-white">
                        {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-xs text-gray-400">Equity</div>
                            <div className="text-xl font-mono font-bold text-green-400">${liveData.equity?.toFixed(2)}</div>
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;