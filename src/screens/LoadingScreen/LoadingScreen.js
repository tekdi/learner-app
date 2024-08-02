import { View, Image, StyleSheet, StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import Logo from '../../assets/images/png/logo-with-tagline.png';
import { Spinner } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {
  getRefreshToken,
  getSavedToken,
  saveRefreshToken,
  saveToken,
} from '../../utils/JsHelper/Helper';
import { getAccessToken, refreshToken } from '../../utils/API/AuthService';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    changeNavigationBarColor('#000000', true); // Ensure the notch is hidden during loading

    const fetchData = async () => {
      const token = await getSavedToken();
      const refresh_token = await getRefreshToken();
      if (token?.token) {
        const current_token = await getAccessToken();
        console.log({ current_token });
        if (current_token === 'successful') {
          navigation.replace('Dashboard');
        } else {
          const data = await refreshToken({
            refresh_token: refresh_token?.token,
          });
          console.log('data', data);
          console.log('refreshToken', data?.refresh_token);
          console.log('access_token', data?.access_token);
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
