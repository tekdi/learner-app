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
import { epubPlayerConfig } from './data';
import { Alert } from 'react-native';

const EpubPlayer = () => {
  const [loading, setLoading] = useState(true);
  // content id
  const content_do_id = 'do_11361876156592128011436'; //epub
  const [is_valid_file, set_is_valid_file] = useState(null);
  // Determine the correct path to the index.html file based on the platform
  const htmlFilePath = Platform.select({
    ios: './assets/assets/libs/sunbird-epub-player/index.html',
    android: 'file:///android_asset/libs/sunbird-epub-player/index.html',
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
    if (content_response == null) {
      Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      set_is_valid_file(false);
    } else if (content_response?.result?.content?.mimeType == 'application/epub') {
      epubPlayerConfig.metadata = content_response.result.content;
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
      window.setData('${JSON.stringify(epubPlayerConfig)}');
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
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          startInLoadingState={true}
          allowFileAccessFromFileURLs={true}
          injectedJavaScript={injectedJS}
          //injectedJavaScript={saveJavaScript}
          //onMessage={handleMessage}
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

export default EpubPlayer;
