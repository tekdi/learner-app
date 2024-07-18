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

import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';
import { readContent } from '../../../utils/API/ApiCalls';
import { epubPlayerConfig } from './data';
import { Alert } from 'react-native';
import {
  getData,
  loadFileAsBlob,
  storeData,
} from '../../../utils/Helper/JSHelper';
import RNFS from 'react-native-fs';
import Config from 'react-native-config';

const EpubPlayerOffline = () => {
  const [loading, setLoading] = useState(true);
  // content id
  const content_do_id = 'do_11372856157927014415'; //epub
  const content_file = `${RNFS.DocumentDirectoryPath}/${content_do_id}`;
  // console.log('rnfs DocumentDirectoryPath', RNFS.DocumentDirectoryPath);
  // console.log('rnfs ExternalDirectoryPath', RNFS.ExternalDirectoryPath);
  const [is_valid_file, set_is_valid_file] = useState(null);
  const [is_download, set_is_download] = useState(null);
  const [progress, setProgress] = useState(0);
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
    let contentObj = await getData(content_do_id, 'json');
    if (contentObj == null) {
      set_is_download(true);
    } else {
      let filePath = '';
      if (contentObj?.mimeType == 'application/epub') {
        filePath = `${content_file}.epub`;
      }
      if (filePath != '') {
        let blobContent = await loadFileAsBlob(filePath, contentObj.mimeType);
        //console.log('blobContent', blobContent);
        if (blobContent) {
          //console.log('create blob url');
          contentObj.artifactUrl = blobContent;

          //previewUrl streamingUrl no needed for offline use
          delete contentObj.previewUrl;
          delete contentObj.streamingUrl;

          epubPlayerConfig.metadata = contentObj;
          //console.log('epubPlayerConfig set', epubPlayerConfig);
          set_is_valid_file(true);
        } else {
          set_is_valid_file(false);
        }
      } else {
        set_is_valid_file(false);
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
      set_is_valid_file(false);
    } else {
      let contentObj = content_response?.result?.content;
      let filePath = '';
      if (contentObj?.mimeType == 'application/epub') {
        filePath = `${content_file}.epub`;
      }
      if (filePath != '') {
        //download file and store object in local
        //download file
        // URL of the file to download
        const fileUrl = contentObj?.artifactUrl;
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
                toFile: filePath,
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
                console.log('File downloaded successfully:', filePath);
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
      window.setData('${JSON.stringify(epubPlayerConfig)}',);
    })();
  `;

  return (
    <View style={styles.container}>
      {is_valid_file == false ? (
        <View style={styles.middle_screen}>
          <Text>Invalid Player File</Text>
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

export default EpubPlayerOffline;
