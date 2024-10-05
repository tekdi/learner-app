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
import { contentPlayerConfig } from './data';
import { Alert } from 'react-native';
import {
  getData,
  loadFileAsBlob,
  storeData,
} from '../../../utils/Helper/JSHelper';
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import Config from 'react-native-config';

import Orientation from 'react-native-orientation-locker';

// User-Agent string for a desktop browser (e.g., Chrome on Windows)
const desktopUserAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

const H5PPlayer = () => {
  useEffect(() => {
    // Lock the screen to landscape mode
    //Orientation.lockToLandscape();

    // Unlock orientation when component is unmounted
    return () => {
      //Orientation.unlockAllOrientations();
    };
  }, []);

  const [loading, setLoading] = useState(true);
  // content id
  const content_do_id = 'do_1135798461403217921114'; //h5p
  //const content_do_id = 'do_11407096734258790412082'; //h5p
  const content_file = `${RNFS.DocumentDirectoryPath}/${content_do_id}`;
  const streamingPath = `${content_file}/assets/public/content/h5p/${content_do_id}-latest`;
  // console.log('rnfs DocumentDirectoryPath', RNFS.DocumentDirectoryPath);
  // console.log('rnfs ExternalDirectoryPath', RNFS.ExternalDirectoryPath);
  const [is_valid_file, set_is_valid_file] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading_text, set_loading_text] = useState('');
  // Determine the correct path to the index.html file based on the platform
  const htmlFilePath = Platform.select({
    ios: './assets/assets/libs/sunbird-content-player/index.html',
    android: 'file:///android_asset/libs/sunbird-content-player/index.html',
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

  const fetchData = async (contentObj) => {
    //content read
    setLoading(true);
    set_loading_text('Reading Content...');
    //let contentObj = await getData(content_do_id, 'json');
    if (contentObj == null) {
      //download failed
      Alert.alert('Error', 'Server Not Available', [{ text: 'OK' }]);
    } else {
      let filePath = '';
      if (contentObj?.mimeType == 'application/vnd.ekstep.h5p-archive') {
        filePath = `${content_file}.zip`;
      }
      if (filePath != '') {
        try {
          contentPlayerConfig.metadata = contentObj;
          contentPlayerConfig.data = '';
          contentPlayerConfig.context = { host: `file://${content_file}` };
          //console.log('contentPlayerConfig set', contentPlayerConfig);
          set_is_valid_file(true);
        } catch (e) {
          set_is_valid_file(false);
        }
      } else {
        set_is_valid_file(false);
      }
    }
    set_loading_text('');
    setLoading(false);
  };

  const [temp] = useState([]);
  useEffect(() => {
    downloadContent();
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
      if (contentObj?.mimeType == 'application/vnd.ekstep.h5p-archive') {
        filePath = `${content_file}.zip`;
      }
      if (filePath != '') {
        //download file and store object in local
        //download file
        // URL of the file to download
        //const fileUrl = contentObj?.artifactUrl;
        const fileUrl = contentObj?.downloadUrl;
        //console.log('fileUrl', fileUrl);
        try {
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
                //content unzip in content folder
                //get content file name
                let temp_file_url = contentObj?.artifactUrl;
                const dividedArray = temp_file_url.split('artifact');
                const file_name =
                  dividedArray[
                    dividedArray.length > 0
                      ? dividedArray.length - 1
                      : dividedArray.length
                  ];
                // Define the paths
                const sourcePath_internal = `${content_file}/${content_do_id}${file_name}`;
                const targetPath_internal = streamingPath;

                sourcePath_internal.replace('.zip', '');
                try {
                  // Ensure the target directory exists
                  await RNFS.mkdir(targetPath_internal);
                  // Unzip the file
                  const path = await unzip(
                    sourcePath_internal,
                    targetPath_internal
                  );
                  console.log(`Unzipped to ${path}`);
                  //store content obj
                  //console.log(contentObj);
                  //await storeData(content_do_id, contentObj, 'json');
                  await fetchData(contentObj);
                } catch (error) {
                  console.error(`Error extracting zip file: ${error}`);
                }
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
            Alert.alert('Error Catch', `Failed to download file: ${error}`, [
              { text: 'OK' },
            ]);
            console.error('Error downloading file:', error);
          }
        } catch (err) {
          Alert.alert('Error Catch', `Failed to download file: ${err}`, [
            { text: 'OK' },
          ]);
          console.log('display error', err);
        }
      } else {
        set_is_valid_file(false);
      }
    }
    //content read
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.middle_screen}>
        <ActivityIndicator size="large" color="#0000ff" />
        {progress > 0 && progress < 100 ? (
          <Text allowFontScaling={false}>{`Loading: ${progress.toFixed(
            2
          )}%`}</Text>
        ) : loading_text != '' ? (
          <Text allowFontScaling={false}>{loading_text}</Text>
        ) : (
          <></>
        )}
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
          <Text allowFontScaling={false}>Invalid Player File</Text>
        </View>
      ) : (
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={Platform.OS === 'ios' ? htmlFilePath : { uri: htmlFilePath }}
          style={styles.webview}
          userAgent={desktopUserAgent}
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
      {retrievedData && <Text allowFontScaling={false}>{retrievedData}</Text>} */}
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
