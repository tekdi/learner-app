import React, { useEffect } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import Header from '../../components/Layout/Header';
import { backAction } from '../../utils/JsHelper/Helper';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
  const navigation = useNavigation();

  useEffect(() => {
    BackHandler.addEventListener('backAction', backAction);

    return () => {
      BackHandler.removeEventListener('backAction', backAction);
    };
  }, [navigation]);

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
