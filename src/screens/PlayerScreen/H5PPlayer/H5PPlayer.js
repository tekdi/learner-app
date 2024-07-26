import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Button,
  ActivityIndicator,
} from 'react-native';
import React, { useRef, useEffect, useState } from 'react';

import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';
import { readContent } from '../../../utils/API/ApiCalls';
import { contentPlayerConfig } from './data';
import { Alert } from 'react-native';

import Orientation from 'react-native-orientation-locker';

// User-Agent string for a desktop browser (e.g., Chrome on Windows)
const desktopUserAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

const H5PPlayer = () => {
  useEffect(() => {
    // Lock the screen to landscape mode
    Orientation.lockToLandscape();

    // Unlock orientation when component is unmounted
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const [loading, setLoading] = useState(true);
  // content id
  const content_do_id = 'do_11390133433760972812037'; //ecml
  //const content_do_id = 'do_113629509441634304118'; //youtube
  //const content_do_id = 'do_1135798461403217921114'; //h5p
  const [is_valid_file, set_is_valid_file] = useState(null);
  // Determine the correct path to the index.html file based on the platform
  const htmlFilePath = Platform.select({
    ios: './assets/assets/libs/sunbird-content-player/index.html',
    android:
      'file:///android_asset/libs/sunbird-content-player/index_h5p.html',
  });

  //set data from react native
  const webviewRef = useRef(null);
  // const [retrievedData, setRetrievedData] = useState(null);
  // // JavaScript to retrieve localStorage data and send it back to React Native
  // const retrieveJavaScript = `
  //     (function() {
  //         const data = localStorage.getItem('telemetry');
  //         window.ReactNativeWebView.postMessage(data);
  //     })();
  // `;
  // const handleMessage = (event) => {
  //   const data = event.nativeEvent.data;
  //   setRetrievedData(data);
  // };

  const fetchData = async () => {
    //content read
    setLoading(true);
    let content_response = await readContent(content_do_id);
    //Alert.alert('Error', JSON.stingify(content_response), [{ text: 'OK' }]);
    if (content_response == null) {
      Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      set_is_valid_file(false);
    } else if (
      content_response?.result?.content?.mimeType ==
      'application/vnd.ekstep.ecml-archive'
    ) {
      contentPlayerConfig.metadata = content_response.result.content;
      set_is_valid_file(true);
    } else {
      set_is_valid_file(false);
    }
    setLoading(false);
  };

  const [temp] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.middle_screen}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  //call content url
  let injectedJS = `
    (function() {
      localStorage.setItem('contentPlayerObject', JSON.stringify(${JSON.stringify(
        {
          contentPlayerConfig: contentPlayerConfig,
        }
      )}));
    window.setData();
    })();
  `;

  return (
    <View style={styles.container}>
      {is_valid_file == false ? (
        <View style={styles.middle_screen}>
          <Text>Invalid Player File</Text>
        </View>
      ) : (
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={Platform.OS === 'ios' ? htmlFilePath : { uri: htmlFilePath }}
          style={styles.webview}
          //style={{ width: desktopWidth, height: desktopHeight }}
          userAgent={desktopUserAgent}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          startInLoadingState={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          //injectedJavaScript={injectedJS}
          //injectedJavaScript={saveJavaScript}
          //onMessage={handleMessage}
          onMessage={(event) => {
            console.log(event.nativeEvent.data);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
        />
      )}
      {/* <Button
        title="Retrieve telemetry Data"
        onPress={() => {
          if (webviewRef.current) {
            webviewRef.current.injectJavaScript(retrieveJavaScript);
          }
        }}
      />
      {retrievedData && <Text>{retrievedData}</Text>} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  middle_screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default H5PPlayer;
