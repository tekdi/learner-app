import React, { createContext, useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [retryFunction, setRetryFunction] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        setShowPopup(true);
      } else {
        setRetryFunction(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkNetworkAndRetry = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        setIsConnected(true);
        setShowPopup(false); // Close the pop-up if the connection is restored
        if (retryFunction) {
          retryFunction(); // Retry the function if it exists
        }
      } else {
        setIsConnected(false);
        setShowPopup(true); // Keep the pop-up open if there's still no connection
      }
    });
  };

  const handleTryAgain = () => {
    if (retryFunction) {
      retryFunction();
    } else {
      checkNetworkAndRetry(); // Check network status if no retryFunction is available
    }
  };

  console.log({ isConnected, retryFunction });

  return (
    <NetworkContext.Provider
      value={{ isConnected, setShowPopup, setRetryFunction }}
    >
      <Modal
        transparent={true}
        visible={showPopup}
        animationType="slide"
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>No Internet Connection</Text>
            <Text style={styles.message}>
              Please check your connection and try again.
            </Text>
            <Button title="Try Again" onPress={handleTryAgain} />
          </View>
        </View>
      </Modal>
      {children}
    </NetworkContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
});
