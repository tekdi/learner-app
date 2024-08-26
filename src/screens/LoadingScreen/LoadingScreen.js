import { View, Image, StyleSheet, StatusBar, Text } from 'react-native';
import React, { useEffect } from 'react';
import Logo from '../../assets/images/png/logo-with-tagline.png';
import { Spinner } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {
  getDataFromStorage,
  getRefreshToken,
  getSavedToken,
  saveAccessToken,
  saveRefreshToken,
  saveToken,
} from '../../utils/JsHelper/Helper';
import { getAccessToken, refreshToken } from '../../utils/API/AuthService';

import DeviceInfo from 'react-native-device-info'; // Import DeviceInfo

//for react native config env : dev uat prod
import Config from 'react-native-config';

import uuid from 'react-native-uuid';

const LoadingScreen = ({ navigation }) => {
  const myUUID = uuid.v4();
  console.log('Generated UUID:', myUUID);
  useEffect(() => {
    const fetchData = async () => {
      const token = await getDataFromStorage('Accesstoken');
      const refresh_token = await getRefreshToken();
      const data = await refreshToken({
        refresh_token: refresh_token,
      });
      // console.log({ token, refresh_token });
      if (token && data?.access_token) {
        const current_token = await getAccessToken();
        if (current_token !== 'successful') {
          await saveAccessToken(data?.access_token);
          await saveRefreshToken(data?.refresh_token);
        }
      }
      navigation.replace('Dashboard');
    };
    fetchData();
  }, [navigation]);

  // Get the version and build number
  const version = DeviceInfo.getVersion(); // e.g., "1.0.1"
  const buildNumber = DeviceInfo.getBuildNumber(); // e.g., "2"

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <View style={styles.content}>
        <Image style={styles.image} source={Logo} resizeMode="contain" />
        <Spinner size="large" style={styles.spinner} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.versionText}>
          Version {version} (Build {buildNumber}){' '}
          {Config.ENV != 'PROD' ? Config.ENV : ''}
        </Text>
      </View>
    </View>
  );
};

LoadingScreen.propTypes = {
  navigation: PropTypes.any,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    padding: 10,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  image: {
    marginBottom: 20,
    height: 100,
    width: '100%',
  },
  spinner: {
    borderColor: '#635E57',
  },
  footer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20, // Adjust this to increase/decrease the space from the bottom edge
  },
  versionText: {
    textAlign: 'center',
    color: '#888', // Adjust text color as needed
  },
});

export default LoadingScreen;
