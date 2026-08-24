import React, { useState, useRef, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import SafeAreaWrapper from '../../components/SafeAreaWrapper/SafeAreaWrapper';
import BackHeader from '../../components/Layout/BackHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getProfileDetails } from '../../utils/API/AuthService';
import {
  getDataFromStorage,
  saveAccessToken,
  saveRefreshToken,
  setDataInStorage,
} from '../../utils/JsHelper/Helper';
import Config from 'react-native-config';

// Web keys the profile form reads that the app must never leak a stale value into.
// The WebView shares localStorage per origin with the login and programs flows, so a
// value left behind by an earlier flow would otherwise still be present here.
// temp_program_type === 'VolunteerOnboarding' makes the web render the volunteer
// onboarding form instead of the profile form.
const KEYS_TO_CLEAR = ['temp_program_type'];

// Serialises a value into a JS string literal. JSON.stringify handles quoting and
// escaping; U+2028/U+2029 are legal in JSON but were illegal in JS string literals
// before ES2019, so they are escaped explicitly.
const jsString = (value) =>
  JSON.stringify(String(value))
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

const buildInjectedJavaScript = (entries) => {
  const statements = Object.entries(entries).map(([key, value]) =>
    value === null || value === undefined || value === ''
      ? `window.localStorage.removeItem(${jsString(key)});`
      : `window.localStorage.setItem(${jsString(key)}, ${jsString(value)});`
  );

  const clears = KEYS_TO_CLEAR.map(
    (key) => `window.localStorage.removeItem(${jsString(key)});`
  );

  return `
    (function() {
      try {
        ${clears.join('\n        ')}
        ${statements.join('\n        ')}
        console.log('[BeforeLoad] profile WebView localStorage seeded');
      } catch (error) {
        console.error('[BeforeLoad] Error seeding profile WebView:', error);
      }
    })();
    true;
  `;
};

const ProfileWebViewScreen = () => {
  const [loading, setLoading] = useState(true);
  const [injectedJavaScript, setInjectedJavaScript] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const webViewRef = useRef(null);
  // Guards against a duplicate EDIT_PROFILE_EVENT causing a second goBack().
  const handledRef = useRef(false);

  // 'edit' shows every field prefilled; 'complete' shows only missing required fields.
  const screen = route.params?.screen === 'complete' ? 'complete' : 'edit';
  // Note the route spelling — 'complition', not 'completion'.
  const url = `${Config.LEARNER_PLP_LINK}/profile-complition?screen=${screen}`;

  // The web form authenticates purely from localStorage, so every key it needs has to be
  // seeded before the page loads. Values come from AsyncStorage, hence the WebView is not
  // rendered until the injection script is built.
  useEffect(() => {
    const buildInjection = async () => {
      try {
        const tenantData = JSON.parse(
          (await getDataFromStorage('tenantData')) || 'null'
        );
        const preferredLanguage = await getDataFromStorage('preferred_language');
        const tenantId =
          tenantData?.[0]?.tenantId ||
          (await getDataFromStorage('userTenantid')) ||
          '';

        setInjectedJavaScript(
          buildInjectedJavaScript({
            isAndroidApp: 'yes',
            token: await getDataFromStorage('Accesstoken'),
            // The web app reads refreshTokenForAndroid first and writes the rotated
            // value back to it after a 401 refresh.
            refreshTokenForAndroid: await getDataFromStorage('refreshToken'),
            userId: await getDataFromStorage('userId'),
            tenantId: tenantId,
            uiConfig: await getDataFromStorage('uiConfig'),
            userProgram: tenantData?.[0]?.tenantName || '',
            academicYearId: await getDataFromStorage('academicYearId'),
            preferred_language: preferredLanguage,
            lang: preferredLanguage,
          })
        );
      } catch (error) {
        console.error('Error building profile WebView injection:', error);
      }
    };

    buildInjection();
  }, []);

  const handleProfileSaved = async (data) => {
    if (handledRef.current) {
      return;
    }
    handledRef.current = true;

    try {
      // The token may have been rotated by a 401 refresh inside the WebView.
      if (data?.token) {
        await saveAccessToken(data.token);
      }
      if (data?.refreshToken) {
        await saveRefreshToken(data.refreshToken);
      }

      const userId = data?.userId || (await getDataFromStorage('userId'));
      if (userId) {
        const profileData = await getProfileDetails({ userId });
        await setDataInStorage('profileData', JSON.stringify(profileData));
      }
    } catch (error) {
      console.error('Error persisting saved profile:', error);
    }

    // Screens that show profile data (and the complete-profile banner) re-read
    // storage on focus, so going back is enough to refresh them.
    navigation.goBack();
  };

  const handleWebViewMessage = async (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      console.log('Received from web:', message);

      if (message.type === 'EDIT_PROFILE_EVENT') {
        // message.data.screen tells us which flow finished ('edit' | 'complete').
        console.log('Profile saved from web, screen:', message.data?.screen);
        await handleProfileSaved(message.data);
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  return (
    <SafeAreaWrapper>
      {/* No title — the web page renders its own heading for both modes. */}
      <BackHeader />
      <View style={styles.container}>
        <View style={styles.webviewContainer}>
          {(loading || !injectedJavaScript) && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          {injectedJavaScript && (
            <WebView
              ref={webViewRef}
              source={{ uri: url }}
              originWhitelist={['*']}
              injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
              // Deliberately not re-injected after load or on navigation, unlike the
              // login and programs WebViews. Those only set a constant flag; this script
              // carries credentials, and re-running it would overwrite a token the web
              // app rotated during the session.
              onLoad={() => setLoading(false)}
              onMessage={handleWebViewMessage}
              style={styles.webview}
              startInLoadingState={true}
              domStorageEnabled={true}
              javaScriptEnabled={true}
              renderLoading={() => (
                <View style={styles.loader}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  webviewContainer: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default ProfileWebViewScreen;
