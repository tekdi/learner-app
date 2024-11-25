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
import {
  getDataFromStorage,
  getDeviceId,
  logEventFunction,
} from './utils/JsHelper/Helper';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { notificationSubscribe } from './utils/API/AuthService';

import GlobalText from "@components/GlobalText/GlobalText";

const linking = {
  prefixes: ['pratham://'],
  config: {
    screens: {
      LoadingScreen: 'LoadingScreen',
    },
  },
};

const fetchData = async () => {
  const user_id = await getDataFromStorage('userId');
  const deviceId = await getDeviceId();
  if (user_id) {
    await notificationSubscribe({ deviceId, user_id });
  }
};

async function requestUserPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Permission granted');
      await fetchData();
    } else {
      console.log('Permission denied');
    }
  } catch (error) {
    console.error('Error requesting permission:', error);
  }
}

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
    requestUserPermission();
    // hideNavigationBar();
  }, []);

  useEffect(() => {
    const logEvent = async () => {
      const obj = {
        eventName: 'LearnerApp_opened',
        method: 'app_open',
        screenName: 'app_launch',
      };
      await logEventFunction(obj);
    };
    logEvent();
  }, []);

  // Create channel (required for Android O and above)
  PushNotification.createChannel(
    {
      channelId: 'default-channel-id', // Unique ID for your channel
      channelName: 'Default Channel', // Name displayed to the user
    },
    (created) => console.log(`Channel created: ${created}`) // Callback
  );

  // Configure notifications
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
      // Process the notification when it is received
    },
    requestPermissions: Platform.OS === 'ios',
  });

  useEffect(() => {
    const fetchData = async () => {
      PushNotification.configure({
        onNotification: function (notification) {
          console.log('Notification received:', notification);
        },
        requestPermissions: true,
      });
    };
    fetchData();
  }, []);

  // Handle foreground messages
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground message received:', remoteMessage);

      // Show notification in system tray
      PushNotification.localNotification({
        channelId: 'default-channel-id', // Ensure this matches your created channel
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
      });
    });

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  return (
    <NetworkProvider>
      <LanguageProvider>
        {/* // App.js file has to be wrapped with ApplicationProvider for UI Kitten to
      work */}
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
          <NavigationContainer linking={linking}>
            <Suspense fallback={<GlobalText>Loading Screen...</GlobalText>}>
              <StackScreen />
            </Suspense>
          </NavigationContainer>
        </ApplicationProvider>
      </LanguageProvider>
    </NetworkProvider>
  );
};

export default App;
