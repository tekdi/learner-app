import React, { useEffect, Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ApplicationProvider } from '@ui-kitten/components';
//importing all designs from eva as eva
import * as eva from '@eva-design/eva';
//importing custom theme for UI Kitten
import theme from './assets/themes/theme.json';
//multiple language
import { LanguageProvider } from './context/LanguageContext'; // Adjust path as needed
//context
import { NetworkProvider } from './context/NetworkContext'; // Adjust path as needed
import { ConfirmationProvider } from '@context/Confirmation/ConfirmationContext';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import StackScreen from './Routes/Public/StackScreen';
import { BackHandler, Dimensions, Text, View, Linking } from 'react-native';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import {
  getDataFromStorage,
  getDeviceId,
  logEventFunction,
  setDataInStorage,
} from './utils/JsHelper/Helper';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { notificationSubscribe } from './utils/API/AuthService';
import DeviceInfo from 'react-native-device-info';

import GlobalText from '@components/GlobalText/GlobalText';
import { CopilotProvider } from 'react-native-copilot';

//fix for android version 15
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
  const action = 'add';

  if (user_id) {
    await notificationSubscribe({ deviceId, user_id, action });
  }
};

// for version upgrade API 35 app crash issue on android 9, 10, 11, 12
async function requestUserPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission granted');
        await fetchData();
      } else {
        console.log('Permission denied at start POST_NOTIFICATIONS');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  } else {
    console.log('Permission granted');
    await fetchData();
  }
}

async function checkAndRequestStoragePermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    // For Android 13+ (API 33+), Photo Picker handles permissions automatically
    // No need to request READ_MEDIA_IMAGES or READ_MEDIA_VIDEO
    return true;
  } else if (Platform.OS === 'android' && Platform.Version >= 29) {
    // Android 10-12 (API 29-32) - use traditional storage permissions
    // requestLegacyExternalStorage is set to true in AndroidManifest.xml
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
  } else if (Platform.OS === 'android' && Platform.Version >= 26) {
    // Android 8-9 (API 26-28) - use traditional storage permissions
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

// Deep link handler functions
const handleDeepLink = async (url) => {
  if (url) {
    console.log('=== DEEP LINK DETECTED ===');
    console.log('Direct deep link from website:', url);

    // Parse the deep link parameters - handle custom scheme properly
    let params = {};

    try {
      // Method 1: Try using URL constructor (might not work with custom schemes)
      const urlObj = new URL(url);
      params = {
        page: urlObj.searchParams.get('page'),
        type: urlObj.searchParams.get('type'),
        identifier: urlObj.searchParams.get('identifier'),
        program: urlObj.searchParams.get('program'),
      };

      console.log('Method 1 (URL constructor) - Deep link parameters:', params);

      // Check if we got valid parameters
      if (
        !params.page &&
        !params.type &&
        !params.identifier &&
        !params.program
      ) {
        throw new Error('No parameters found with URL constructor');
      }
    } catch (error) {
      console.log(
        'URL constructor failed, using manual parsing:',
        error.message
      );

      // Method 2: Manual parsing for custom schemes
      try {
        // Split the URL to get the query part
        const parts = url.split('?');
        console.log('URL parts:', parts);

        if (parts.length > 1) {
          const queryString = parts[1];
          console.log('Query string:', queryString);

          // Parse query parameters manually
          const urlParams = new URLSearchParams(queryString);
          params = {
            page: urlParams.get('page'),
            type: urlParams.get('type'),
            identifier: urlParams.get('identifier'),
            program: urlParams.get('program'),
          };

          console.log(
            'Method 2 (Manual parsing) - Deep link parameters:',
            params
          );
        } else {
          console.log('No query parameters found in URL');
        }
      } catch (manualError) {
        console.log('Manual parsing also failed:', manualError.message);

        // Method 3: Regex fallback
        try {
          const pageMatch = url.match(/page=([^&]*)/);
          const typeMatch = url.match(/type=([^&]*)/);
          const identifierMatch = url.match(/identifier=([^&]*)/);
          const programMatch = url.match(/program=([^&]*)/);

          params = {
            page: pageMatch ? decodeURIComponent(pageMatch[1]) : null,
            type: typeMatch ? decodeURIComponent(typeMatch[1]) : null,
            identifier: identifierMatch
              ? decodeURIComponent(identifierMatch[1])
              : null,
            program: programMatch ? decodeURIComponent(programMatch[1]) : null,
          };

          console.log(
            'Method 3 (Regex parsing) - Deep link parameters:',
            params
          );
        } catch (regexError) {
          console.log('All parsing methods failed:', regexError.message);
        }
      }
    }

    // Store the referrer data for your app logic (optional)
    await setDataInStorage('deep_link_data', JSON.stringify(params));

    console.log('Final parsed parameters:', params);
    console.log('==========================');
  }
};

const handlePlayStoreReferrer = async () => {
  try {
    // Check if we already processed referrer on first launch
    const referrerAlreadyProcessed = await getDataFromStorage(
      'referrer_processed'
    );

    if (referrerAlreadyProcessed == 'yes') {
      console.log(
        'Play Store referrer already processed on first launch - skipping'
      );
      return;
    }

    console.log(
      'First app launch - checking for Play Store install referrer...'
    );

    // Get real Play Store install referrer data using DeviceInfo
    const installReferrer = await DeviceInfo.getInstallReferrer();

    if (installReferrer && installReferrer.trim() !== '') {
      console.log('=== PLAY STORE REFERRER DETECTED (FIRST LAUNCH) ===');
      console.log('Raw install referrer from Play Store:', installReferrer);

      // Try to decode the referrer parameters if they are URL encoded
      let decodedParams = installReferrer;
      try {
        decodedParams = decodeURIComponent(installReferrer);
        console.log('Decoded referrer parameters:', decodedParams);
      } catch (decodeError) {
        console.log('Referrer data not URL encoded:', installReferrer);
        decodedParams = installReferrer;
      }

      // Try to parse as URL parameters
      try {
        const urlParams = new URLSearchParams(decodedParams);
        const params = {
          page: urlParams.get('page'),
          type: urlParams.get('type'),
          identifier: urlParams.get('identifier'),
          program: urlParams.get('program'),
        };

        // Only log parsed params if we found our expected parameters
        if (params.page || params.type || params.identifier || params.program) {
          console.log('Parsed referrer parameters:', params);
          console.log(
            'Original Play Store URL would be:',
            `https://play.google.com/store/apps/details?id=com.pratham.learning&referrer=${encodeURIComponent(
              decodedParams
            )}`
          );

          // Store the referrer data for your app logic (optional)
          await setDataInStorage('deep_link_data', JSON.stringify(params));
          console.log('Referrer data saved for app usage');
        } else {
          console.log(
            'Referrer data does not contain expected deep link parameters'
          );
          console.log('Raw referrer data:', decodedParams);
        }
      } catch (parseError) {
        console.log(
          'Could not parse referrer as URL parameters:',
          decodedParams
        );
      }

      console.log('=========================================');

      // Mark referrer as processed so we don't process it again
      await setDataInStorage('referrer_processed', 'yes');
      console.log(
        "Referrer marked as processed - won't check again on future launches"
      );
    } else {
      console.log(
        'No Play Store referrer data found - app installed directly or opened normally'
      );
      // Still mark as processed to avoid checking again
      await setDataInStorage('referrer_processed', 'yes');
    }
  } catch (error) {
    console.log('Error getting Play Store referrer:', error);

    // Mark as processed even on error to avoid repeated attempts
    await setDataInStorage('referrer_processed', 'yes');

    // Fallback: check for any stored referrer data (for testing)
    try {
      const storedReferrer = await getDataFromStorage('playstore_referrer');
      if (storedReferrer) {
        console.log('=== SIMULATED REFERRER DATA FOUND (FIRST LAUNCH) ===');
        console.log('Stored test referrer data:', storedReferrer);
        console.log('=====================================');
      }
    } catch (storageError) {
      console.log('No referrer data available');
    }
  }
};

// Test function to simulate Play Store referrer data
/*const simulatePlayStoreReferrer = async (
  contentType,
  identifier,
  programName
) => {
  const deepLinkParams = encodeURIComponent(
    `page=cmslink&type=${contentType}&identifier=${identifier}&program=${programName}`
  );

  await setDataInStorage('playstore_referrer', deepLinkParams);
  console.log('=== SIMULATED PLAY STORE REFERRER ===');
  console.log('Stored referrer data:', deepLinkParams);
  console.log(
    'Play Store URL would be:',
    `https://play.google.com/store/apps/details?id=com.pratham.learning&referrer=${deepLinkParams}`
  );
  console.log('=====================================');

  // Now check the referrer data
  await handlePlayStoreReferrer();
};

// Test function to clear Play Store referrer data
const clearPlayStoreReferrer = async () => {
  await setDataInStorage('playstore_referrer', null);
  console.log('Cleared Play Store referrer data');
};

// Test function to reset referrer processed flag (force first launch behavior)
const resetReferrerProcessedFlag = async () => {
  await setDataInStorage('referrer_processed', null);
  console.log(
    'Reset referrer processed flag - next launch will process referrer again'
  );
};*/

const App = () => {
  console.log('started app');

  // Make test functions globally available for development/testing
  /*if (__DEV__) {
    global.simulatePlayStoreReferrer = simulatePlayStoreReferrer;
    global.clearPlayStoreReferrer = clearPlayStoreReferrer;
    global.resetReferrerProcessedFlag = resetReferrerProcessedFlag;

    // Log instructions for testing
    console.log('\n=== DEEP LINK TESTING INSTRUCTIONS ===');
    console.log('1. Test Direct Deep Link:');
    console.log(
      '   Use: adb shell am start -W -a android.intent.action.VIEW -d "pratham://learnerapp?page=cmslink&type=video&identifier=123&program=TestProgram" com.pratham.learning'
    );
    console.log('\n2. Test Real Play Store Referrer:');
    console.log('   - Install app from Play Store with referrer URL:');
    console.log(
      '   - https://play.google.com/store/apps/details?id=com.pratham.learning&referrer=page%3Dcmslink%26type%3Dvideo%26identifier%3D123%26program%3DTestProgram'
    );
    console.log('   - App will automatically detect referrer on launch');
    console.log('\n3. Test Simulated Referrer (for development):');
    console.log(
      '   Use: simulatePlayStoreReferrer("video", "123", "TestProgram")'
    );
    console.log('   Clear: clearPlayStoreReferrer()');
    console.log('\n4. First Launch Testing:');
    console.log('   Reset flag: resetReferrerProcessedFlag()');
    console.log(
      '   (Referrer will only process on FIRST launch after installation)'
    );
    console.log(
      '\nNOTE: Real Play Store referrer data is now being detected using DeviceInfo.getInstallReferrer()'
    );
    console.log(
      'IMPORTANT: Referrer is processed ONLY ONCE on first app launch, then skipped'
    );
    console.log('=======================================\n');
  }*/
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

  // Deep link handling useEffect
  useEffect(() => {
    // Handle deep link when app is opened from closed state
    const getInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          handleDeepLink(initialUrl);
        } else {
          // If no deep link, check for Play Store referrer
          await handlePlayStoreReferrer();
        }
      } catch (error) {
        console.log('Error getting initial URL:', error);
        // Fallback to checking Play Store referrer
        await handlePlayStoreReferrer();
      }
    };

    getInitialURL();

    // Handle deep link when app is already running
    const linkingListener = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    // Cleanup listener
    return () => {
      if (linkingListener?.remove) {
        linkingListener.remove();
      }
    };
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
        title: remoteMessage?.notification?.title,
        message: remoteMessage?.notification?.body,
      });
    });

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  return (
    <SafeAreaProvider>
      <NetworkProvider>
        <ConfirmationProvider>
          <LanguageProvider>
            {/* // App.js file has to be wrapped with ApplicationProvider for UI Kitten to
      work */}
            <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
              <CopilotProvider
                tooltipStyle={{ backgroundColor: 'black' }}
                androidStatusBarVisible={true}
              >
                <NavigationContainer linking={linking}>
                  <Suspense
                    fallback={<GlobalText>Loading Screen...</GlobalText>}
                  >
                    <StackScreen />
                  </Suspense>
                </NavigationContainer>
              </CopilotProvider>
            </ApplicationProvider>
          </LanguageProvider>
        </ConfirmationProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
};

export default App;
