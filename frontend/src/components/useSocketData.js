import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:5000';

export const useSocketData = () => {
    const [equity, setEquity] = useState(null);
    const [equityHistory, setEquityHistory] = useState([]);
    const [tradeHistory, setTradeHistory] = useState([]);
    const [positions, setPositions] = useState([]);
    const [orders, setOrders] = useState([]);
    const [prices, setPrices] = useState({});
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // 1. Fetch initial history for the chart
        fetch(`${BACKEND_URL}/api/equity`)
            .then(res => res.json())
            .then(data => {
                // API returns DESC (newest first), we want ASC for chart
                if (Array.isArray(data)) {
                    setEquityHistory(data.reverse());
                }
            })
            .catch(err => console.error("Failed to fetch equity history:", err));

        // 2. Fetch trade history
        fetch(`${BACKEND_URL}/api/history`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTradeHistory(data);
            })
            .catch(err => console.error("Failed to fetch trade history:", err));

        // 2. Connect WebSocket
        const socket = io(BACKEND_URL);

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket');
            setIsConnected(false);
        });

        socket.on('equity_update', (data) => {
            setEquity(data);
            // Append new data point to history for real-time chart update
            setEquityHistory(prev => [...prev, { ...data, timestamp: new Date().toISOString() }]);
        });

        socket.on('positions_update', (data) => {
            setPositions(data);
        });

        socket.on('orders_update', (data) => {
            setOrders(data);
        });

        socket.on('price_update', (data) => {
            setPrices(prev => ({ ...prev, [data.ticker]: data }));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return { isConnected, equity, equityHistory, tradeHistory, positions, orders, prices };
};