import React, { useEffect } from 'react';
import {
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from '../../components/Layout/Header';
import { backAction } from '../../utils/JsHelper/Helper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Dashboard = () => {
  const navigation = useNavigation();

  useEffect(() => {
    BackHandler.addEventListener('backAction', backAction);

    return () => {
      BackHandler.removeEventListener('backAction', backAction);
    };
  }, [navigation]);

  return (
    <SafeAreaView>
      <Header />
      <View style={styles.view}>
        <View>
          <Text></Text>
          <Icon name="logout" color="black" size={30} style={styles.icon} />
        </View>
      </View>
    </SafeAreaView>
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
