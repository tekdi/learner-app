import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Button,
  ActivityIndicator,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { PermissionsAndroid } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';

import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';
import {
  readContent,
  hierarchyContent,
  assessmentTracking,
  listQuestion,
} from '../../../utils/API/ApiCalls';
import {
  qumlPlayerConfig,
  contentPlayerConfig,
  pdfPlayerConfig,
  videoPlayerConfig,
  epubPlayerConfig,
  questionsData,
} from './data';
import {
  getData,
  loadFileAsBlob,
  storeData,
} from '../../../utils/Helper/JSHelper';
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import Config from 'react-native-config';

import Orientation from 'react-native-orientation-locker';
import { getDataFromStorage, getUserId } from '../../../utils/JsHelper/Helper';

// User-Agent string for a desktop browser (e.g., Chrome on Windows)
const desktopUserAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

const StandAlonePlayer = ({ route }) => {
  const navigation = useNavigation();
  const { content_do_id, content_mime_type, isOffline } = route.params;
  console.log('content_do_id', content_do_id);
  console.log('content_mime_type', content_mime_type);
  //   ##content_mime_type

  //   #sunbird-content-player
  //   application/vnd.ekstep.ecml-archive
  //   application/vnd.ekstep.html-archive
  //   application/vnd.ekstep.h5p-archive
  //   video/x-youtube

  //   #sunbird-pdf-player
  //   application/pdf

  //   #sunbird-epub-player
  //   application/epub

  //   #sunbird-video-player
  //   video/Webm
  //   video/mp4

  //   #sunbird-quml-player
  //   application/vnd.sunbird.question

  useEffect(() => {
    // Lock the screen to landscape mode
    //Orientation.lockToLandscape();

    // Unlock orientation when component is unmounted
    return () => {
      //Orientation.unlockAllOrientations();
    };
  }, []);

  //common compoennt variables
  const [lib_folder] = useState(
    content_mime_type == 'application/vnd.ekstep.ecml-archive' ||
      content_mime_type == 'video/x-youtube' ||
      content_mime_type == 'application/vnd.ekstep.html-archive' ||
      content_mime_type == 'application/vnd.ekstep.h5p-archive'
      ? 'sunbird-content-player'
      : content_mime_type == 'application/pdf'
        ? 'sunbird-pdf-player'
        : content_mime_type == 'application/vnd.sunbird.questionset'
          ? 'sunbird-quml-player'
          : content_mime_type == 'video/mp4' ||
              content_mime_type == 'video/webm'
            ? 'sunbird-video-player'
            : content_mime_type == 'application/epub'
              ? 'sunbird-epub-player'
              : ''
  );
  const [lib_file] = useState(
    content_mime_type == 'application/vnd.sunbird.questionset'
      ? 'index_o.html'
      : content_mime_type == 'application/vnd.ekstep.ecml-archive' ||
          content_mime_type == 'application/pdf' ||
          content_mime_type == 'video/mp4' ||
          content_mime_type == 'video/webm' ||
          content_mime_type == 'video/x-youtube' ||
          content_mime_type == 'application/vnd.ekstep.html-archive' ||
          content_mime_type == 'application/vnd.ekstep.h5p-archive' ||
          content_mime_type == 'application/epub'
        ? 'index.html'
        : ''
  );

  const [loading, setLoading] = useState(true);
  const content_file = `${RNFS.DocumentDirectoryPath}/${content_do_id}`;
  const streamingPath =
    content_mime_type == 'application/vnd.ekstep.ecml-archive'
      ? `${content_file}`
      : content_mime_type == 'application/vnd.ekstep.html-archive'
        ? `${content_file}/assets/public/content/html/${content_do_id}-latest`
        : content_mime_type == 'application/vnd.ekstep.h5p-archive'
          ? `${content_file}/assets/public/content/h5p/${content_do_id}-latest`
          : `${content_file}/${content_do_id}.json`;
  // console.log('rnfs DocumentDirectoryPath', RNFS.DocumentDirectoryPath);
  // console.log('rnfs ExternalDirectoryPath', RNFS.ExternalDirectoryPath);
  const [is_valid_file, set_is_valid_file] = useState(null);
  const [is_download, set_is_download] = useState(null);
  const questionListUrl = Config.QUESTION_LIST_URL;
  const [progress, setProgress] = useState(0);
  const [loading_text, set_loading_text] = useState('');
  // Determine the correct path to the index.html file based on the platform
  const htmlFilePath = Platform.select({
    ios: `./assets/assets/libs/${lib_folder}/${lib_file}`,
    android: `file:///android_asset/libs/${lib_folder}/${lib_file}`,
  });

  //set data from react native
  const webviewRef = useRef(null);
  // webview event
  const handleNavigationStateChange = (navState) => {
    console.log('Current URL:', navState.url);
  };
  const handleMessage = async (event) => {
    // const data = event.nativeEvent.data;
    // let jsonObj = JSON.parse(data);
    // let data_obj = jsonObj.data;
    // if (data_obj) {
    //   console.log('####################');
    //   console.log('data_obj', JSON.stringify(data_obj));
    //   console.log('####################');
    // }
    //for assessment
    if (content_mime_type == 'application/vnd.sunbird.questionset') {
      setLoading(true);
      set_loading_text('Sending Result...');
      try {
        const data = event.nativeEvent.data;
        let jsonObj = JSON.parse(data);
        let scoreDetails = jsonObj.scoreDetails;
        let identifierWithoutImg = jsonObj.identifierWithoutImg;
        let maxScore = jsonObj.maxScore;
        let seconds = jsonObj.seconds;
        // console.log('scoreDetails', scoreDetails);
        // console.log('identifierWithoutImg', identifierWithoutImg);
        // console.log('maxScore', maxScore);
        // console.log('seconds', seconds);
        // let userId = 'fb6b2e58-0f14-4d4f-90e4-bae092e7a951';
        const userId = await getDataFromStorage('userId');
        let batchId = await getDataFromStorage('cohortId');
        let create_assessment = await assessmentTracking(
          scoreDetails,
          identifierWithoutImg,
          maxScore,
          seconds,
          userId,
          batchId
        );
        if (
          create_assessment &&
          create_assessment?.response?.responseCode == 201
        ) {
          let exam_data = JSON.parse(create_assessment?.data);
          const percentage =
            (exam_data?.totalScore / exam_data?.totalMaxScore) * 100;
          const roundedPercentage = percentage.toFixed(2); // Rounds to 2 decimal places
          Alert.alert(
            'Success', // Title of the alert
            `You got ${exam_data?.totalScore} out of ${exam_data?.totalMaxScore}. Percentage= ${roundedPercentage}%`, // Message of the alert
            [
              {
                text: 'OK', // Text for the "OK" button
                onPress: () =>
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Dashboard' }],
                    })
                  ), // Action to take when "OK" is pressed
              },
            ],
            { cancelable: false } // Determines if the alert is dismissable by tapping outside
          );
        } else {
          Alert.alert(
            'Error', // Title of the alert
            'Resubmit Result', // Message of the alert
            [
              {
                text: 'OK', // Text for the "OK" button
                onPress: () => handleMessage(event), // Action to take when "OK" is pressed
              },
            ],
            { cancelable: false } // Determines if the alert is dismissable by tapping outside
          );
        }
      } catch (e) {
        console.log('error', e);
      }
      //setRetrievedData(data);
    }
  };

  const fetchDataQuml = async () => {
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

  const fetchDataEcml = async (contentObj) => {
    //content read
    setLoading(true);
    set_loading_text('Reading Content...');
    //let contentObj = await getData(content_do_id, 'json');
    if (contentObj == null) {
      //download failed
      Alert.alert('Error', 'Server Not Available', [{ text: 'OK' }]);
    } else {
      let filePath = '';
      if (contentObj?.mimeType == 'application/vnd.ekstep.ecml-archive') {
        filePath = `${content_file}.zip`;
      }
      if (filePath != '') {
        try {
          contentPlayerConfig.metadata = contentObj;
          contentPlayerConfig.data = contentObj?.body;
          contentPlayerConfig.context = {
            host: `file://${content_file}/assets`,
          };
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

  const fetchDataHtmlH5pYoutube = async (contentObj) => {
    //content read
    setLoading(true);
    set_loading_text('Reading Content...');
    //let contentObj = await getData(content_do_id, 'json');
    if (contentObj == null) {
      //download failed
      Alert.alert('Error', 'Server Not Available', [{ text: 'OK' }]);
    } else {
      let filePath = '';
      if (
        contentObj?.mimeType == 'application/vnd.ekstep.html-archive' ||
        contentObj?.mimeType == 'application/vnd.ekstep.h5p-archive' ||
        contentObj?.mimeType == 'video/x-youtube'
      ) {
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

  const fetchDataPdfVideoEpub = async () => {
    //content read
    setLoading(true);
    let content_response = await readContent(content_do_id);
    if (content_response == null) {
      Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      set_is_valid_file(false);
    } else if (
      content_response?.result?.content?.mimeType == 'application/pdf'
    ) {
      pdfPlayerConfig.metadata = content_response.result.content;
      set_is_valid_file(true);
    } else if (
      content_response?.result?.content?.mimeType == 'video/mp4' ||
      content_response?.result?.content?.mimeType == 'video/webm'
    ) {
      videoPlayerConfig.metadata = content_response.result.content;
      set_is_valid_file(true);
    } else if (
      content_response?.result?.content?.mimeType == 'application/epub'
    ) {
      epubPlayerConfig.metadata = content_response.result.content;
      set_is_valid_file(true);
    } else {
      set_is_valid_file(false);
    }
    setLoading(false);
  };

  const [temp] = useState([]);
  useEffect(() => {
    content_mime_type == 'application/vnd.ekstep.ecml-archive' ||
    content_mime_type == 'video/x-youtube' ||
    content_mime_type == 'application/vnd.ekstep.html-archive' ||
    content_mime_type == 'application/vnd.ekstep.h5p-archive'
      ? downloadContent()
      : content_mime_type == 'application/pdf' ||
          content_mime_type == 'video/mp4' ||
          content_mime_type == 'video/webm' ||
          content_mime_type == 'application/epub'
        ? fetchDataPdfVideoEpub()
        : content_mime_type == 'application/vnd.sunbird.questionset'
          ? downloadContentQuML()
          : '';
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
      if (
        contentObj?.mimeType == 'application/vnd.ekstep.ecml-archive' ||
        contentObj?.mimeType == 'application/vnd.ekstep.html-archive' ||
        contentObj?.mimeType == 'application/vnd.ekstep.h5p-archive' ||
        contentObj?.mimeType == 'video/x-youtube'
      ) {
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
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to storage to download files.',
              buttonPositive: 'OK',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            if (contentObj?.mimeType == 'video/x-youtube') {
              //console.log('permission got');
              await fetchDataHtmlH5pYoutube(contentObj);
            } else {
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
                      contentObj?.mimeType ==
                      'application/vnd.ekstep.ecml-archive'
                        ? fetchDataEcml(contentObj)
                        : contentObj?.mimeType ==
                              'application/vnd.ekstep.html-archive' ||
                            contentObj?.mimeType ==
                              'application/vnd.ekstep.h5p-archive'
                          ? await fetchDataHtmlH5pYoutube(contentObj)
                          : '';
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
                Alert.alert(
                  'Error Catch',
                  `Failed to download file: ${error}`,
                  [{ text: 'OK' }]
                );
                console.error('Error downloading file:', error);
              }
            }
          } else {
            Alert.alert('Error', `Permission Denied`, [{ text: 'OK' }]);
            console.log('please grant permission');
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

  const downloadContentQuML = async () => {
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
            //console.log('childNodes', childNodes);
            let removeNodes = [];
            if (contentObj?.children) {
              for (let i = 0; i < contentObj.children.length; i++) {
                if (contentObj.children[i]?.identifier) {
                  removeNodes.push(contentObj.children[i].identifier);
                }
              }
            }
            //console.log('removeNodes', removeNodes);
            let identifiers = childNodes.filter(
              (item) => !removeNodes.includes(item)
            );
            //console.log('identifiers', identifiers);
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
    await fetchDataQuml();
  };

  if (loading) {
    return (
      <View style={styles.middle_screen}>
        <ActivityIndicator size="large" color="#0000ff" />
        {progress > 0 && progress < 100 ? (
          <Text>{`Loading: ${progress.toFixed(2)}%`}</Text>
        ) : loading_text != '' ? (
          <Text style={{ color: '#000' }}>{loading_text}</Text>
        ) : (
          <></>
        )}
      </View>
    );
  }

  //call content url
  let injectedJS =
    content_mime_type == 'application/vnd.sunbird.questionset'
      ? `(function() {
            localStorage.setItem('qumlPlayerObject', JSON.stringify(${JSON.stringify(
              {
                qumlPlayerConfig: qumlPlayerConfig,
                questionListUrl: '/list/questions',
              }
            )}));
            localStorage.setItem('questions_data', JSON.stringify(${JSON.stringify(
              {
                questions_data: questionsData.questions_data,
              }
            )}));
            window.setData();
        })();`
      : content_mime_type == 'application/vnd.ekstep.ecml-archive' ||
          content_mime_type == 'application/vnd.ekstep.html-archive' ||
          content_mime_type == 'application/vnd.ekstep.h5p-archive' ||
          content_mime_type == 'video/x-youtube'
        ? `(function() {
        localStorage.setItem('contentPlayerObject', JSON.stringify(${JSON.stringify(
          {
            contentPlayerConfig: contentPlayerConfig,
          }
        )}));
        window.setData();
        })();`
        : content_mime_type == 'application/pdf'
          ? `(function() {
        window.setData('${JSON.stringify(pdfPlayerConfig)}');
        })();`
          : content_mime_type == 'video/mp4' ||
              content_mime_type == 'video/webm'
            ? `(function() {
        window.setData('${JSON.stringify(videoPlayerConfig)}');
        })();`
            : content_mime_type == 'application/epub'
              ? `(function() {
        window.setData('${JSON.stringify(epubPlayerConfig)}');
        })();`
              : ``;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {is_valid_file == false ? (
        <View style={styles.middle_screen}>
          <Text>Invalid Player File</Text>
        </View>
      ) : is_download == true ? (
        <View style={styles.middle_screen}>
          <Button
            title="Download Content"
            onPress={() => {
              if (content_mime_type == 'application/vnd.sunbird.questionset') {
                downloadContentQuML();
              } else {
                downloadContent();
              }
            }}
          />
        </View>
      ) : (
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={Platform.OS === 'ios' ? htmlFilePath : { uri: htmlFilePath }}
          style={styles.webview}
          userAgent={
            lib_folder == 'sunbird-content-player'
              ? desktopUserAgent
              : undefined
          }
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
          onMessage={handleMessage}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          onNavigationStateChange={handleNavigationStateChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Removes top padding for Android
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

export default StandAlonePlayer;
