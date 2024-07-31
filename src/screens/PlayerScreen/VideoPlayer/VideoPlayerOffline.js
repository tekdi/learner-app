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
import { videoPlayerConfig } from './data';
import { Alert } from 'react-native';
import {
  getData,
  loadFileAsBlob,
  storeData,
} from '../../../utils/Helper/JSHelper';
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import Config from 'react-native-config';

const VideoPlayerOffline = () => {
  const [loading, setLoading] = useState(true);
  // content id
  //const content_do_id = 'do_11314891914916659211286'; //mp4
  const content_do_id = 'do_1135798467931750401115'; //webm
  const content_file = `${RNFS.DocumentDirectoryPath}/${content_do_id}`;
  // console.log('rnfs DocumentDirectoryPath', RNFS.DocumentDirectoryPath);
  // console.log('rnfs ExternalDirectoryPath', RNFS.ExternalDirectoryPath);
  const [is_valid_file, set_is_valid_file] = useState(null);
  const [is_download, set_is_download] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading_text, set_loading_text] = useState('');
  // Determine the correct path to the index.html file based on the platform
  const htmlFilePath = Platform.select({
    ios: './assets/assets/libs/sunbird-video-player/index.html',
    android: 'file:///android_asset/libs/sunbird-video-player/index.html',
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
    set_loading_text('Reading Content...');
    let contentObj = await getData(content_do_id, 'json');
    if (contentObj == null) {
      set_is_download(true);
    } else {
      let filePath = '';
      if (contentObj?.mimeType == 'video/mp4') {
        filePath = `${content_file}.mp4`;
      } else if (contentObj?.mimeType == 'video/webm') {
        filePath = `${content_file}.webm`;
      }
      if (filePath != '') {
        try {
          //get content file name
          let temp_file_url = contentObj?.artifactUrl;
          const dividedArray = temp_file_url.split(content_do_id);
          const file_name =
            dividedArray[
              dividedArray.length > 0
                ? dividedArray.length - 1
                : dividedArray.length
            ];
          filePath = `${content_file}/${content_do_id}${file_name}`;
          //console.log('filePath', filePath);
          let blobContent = await loadFileAsBlob(filePath, contentObj.mimeType);
          //console.log('blobContent', blobContent);
          if (blobContent) {
            //console.log('create blob url');
            contentObj.artifactUrl = blobContent;

            //previewUrl streamingUrl no needed for offline use
            delete contentObj.previewUrl;
            delete contentObj.streamingUrl;

            videoPlayerConfig.metadata = contentObj;
            //console.log('videoPlayerConfig set', videoPlayerConfig);
            set_is_valid_file(true);
          } else {
            set_is_valid_file(false);
          }
        } catch (e) {
          set_is_valid_file(false);
        }
      } else {
        set_is_valid_file(false);
      }
      set_is_download(false);
    }
    set_loading_text('');
    setLoading(false);
  };

  const [temp] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const downloadContent = async () => {
    //content read
    setLoading(true);
    set_loading_text('Reading Content...');
    //get data online
    let content_response = await readContent(content_do_id);
    if (content_response == null) {
      Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      set_is_valid_file(false);
    } else {
      let contentObj = content_response?.result?.content;
      let filePath = '';
      if (contentObj?.mimeType == 'video/mp4') {
        filePath = `${content_file}.mp4`;
      } else if (contentObj?.mimeType == 'video/webm') {
        filePath = `${content_file}.webm`;
      }
      if (filePath != '') {
        //download file and store object in local
        //download file
        // URL of the file to download
        //const fileUrl = contentObj?.artifactUrl;
        const fileUrl = contentObj?.downloadUrl;
        filePath = `${content_file}.zip`;
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
                set_loading_text('Unzip content ecar file...');
                // Define the paths
                const sourcePath = filePath;
                const targetPath = content_file;
                try {
                  // Ensure the target directory exists
                  await RNFS.mkdir(targetPath);
                  // Unzip the file
                  const path = await unzip(sourcePath, targetPath);
                  console.log(`Unzipped to ${path}`);
                  //store content obj
                  //console.log(contentObj);
                  await storeData(content_do_id, contentObj, 'json');
                } catch (error) {
                  console.error(`Error extracting zip file: ${error}`);
                }
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
      } else {
        Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
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
        ) : loading_text != '' ? (
          <Text>{loading_text}</Text>
        ) : (
          <></>
        )}
      </View>
    );
  }

  //call content url
  let injectedJS = `
    (function() {
      window.setData('${JSON.stringify(videoPlayerConfig)}',);
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
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          allowingReadAccessToURL={true}
          mixedContentMode={'always'}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={false}
          injectedJavaScript={injectedJS}
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

export default VideoPlayerOffline;
