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
import { hierarchyContent, listQuestion } from '../../../utils/API/ApiCalls';
import { qumlPlayerConfig, questionsData } from './data';
import Config from 'react-native-config';
import { Alert } from 'react-native';
import {
  getData,
  loadFileAsBlob,
  storeData,
} from '../../../utils/Helper/JSHelper';
import RNFS from 'react-native-fs';

const QuMLPlayerOffline = () => {
  const [loading, setLoading] = useState(true);
  // content id
  //const content_do_id = 'do_1139076484395663361357'; //quml
  const content_do_id = 'do_113947242352787456122'; //quml
  const content_file = `${RNFS.DocumentDirectoryPath}/${content_do_id}`;
  const streamingPath = `${content_file}/${content_do_id}.json`;
  // console.log('rnfs DocumentDirectoryPath', RNFS.DocumentDirectoryPath);
  // console.log('rnfs ExternalDirectoryPath', RNFS.ExternalDirectoryPath);
  const [is_valid_file, set_is_valid_file] = useState(null);
  const [is_download, set_is_download] = useState(null);
  const [loading_text, set_loading_text] = useState('');
  const questionListUrl = Config.QUESTION_LIST_URL;
  // Determine the correct path to the index.html file based on the platform
  const htmlFilePath = Platform.select({
    ios: './assets/assets/libs/sunbird-quml-player/index_o.html',
    android: 'file:///android_asset/libs/sunbird-quml-player/index_o.html',
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
      if (contentObj?.mimeType == 'application/vnd.sunbird.questionset') {
        filePath = `${content_file}`;
      }
      if (filePath != '') {
        try {
          //get file content
          const content = await RNFS.readFile(streamingPath, 'utf8');
          if (content) {
            try {
              let file_content = JSON.parse(content);
              //console.log('file_content', JSON.stringify(file_content));
              //console.log('file_content', file_content);
              questionsData.questions_data = file_content;
              qumlPlayerConfig.metadata = contentObj;
              //console.log('qumlPlayerConfig set', qumlPlayerConfig);
              set_is_valid_file(true);
            } catch (e) {
              set_is_download(true);
            }
          } else {
            set_is_download(true);
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
    let content_response = await hierarchyContent(content_do_id);
    if (content_response == null) {
      Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      set_is_valid_file(false);
    } else {
      let contentObj = content_response?.result?.questionSet;
      let filePath = '';
      if (contentObj?.mimeType == 'application/vnd.sunbird.questionset') {
        filePath = `${content_file}`;
      }
      if (filePath != '') {
        //create file and store object in local
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
              //create directory
              set_loading_text('Creating Folder...');
              await RNFS.mkdir(filePath);
              console.log('folder created successfully:', filePath);
              //create directory and add json file in it
              set_loading_text('Downloading questionset...');
              //downlaod here
              let childNodes = contentObj?.childNodes;
              console.log('childNodes', childNodes);
              let removeNodes = [];
              if (contentObj?.children) {
                for (let i = 0; i < contentObj.children.length; i++) {
                  if (contentObj.children[i]?.identifier) {
                    removeNodes.push(contentObj.children[i].identifier);
                  }
                }
              }
              console.log('removeNodes', removeNodes);
              let identifiers = childNodes.filter(
                (item) => !removeNodes.includes(item)
              );
              console.log('identifiers', identifiers);
              let questions = [];
              const chunks = [];
              let chunkSize = 10;
              for (let i = 0; i < identifiers.length; i += chunkSize) {
                chunks.push(identifiers.slice(i, i + chunkSize));
              }
              console.log('chunks', chunks);
              for (const chunk of chunks) {
                let response_question = await listQuestion(
                  questionListUrl,
                  chunk
                );
                if (response_question?.result?.questions) {
                  for (
                    let i = 0;
                    i < response_question.result.questions.length;
                    i++
                  ) {
                    questions.push(response_question.result.questions[i]);
                  }
                  //console.log('chunk', chunk);
                  //console.log('response_question', response_question);
                }
              }
              console.log('questions', questions.length);
              console.log('identifiers', identifiers.length);
              if (questions.length == identifiers.length) {
                let question_result = {
                  questions: questions,
                  count: questions.length,
                };
                let file_content = { result: question_result };
                set_loading_text('Creating File...');
                await RNFS.writeFile(
                  streamingPath,
                  JSON.stringify(file_content),
                  'utf8'
                );
                console.log('file created successfully:', streamingPath);
                //store content obj
                //console.log(contentObj);
                await storeData(content_do_id, contentObj, 'json');
              } else {
                Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
              }
              //end download
            } catch (error) {
              Alert.alert('Error Catch', `Failed to create file: ${error}`, [
                { text: 'OK' },
              ]);
              console.error('Error creating file:', error);
            }
          } else {
            Alert.alert('Error', `Permission Denied`, [{ text: 'OK' }]);
            console.log('please grant permission');
          }
        } catch (err) {
          Alert.alert('Error Catch', `Failed to create file: ${err}`, [
            { text: 'OK' },
          ]);
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
        {loading_text != '' ? <Text>{loading_text}</Text> : <></>}
      </View>
    );
  }

  //call content url
  let injectedJS = `
  (function() {
      localStorage.setItem('qumlPlayerObject', JSON.stringify(${JSON.stringify({
        qumlPlayerConfig: qumlPlayerConfig,
        questionListUrl: '/list/questions',
      })}));
      localStorage.setItem('questions_data', JSON.stringify(${JSON.stringify({
        questions_data: questionsData.questions_data,
      })}));
    window.setData();
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

export default QuMLPlayerOffline;
