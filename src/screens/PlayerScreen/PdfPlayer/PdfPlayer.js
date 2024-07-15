import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Button,
} from 'react-native';
import React, { useRef, useEffect, useState } from 'react';

import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';

const PdfPlayer = () => {
  // Determine the correct path to the index.html file based on the platform
  const htmlFilePath = Platform.select({
    ios: './assets/assets/libs/sunbird-pdf-player/index.html',
    android: 'file:///android_asset/libs/sunbird-pdf-player/index.html',
    //android: 'http://192.168.31.74:3000/',
  });

  //set data from react native
  const webviewRef = useRef(null);
  // const saveJavaScript = `
  //     (function() {
  //         localStorage.setItem('jsonObject', JSON.stringify(${JSON.stringify(
  //           jsonObject
  //         )}));
  //         return true;
  //     })();
  // `;
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

  return (
    <View style={styles.container}>
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
        //injectedJavaScript={saveJavaScript}
        //onMessage={handleMessage}
      />
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
});

export default PdfPlayer;
