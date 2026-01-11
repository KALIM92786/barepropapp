import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, accountId }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [liveData, setLiveData] = useState({ equity: 0, balance: 0, openOrders: [] });
    const [chartData, setChartData] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const newSocket = io();
        setSocket(newSocket);

        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Initial Data Fetch
        fetch(`/api/analytics/${accountId}`, { headers })
            .then(res => res.json())
            .then(data => setChartData(data))
            .catch(err => console.error("Analytics fetch error:", err));

        fetch(`/api/trades/${accountId}`, { headers })
            .then(res => res.json())
            .then(data => setHistory(data))
            .catch(err => console.error("History fetch error:", err));

        // Socket Handlers
        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);
        
        newSocket.on('connect', onConnect);
        newSocket.on('disconnect', onDisconnect);

        newSocket.emit('subscribe', accountId);
        
        newSocket.on('market_update', (data) => {
            setLiveData({
                equity: data.equity,
                balance: data.balance,
                openOrders: data.openOrders || []
            });
            
            // Update Chart Real-time
            setChartData(prev => {
                const newData = [...prev, { 
                    timestamp: new Date().toISOString(), 
                    equity: data.equity 
                }];
                return newData.slice(-500); // Keep last 500 points
            });
        });

        return () => {
            newSocket.off('connect', onConnect);
            newSocket.off('disconnect', onDisconnect);
            newSocket.off('market_update');
            newSocket.close();
        };
    }, [accountId]);

    return (
        <SocketContext.Provider value={{ 
            socket, 
            isConnected, 
            liveData, 
            chartData, 
            history 
        }}>
            {children}
        </SocketContext.Provider>
    );
};