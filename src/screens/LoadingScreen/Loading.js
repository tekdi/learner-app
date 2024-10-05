import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Text,
} from 'react-native';
import React from 'react';
import Logo from '../../assets/images/png/logo-with-tagline.png';
import { Spinner } from '@ui-kitten/components';

import DeviceInfo from 'react-native-device-info'; // Import DeviceInfo

//for react native config env : dev uat prod
import Config from 'react-native-config';

const Loading = (style) => {
  // Get the version and build number
  const version = DeviceInfo.getVersion(); // e.g., "1.0.1"
  const buildNumber = DeviceInfo.getBuildNumber(); // e.g., "2"

  return (
    <SafeAreaView style={[styles.safeArea, { top: style?.style?.top || 0 }]}>
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
          <Text allowFontScaling={false} style={styles.versionText}>
            Version {version} (Build {buildNumber}){' '}
            {Config.ENV != 'PROD' ? Config.ENV : ''}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
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

export default Loading;
