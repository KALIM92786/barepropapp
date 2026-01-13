import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import AuthContext from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccountId, setCurrentAccountId] = useState(null);
  
  // Store the latest data received from the backend
  const [accountState, setAccountState] = useState({
    balance: 0,
    equity: 0,
    margin: 0,
    freeMargin: 0,
    positions: []
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!token) return;

    // Initialize Socket connection
    const newSocket = io(API_URL, {
      auth: { token },
      transports: ['websocket'], // Force websocket to avoid polling issues
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('error', (err) => {
      console.error('Socket error:', err);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [token, API_URL]);

  // Handle Account Subscription
  useEffect(() => {
    if (!socket || !currentAccountId) return;

    // Subscribe to specific account updates
    // Note: Backend logic should handle joining the room based on this emit or auth
    socket.emit('subscribe', { accountId: currentAccountId });

    const handleMarketUpdate = (data) => {
      console.log('Market Update:', data);
      setAccountState(data);
    };

    // Listen for dynamic event name: market_update_12345
    socket.on(`market_update_${currentAccountId}`, handleMarketUpdate);

    return () => {
      socket.off(`market_update_${currentAccountId}`, handleMarketUpdate);
    };
  }, [socket, currentAccountId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, accountState, currentAccountId, setCurrentAccountId }}>
      {children}
    </SocketContext.Provider>
  );
};