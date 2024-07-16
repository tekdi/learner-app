import React, { useEffect } from 'react';
import { Alert, BackHandler, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Layout/Header';

const Dashboard = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true; // Prevent default behavior (exiting the app)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // Clean up the subscription on unmount
  }, []);

  return (
    <>
      <Header />
      <View style={styles.view}>
        <Text style={styles.text}>Dashboard</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  view: {
    borderWidth: 1,
    top: 40,
    width: '100%',
    backgroundColor: 'white',
  },
  text: {
    color: 'black',
  },
});

export default Dashboard;
