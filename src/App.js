import React, { useEffect, Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ApplicationProvider } from '@ui-kitten/components';
//importing all designs from eva as eva
import * as eva from '@eva-design/eva';
//importing custom theme for UI Kitten
import theme from './assets/themes/theme.json';
//multiple language
import { LanguageProvider } from './context/LanguageContext'; // Adjust path as needed
import { NetworkProvider } from './context/NetworkContext'; // Adjust path as needed
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import StackScreen from './Routes/StackScreen';
import { BackHandler, Text, View } from 'react-native';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { logEventFunction } from './utils/JsHelper/Helper';

async function checkAndRequestStoragePermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
    ];
    const granted = await PermissionsAndroid.requestMultiple(permissions);

    const allGranted = permissions.every(
      (permission) => granted[permission] === PermissionsAndroid.RESULTS.GRANTED
    );

    if (!allGranted) {
      Alert.alert(
        'Permission Denied',
        'Storage permission is required to download files. The app will now exit.',
        [{ text: 'OK', onPress: () => BackHandler.exitApp() }]
      );
      return false;
    }
  } else {
    const hasWritePermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    const hasReadPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );

    if (!hasWritePermission || !hasReadPermission) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);

      if (
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] !==
          PermissionsAndroid.RESULTS.GRANTED ||
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] !==
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        Alert.alert(
          'Permission Denied',
          'Storage permission is required to download files. The app will now exit.',
          [{ text: 'OK', onPress: () => BackHandler.exitApp() }]
        );
        return false;
      }
    }
  }
  return true;
}
const App = () => {
  console.log('started app');
  useEffect(() => {
    // const initializeApp = async () => {
    //   const hasPermission = await checkAndRequestStoragePermission();
    //   if (!hasPermission) {
    //     // Exit the app if permissions are denied
    //     BackHandler.exitApp();
    //     return;
    //   }
    // };
    // initializeApp();
  }, []);

  useEffect(() => {
    changeNavigationBarColor('white', { barStyle: 'light-content' });
    // hideNavigationBar();
  }, []);

  useEffect(() => {
    // Optional: You can log Firebase Analytics events here
    const logAppOpenEvent = async () => {
      const timestamp = new Date().toISOString(); // Get the current timestamp

      // Log the event with the timestamp
      await analytics().logEvent('LearnerApp_opened', {
        timestamp: timestamp, // Adding the timestamp as a parameter
      });
    };

    logAppOpenEvent();
  }, []);

  return (
    <NetworkProvider>
      <LanguageProvider>
        {/* // App.js file has to be wrapped with ApplicationProvider for UI Kitten to
      work */}
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
          <NavigationContainer>
            <Suspense
              fallback={<Text allowFontScaling={false}>Loading Screen...</Text>}
            >
              <StackScreen />
            </Suspense>
          </NavigationContainer>
        </ApplicationProvider>
      </LanguageProvider>
    </NetworkProvider>
  );
};

export default App;
