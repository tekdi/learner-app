import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Button,
  ActivityIndicator,
} from 'react-native';
import { PermissionsAndroid } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';
import { readContent } from '../../../utils/API/ApiCalls';
import { pdfPlayerConfig } from './data';
import { Alert } from 'react-native';
import { getData, storeData } from '../../../utils/Helper/JSHelper';
import RNFS from 'react-native-fs';
import Config from 'react-native-config';

const PACKAGE_NAME = Config.PACKAGE_NAME;

const PdfPlayerOffline = () => {
  const [loading, setLoading] = useState(true);
  // content id
  const content_do_id = 'do_1135906533266391041531';
  const content_file_name = `${content_do_id}.pdf`;
  const content_file_path = `${RNFS.DocumentDirectoryPath}/${content_file_name}`;
  // console.log('rnfs DocumentDirectoryPath', RNFS.DocumentDirectoryPath);
  // console.log('rnfs ExternalDirectoryPath', RNFS.ExternalDirectoryPath);
  const [is_valid_pdf, set_is_valid_pdf] = useState(null);
  const [is_download, set_is_download] = useState(null);
  const [progress, setProgress] = useState(0);
  // Determine the correct path to the index.html file based on the platform
  const htmlFilePath = Platform.select({
    ios: './assets/assets/libs/sunbird-pdf-player/index.html',
    android: 'file:///android_asset/libs/sunbird-pdf-player/index.html',
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
    let contentObj = await getData(content_do_id, 'json');
    if (contentObj == null) {
      set_is_download(true);
    } else {
      if (contentObj?.mimeType == 'application/pdf') {
        //replace offline file path
        // Usage example
        const filePath = content_file_path; // Replace with your file path
        let blobContent = await loadFileAsBlob(filePath);
        //console.log('blobContent', blobContent);
        if (blobContent) {
          console.log('create blob url');
          contentObj.artifactUrl = blobContent;

          //previewUrl streamingUrl no needed for offline use
          delete contentObj.previewUrl;
          delete contentObj.streamingUrl;

          pdfPlayerConfig.metadata = contentObj;
          //pdfPlayerConfig.pdfBase64 = blobContent;
          console.log('pdfPlayerConfig set', pdfPlayerConfig);
          set_is_valid_pdf(true);
        } else {
          set_is_valid_pdf(false);
        }
      } else {
        set_is_valid_pdf(false);
      }
      set_is_download(false);
    }
    setLoading(false);
  };

  const [temp] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const downloadContent = async () => {
    //content read
    setLoading(true);
    //get data online
    let content_response = await readContent(content_do_id);
    if (content_response == null) {
      Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      set_is_valid_pdf(false);
    } else {
      let contentObj = content_response?.result?.content;
      if (contentObj?.mimeType == 'application/pdf') {
        //download file and store object in local
        //download file
        // URL of the file to download
        const fileUrl = contentObj?.streamingUrl;
        //console.log('fileUrl', fileUrl);
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to storage to download files.',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //console.log('permission got');
            try {
              const download = RNFS.downloadFile({
                fromUrl: fileUrl,
                toFile: content_file_path,
                begin: (res) => {
                  console.log('Download started');
                },
                progress: (res) => {
                  const progressPercent =
                    (res.bytesWritten / res.contentLength) * 100;
                  setProgress(progressPercent);
                },
              });
              const result = await download.promise;
              if (result.statusCode === 200) {
                console.log('File downloaded successfully:', content_file_path);
                setProgress(0);
                //store content obj
                //console.log(contentObj);
                await storeData(content_do_id, contentObj, 'json');
              } else {
                Alert.alert(
                  'Error Internal',
                  `Failed to download file: ${JSON.stringify(result)}`,
                  [{ text: 'OK' }]
                );
                console.log('Failed to download file:', result.statusCode);
              }
            } catch (error) {
              Alert.alert(
                'Error Catch',
                `Failed to download file: ${JSON.stringify(error)}`,
                [{ text: 'OK' }]
              );
              console.error('Error downloading file:', error);
            }
          } else {
            Alert.alert('Error', `Permission Denied`, [{ text: 'OK' }]);
            console.log('please grant permission');
          }
        } catch (err) {
          Alert.alert(
            'Error Catch',
            `Failed to download file: ${JSON.stringify(err)}`,
            [{ text: 'OK' }]
          );
          console.log('display error', err);
        }
      }
    }
    //content read
    setLoading(false);
    await fetchData();
  };

  const loadFileAsBlob = async (filePath) => {
    try {
      console.log('in loadFileAsBlob');
      // Read the file content
      const pdfBase64 = await RNFS.readFile(filePath, 'base64');
      const fileContent = `data:application/pdf;base64,${pdfBase64}`;
      //console.log('fileContent', fileContent);

      // Create a Blob from the base64 encoded string
      //const blob = new Blob([fileContent], { type: 'application/pdf' }); // Adjust 'application/pdf' to match your file type

      //console.log('blob', blob);

      return fileContent;
    } catch (error) {
      console.error('Error loading file as Blob:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.middle_screen}>
        <ActivityIndicator size="large" color="#0000ff" />
        {progress > 0 && progress < 100 ? (
          <Text>{`Downloading: ${progress.toFixed(2)}%`}</Text>
        ) : (
          <></>
        )}
      </View>
    );
  }

  //call content url
  let injectedJS = `
    (function() {
      window.setData('${JSON.stringify(pdfPlayerConfig)}',);
    })();
  `;

  return (
    <View style={styles.container}>
      {is_valid_pdf == false ? (
        <View style={styles.middle_screen}>
          <Text>Invalid PDF File</Text>
        </View>
      ) : is_download == true ? (
        <View style={styles.middle_screen}>
          <Button title="Download Content" onPress={() => downloadContent()} />
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

export default PdfPlayerOffline;
