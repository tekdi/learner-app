import React, { useState, useRef, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, BackHandler } from 'react-native';
import WebView from 'react-native-webview';
import SafeAreaWrapper from '../../components/SafeAreaWrapper/SafeAreaWrapper';
import BackHeader from '../../components/Layout/BackHeader';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import {
  getCohort,
  getProfileDetails,
  getProgramDetails,
  setAcademicYear,
  notificationSubscribe,
  telemetryTrackingData,
} from '../../utils/API/AuthService';
import {
  getActiveCohortData,
  getActiveCohortIds,
  getDataFromStorage,
  getDeviceId,
  getuserDetails,
  saveAccessToken,
  saveRefreshToken,
  setDataInStorage,
  storeUsername,
} from '../../utils/JsHelper/Helper';
import moment from 'moment';
import { TENANT_DATA } from '../../utils/Constants/app-constants';
import Config from 'react-native-config';

const PlpWebViewScreen = () => {
  const [loading, setLoading] = useState(true);
  const [errmsg, setErrmsg] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const webViewRef = useRef(null);
  const url =  `${Config.LEARNER_PLP_LINK}/programs`

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        // Navigate back in WebView
        webViewRef.current.goBack();
        return true; // Prevent default behavior (exit app)
      }
      // Let default behavior happen (go back in navigation)
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  // Injected JavaScript to set isAndroidApp in localStorage
  // This runs before page content loads
  const injectedJavaScriptBeforeContentLoaded = `
    (function() {
      try {
        window.localStorage.setItem('isAndroidApp', 'yes');
        console.log('[BeforeLoad] isAndroidApp set to yes in localStorage');
      } catch (error) {
        console.error('[BeforeLoad] Error setting isAndroidApp:', error);
      }
    })();
    true;
  `;

  // This runs after page content loads
  const injectedJavaScript = `
    (function() {
      try {
        window.localStorage.setItem('isAndroidApp', 'yes');
        console.log('[AfterLoad] isAndroidApp set to yes in localStorage');
        
        // Send confirmation back to React Native
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'ANDROID_APP_FLAG_SET',
            value: window.localStorage.getItem('isAndroidApp')
          }));
        }
      } catch (error) {
        console.error('[AfterLoad] Error setting isAndroidApp:', error);
      }
    })();
    true;
  `;
  
  
  const handleProgramLogin = async(tenantId, userId, token, refreshToken) => {
    await saveAccessToken(token || '');
    await saveRefreshToken(refreshToken || '')
    const userDetails = await getuserDetails();
    const roleName = "Learner";

    const user_id = userId;
  const tenantData = [
    userDetails?.tenantData?.find((tenant) => tenant.tenantId === tenantId),
  ];
  const uiConfig = tenantData[0]?.params?.uiConfig;
  await setDataInStorage('uiConfig', JSON.stringify(uiConfig));
  console.log('#### loginmultirole uiConfig', JSON.stringify(uiConfig));
  console.log('#### loginmultirole tenantData', tenantData);

  const enrollmentId = userDetails?.enrollmentId;
  await setDataInStorage('tenantData', JSON.stringify(tenantData || {}));
  await setDataInStorage('userId', user_id || '');
  await setDataInStorage('enrollmentId', enrollmentId || '');

  //store dynamic templateId
  const templateId = tenantData?.[0]?.templateId;
  await setDataInStorage('templateId', templateId || '');

    const academicyear = await setAcademicYear({ tenantid: tenantId });
    const academicYearId = academicyear?.[0]?.id;
    await setDataInStorage('academicYearId', academicYearId || '');
    await setDataInStorage('userTenantid', tenantId || '');
    const cohort = await getCohort({
      user_id,
      tenantid: tenantId,
      academicYearId,
    });
  console.log('#### loginmultirole cohort', cohort);
  let cohort_id;
  if (cohort.params?.status !== 'failed') {
    const getActiveCohort = await getActiveCohortData(cohort);
    const getActiveCohortId = await getActiveCohortIds(cohort);
    await setDataInStorage(
      'cohortData',
      JSON.stringify(getActiveCohort?.[0]) || ''
    );
    cohort_id = getActiveCohortId?.[0];
  }

  const profileData = await getProfileDetails({
    userId: user_id,
  });
  console.log('#### loginmultirole profileData', profileData);

  await setDataInStorage('profileData', JSON.stringify(profileData));
  await setDataInStorage(
    'Username',
    profileData?.getUserDetails?.[0]?.username || ''
  );
  await storeUsername(profileData?.getUserDetails?.[0]?.username);

  await setDataInStorage(
    'cohortId',
    cohort_id || '00000000-0000-0000-0000-000000000000'
  );
  const tenantDetails = (await getProgramDetails()) || [];

  const MatchedTenant = tenantDetails.filter(
    (item) => item?.tenantId === tenantId
  );

  // console.log('tenantDetails===>', JSON.stringify(tenantDetails));
  // console.log(
  //   'MatchedTenant===>',
  //   JSON.stringify(MatchedTenant?.[0]?.contentFilter)
  // );

  await setDataInStorage(
    'contentFilter',
    JSON.stringify(MatchedTenant?.[0]?.contentFilter || {})
  );

  const youthnetTenantIds = tenantDetails
    ?.filter((item) => item?.name === TENANT_DATA.YOUTHNET)
    ?.map((item) => item?.tenantId);

  const scp = tenantDetails
    ?.filter((item) => item.name === 'Second Chance Program')
    ?.map((item) => item.tenantId);

 // const role = roleName;

  {
    // console.log('#### loginmultirole role', role);

    if (tenantId === scp?.[0]) {
      console.log('####loginintoscp', scp);
      await setDataInStorage('userType', 'scp');
      navigation.navigate('SCPUserTabScreen');

      // if (cohort_id) {
      //   navigation.navigate('SCPUserTabScreen');
      // } else {
      //   navigation.navigate('Dashboard');
      // }
    } else {
      if (tenantId === youthnetTenantIds?.[0]) {
       // console.log('#### loginintodefault tenant@@@@@@@', tenantData?.[0]?.tenantName);

        await setDataInStorage('userType', 'youthnet');
        // navigation.navigate('YouthNetTabScreen');
        navigation.navigate('Dashboard');
      } else {
       console.log('#### loginintodefault tenant??????', tenantData?.[0]?.tenantName);
        // await setDataInStorage('userType', 'pragyanpath');
        await setDataInStorage('userType', tenantData?.[0]?.tenantName);
        navigation.navigate('Dashboard');
      }
    }
    const deviceId = await getDeviceId();
    const action = 'add';

    await notificationSubscribe({ deviceId, user_id, action });
  }
  
  const now = moment();

  const telemetryPayloadData = {
    event: 'login',
    type: 'click',
    ets: now.unix(),
  };
  await telemetryTrackingData({
    telemetryPayloadData,
  });

  };

  const handleWebViewMessage = async (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      console.log('Received from web:', message);
      
      // Log when Android flag is confirmed set
      if (message.type === 'ANDROID_APP_FLAG_SET') {
        console.log('✓ isAndroidApp confirmed in localStorage:', message.value);
        return;
      }
      
      if (message.type === 'ENROLL_PROGRAM_EVENT') {
        const tenantId = message.data.tenantId;
        const userId = message.data.userId;
        const token = message.data.token;
        const refreshToken = message.data.refreshToken;
        await handleProgramLogin(tenantId, userId, token, refreshToken);

        // Handle the event
        console.log('User data:', message.data);
      }
      
      if (message.type === 'ACCESS_PROGRAM_EVENT') {
        console.log("Hellooooo")
        const tenantId = message.data.tenantId;
        const userId = message.data.userId;
        const token = message.data.token;
        const refreshToken = message.data.refreshToken;
        await handleProgramLogin(tenantId, userId, token, refreshToken);

        console.log('Access Program data:', message.data);
      }
      
      if (message.type === 'LOGIN_INTO_ONLY_ONE_PROGRAM_EVENT') {
        const tenantId = message.data.tenantId;
        const userId = message.data.userId;
        const token = message.data.token;
        const refreshToken = message.data.refreshToken;
        console.log('Login into Only One Program data:', message.data);


       
        await handleProgramLogin(tenantId, userId, token, refreshToken);
        //  const refreshToken = ""
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  return (
    <SafeAreaWrapper excludeTop={true}>
      <View style={styles.container}>
        <View style={styles.webviewContainer}>
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          <WebView
            ref={webViewRef}
            source={{ uri: url }}
            injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
            injectedJavaScript={injectedJavaScript}
            onLoad={() => {
              setLoading(false);
              // Re-inject the localStorage value after page loads
              if (webViewRef.current) {
                webViewRef.current.injectJavaScript(injectedJavaScript);
              }
            }}
            onNavigationStateChange={(navState) => {
              // Update canGoBack state
              setCanGoBack(navState.canGoBack);
              
              // Re-inject on every navigation to ensure it persists
              if (webViewRef.current) {
                webViewRef.current.injectJavaScript(injectedJavaScript);
              }
              console.log('WebView Path Changed:', navState.url);
              console.log('Can Go Back:', navState.canGoBack);
              // if (navState.url === 'https://qa-plp.prathamdigital.org/login') {
              //   // Only navigate when screen is focused to prevent redirect loop
              //   if (isFocused) {
              //     navigation.navigate('LoginScreen');
              //     // Go back in WebView history so it's not on /login when user returns
              //     if (navState.canGoBack && webViewRef.current) {
              //       webViewRef.current.goBack();
              //     }
              //   }
              // }
            }}
            onShouldStartLoadWithRequest={(request) => {
              // if (request.url === 'https://qa-plp.prathamdigital.org/login') {
              //   if (isFocused) {
              //     navigation.navigate('LoginScreen');
              //   }
              //   return false;
              // }
              return true;
            }}
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
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 40,
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

export default PlpWebViewScreen;

