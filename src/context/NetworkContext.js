import React, { createContext, useState, useContext, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

// Create a Context
const NetworkContext = createContext();

// Provider component
export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Helper function to determine connectivity
    const getConnectionStatus = (state) => {
      // In NetInfo v11+, isConnected can be null initially
      // Use isInternetReachable for actual internet connectivity
      // Fallback to isConnected if isInternetReachable is null
      if (state.isInternetReachable !== null) {
        return state.isInternetReachable;
      }
      return state.isConnected === true;
    };

    // Fetch initial network state
    const checkInitialState = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(getConnectionStatus(state));
    };

    checkInitialState();

    // Subscribe to internet connection updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(getConnectionStatus(state));
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useInternet = () => useContext(NetworkContext);
