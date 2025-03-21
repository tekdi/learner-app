import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import SecondaryHeader from '@components/Layout/SecondaryHeader';
import WebView from 'react-native-webview';
import { getDataFromStorage } from '@src/utils/JsHelper/Helper';
import Config from 'react-native-config';

const SurveyForm = (props) => {
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [injectedJS, setinjectedJs] = useState();
  const formUrl = Config.SURVEY_FORM_URL;

  // const formUrl = `http://172.132.44.202:3001/youthnet/mfe_observations`;
  const webViewRef = useRef(null);
  const fetchData = async () => {
    //   const formUrl = `https://www.google.com/`;
    const userId = await getDataFromStorage('userId');
    const profileDetails = JSON.parse(await getDataFromStorage('profileData'))
      ?.getUserDetails?.[0];

    const customFields = profileDetails?.customFields.reduce(
      (acc, { label, selectedValues }) => {
        acc[label] = Array.isArray(selectedValues)
          ? selectedValues.map((item) => item?.id).join(', ')
          : selectedValues; // If not an array, assign directly

        return acc;
      },
      {}
    );
    // console.log('customFields', customFields);
    // console.log('userId', userId);
    // console.log('role', JSON.stringify(profileDetails));
    // console.log('state', customFields?.STATE);
    // console.log('DISTRICT', customFields?.DISTRICT);
    // console.log('BLOCK', customFields?.BLOCK);
    const token = await getDataFromStorage('Accesstoken');

    let injectJS = `
    (function() {
      localStorage.setItem('userId', "${userId}");
      localStorage.setItem('mfe_role',"${profileDetails?.role}");
      localStorage.setItem('mfe_state', "${customFields?.STATE}");
      localStorage.setItem('mfe_district', "${customFields?.DISTRICT}");
      localStorage.setItem('mfe_block', "${customFields?.BLOCK}");
      localStorage.setItem('token', "${token}");
    })(); true;`;

    setinjectedJs(injectJS);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh the component.
  const handleRefresh = async () => {
    setLoading(true); // Start Refresh Indicator

    try {
      setRefreshKey((prevKey) => prevKey + 1);
      fetchData(); // Reset course data
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop Refresh Indicator
    }
  };

  console.log('injectedJS', injectedJS);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <SecondaryHeader logo />

      <View style={{ flex: 1 }}>
        <ScrollView
          key={refreshKey}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.webViewContainer}>
            <WebView
              originWhitelist={['*']}
              source={{ uri: formUrl }}
              ref={webViewRef}
              style={styles.webview}
              injectedJavaScript={injectedJS}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              scalesPageToFit={true}
              startInLoadingState={true}
              allowFileAccess={true}
              allowUniversalAccessFromFileURLs={true}
              allowingReadAccessToURL={true}
              mixedContentMode={'always'}
              allowsFullscreenVideo={true}
              mediaPlaybackRequiresUserAction={false}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  webViewContainer: {
    flex: 1,
    height: '100%',
  },
  webview: {
    flex: 1,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

SurveyForm.propTypes = {};

export default SurveyForm;
