import { View, Image, StyleSheet, StatusBar, Text } from 'react-native';
import React, { useEffect } from 'react';
import Logo from '../../assets/images/png/logo-with-tagline.png';
import { Spinner } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {
  getRefreshToken,
  getSavedToken,
  saveAccessToken,
  saveRefreshToken,
  saveToken,
} from '../../utils/JsHelper/Helper';
import { getAccessToken, refreshToken } from '../../utils/API/AuthService';

import DeviceInfo from 'react-native-device-info'; // Import DeviceInfo

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const fetchData = async () => {
      const token = await getSavedToken();
      const refresh_token = await getRefreshToken();
      const data = await refreshToken({
        refresh_token: refresh_token?.token,
      });
      if (token?.token && data?.access_token) {
        const current_token = await getAccessToken();
        if (current_token === 'successful') {
          navigation.replace('Dashboard');
        } else {
          await saveAccessToken(data?.access_token);
          await saveToken(data?.access_token);
          await saveRefreshToken(data?.refresh_token);
          navigation.replace('Dashboard');
        }
      } else {
        navigation.replace('LanguageScreen');
      }
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
        <Spinner size="large" style={{ borderColor: '#635E57' }} />
        <Text style={styles.versionText}>
          Version {version} (Build {buildNumber})
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
});

export default LoadingScreen;
