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
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';

import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';
import {
  readContent,
  hierarchyContent,
  assessmentTracking,
  listQuestion,
  telemetryTracking,
  contentTracking,
} from '../../../utils/API/ApiCalls';
import {
  qumlPlayerConfig,
  contentPlayerConfig,
  pdfPlayerConfig,
  videoPlayerConfig,
  epubPlayerConfig,
  questionsData,
} from './data';
import { getData, storeData } from '../../../utils/Helper/JSHelper';
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import Config from 'react-native-config';

import Orientation from 'react-native-orientation-locker';
import {
  getDataFromStorage,
  getUserId,
  logEventFunction,
  setDataInStorage,
} from '../../../utils/JsHelper/Helper';
import {
  storeAsessmentOffline,
  storeTelemetryOffline,
  storeTrackingOffline,
} from '../../../utils/API/AuthService';
import TestResultModal from '../../Assessment/TestResultModal';
import MimeAlertModal from '../../../components/MimeAletModal/MimeAlertModal';

// User-Agent string for a desktop browser (e.g., Chrome on Windows)
const desktopUserAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

const StandAlonePlayer = ({ route }) => {
  console.log('route', route);
  //get courseId and unitId in standalone player
  const navigation = useNavigation();
  const {
    content_do_id,
    content_mime_type,
    title,
    isOffline,
    course_id,
    unit_id,
  } = route.params;
  console.log('######### content_do_id', content_do_id);
  console.log('######### content_mime_type', content_mime_type);

  //back button handle

  useEffect(() => {
    const backAction = () => {
      navigation.goBack(); // Navigate back to the previous screen
      return true; // Returning true prevents the default behavior (exiting the app)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    // Clean up the event listener on component unmount
    return () => {
      backHandler.remove();
    };
  }, [navigation]);

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
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [courseId, setCourseId] = useState(
    course_id ? course_id : content_do_id
  );
  const [unitId, setUnitId] = useState(unit_id ? unit_id : content_do_id);
  //const [telemetryObject, setTelemetryObject] = useState([]);
  let telemetryObject = [];
  let contentEidSTART = [];
  let contentEidINTERACT = [];
  let contentEidEND = [];

  useEffect(() => {
    // Lock the screen to landscape mode
    if (
      content_mime_type == 'application/vnd.ekstep.ecml-archive' ||
      content_mime_type == 'video/x-youtube' ||
      content_mime_type == 'application/vnd.ekstep.h5p-archive' ||
      content_mime_type == 'video/mp4' ||
      content_mime_type == 'video/webm' ||
      content_mime_type == 'application/vnd.ekstep.html-archive'
    ) {
      Orientation.lockToLandscape();
    }

    const fetchData = async () => {
      let tempUserId = await getDataFromStorage('userId');
      let tempUserName = await getDataFromStorage('Username');
      console.log('tempUserId', tempUserId);
      console.log('tempUserName', tempUserName);
      setUserId(tempUserId);
      setUserName(tempUserName);
      let contentType = '';
      content_mime_type == 'application/vnd.sunbird.questionset'
        ? (contentType = 'quml')
        : content_mime_type == 'application/vnd.ekstep.ecml-archive'
        ? (contentType = 'ecml')
        : content_mime_type == 'application/vnd.ekstep.h5p-archive'
        ? (contentType = 'h5p')
        : content_mime_type == 'application/vnd.ekstep.html-archive'
        ? (contentType = 'html')
        : content_mime_type == 'video/x-youtube'
        ? (contentType = 'youtube')
        : content_mime_type == 'application/pdf'
        ? (contentType = 'pdf')
        : content_mime_type == 'application/epub'
        ? (contentType = 'epub')
        : content_mime_type == 'video/mp4'
        ? (contentType = 'mp4')
        : content_mime_type == 'video/webm'
        ? (contentType = 'webm')
        : '';
      await storeData('contentId', content_do_id, '');
      await storeData('contentType', contentType, '');
      await storeData('contentMimeType', content_mime_type, '');
      await storeData('courseId', courseId, '');
      await storeData('unitId', unitId, '');
    };
    fetchData();

    // Unlock orientation when component is unmounted
    return () => {
      Orientation.lockToPortrait();
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
      : content_mime_type == 'video/mp4' || content_mime_type == 'video/webm'
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
  const [alertModal, setAlertModal] = useState(false);
  const [errorDetail, setErrorDetail] = useState('unsupported_content');
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
  const [modal, setModal] = useState(false);
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
    try {
      //get telemetry save
      const data = event.nativeEvent.data;
      let jsonObj = JSON.parse(data);
      let data_obj = jsonObj.data;
      let data_event = jsonObj?.event;
      //check telemetry
      if (data_obj && data_event != "playerevent") {
        //add user id in actor
        try {
          data_obj.actor.id = userId;
        } catch (e) {
          console.log('error', e);
        }
        console.log('####################');
        console.log('data_obj telemetry', JSON.stringify(data_obj));
        console.log('####################');
        //setTelemetryObject((telemetryObject) => [...telemetryObject, data_obj]);
        telemetryObject.push(data_obj);
        //console.log('telemetryObject', telemetryObject);
        await storeData('telemetryObject', telemetryObject, 'json');

        //content tracking
        if (data_obj?.eid == 'START') {
          contentEidSTART = [
            {
              eid: data_obj.eid,
              edata: data_obj.edata,
            },
          ];
        }
        if (data_obj?.eid == 'INTERACT') {
          contentEidINTERACT = [
            {
              eid: data_obj.eid,
              edata: data_obj.edata,
            },
          ];
        }
        if (
          data_obj?.eid == 'END' ||
          data_obj?.edata?.type == 'END' ||
          data_obj?.eid == 'SUMMARY'
        ) {
          contentEidEND = [
            {
              eid: 'END',
              edata: data_obj.edata,
            },
          ];
        }
        await storeData('contentEidSTART', contentEidSTART, 'json');
        await storeData('contentEidINTERACT', contentEidINTERACT, 'json');
        await storeData('contentEidEND', contentEidEND, 'json');
      }
      //check playerevent
      if (data_obj && data_event == "playerevent") {
        console.log('####################');
        console.log('data_obj playerevent', JSON.stringify(data_obj));
        console.log('####################');
        //check if exit button pressed
        if (data_obj?.eid == 'HEARTBEAT' && data_obj?.edata?.type == 'EXIT') {
          await fetchExitData();
          navigation.goBack();
        }
      }
      //for assessment
      if (
        jsonObj?.scoreDetails &&
        content_mime_type == 'application/vnd.sunbird.questionset'
      ) {
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
          console.log('identifierWithoutImg', identifierWithoutImg);
          // console.log('maxScore', maxScore);
          // console.log('seconds', seconds);
          // let userId = 'fb6b2e58-0f14-4d4f-90e4-bae092e7a951';
          let lastAttemptedOn = new Date().toISOString();

          let create_assessment = await assessmentTracking(
            scoreDetails,
            identifierWithoutImg,
            maxScore,
            seconds,
            userId,
            lastAttemptedOn,
            courseId,
            unitId
          );
          //console.log('############# create_assessment', create_assessment);
          if (
            create_assessment &&
            create_assessment?.response?.responseCode == 201
          ) {
            let exam_data = JSON.parse(create_assessment?.data);
            const percentage =
              (exam_data?.totalScore / exam_data?.totalMaxScore) * 100;
            const roundedPercentage = percentage.toFixed(2); // Rounds to 2 decimal places
            setModal(exam_data);
          } else {
            let payload = {
              scoreDetails,
              identifierWithoutImg,
              maxScore,
              seconds,
              userId,
              lastAttemptedOn,
              courseId,
              unitId,
            };
            //store result in offline mode
            await storeAsessmentOffline(userId, identifierWithoutImg, payload);
            console.log(
              '############# create_assessment offline',
              create_assessment
            );
            if (create_assessment && create_assessment?.data) {
              let exam_data = JSON.parse(create_assessment?.data);
              const percentage =
                (exam_data?.totalScore / exam_data?.totalMaxScore) * 100;
              const roundedPercentage = percentage.toFixed(2); // Rounds to 2 decimal places
              setModal(exam_data);
            } else {
              setModal(true);
            }
          }
          set_loading_text('');
          setLoading(false);
        } catch (e) {
          console.log('error', e);
        }
        //setRetrievedData(data);
        //sent assessments track
        fetchExitData();
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  const fetchDataQuml = async () => {
    //content read
    setLoading(true);
    set_loading_text('Reading Content...');
    let contentObj = await getData(content_do_id, 'json');
    if (contentObj == null) {
      set_is_download(true);
      await downloadContentQuML();
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
              //set user id and full name
              qumlPlayerConfig.context.uid = userId;
              qumlPlayerConfig.context.userData = {
                firstName: userName,
                lastName: '',
              };
              //console.log('qumlPlayerConfig set', qumlPlayerConfig);
              set_is_valid_file(true);
            } catch (e) {
              console.log(e);
              set_is_download(true);
              await downloadContentQuML();
            }
          } else {
            set_is_download(true);
            await downloadContentQuML();
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

  const fetchDataEcml = async () => {
    //content read
    setLoading(true);
    set_loading_text('Reading Content...');
    let contentObj = await getData(content_do_id, 'json');
    if (contentObj == null) {
      //download start
      set_is_download(true);
      await downloadContentECMLH5pHTMLYoutube();
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
      set_is_download(false);
    }
    set_loading_text('');
    setLoading(false);
  };

  const fetchDataHtmlH5pYoutube = async () => {
    //content read
    setLoading(true);
    set_loading_text('Reading Content...');
    let contentObj = await getData(content_do_id, 'json');
    if (contentObj == null) {
      //download start
      set_is_download(true);
      await downloadContentECMLH5pHTMLYoutube();
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
      set_is_download(false);
    }
    set_loading_text('');
    setLoading(false);
  };

  const fetchDataPdfVideoEpub = async () => {
    //content read
    setLoading(true);
    set_loading_text('Reading Content...');
    try {
      let contentObj = await getData(content_do_id, 'json');
      if (contentObj == null) {
        //no offline content found
        //play online directly
        let content_response = await readContent(content_do_id);
        if (content_response == null) {
          //Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
          setAlertModal(true);
          setErrorDetail('content_not_in_device');
          set_is_valid_file(false);
        } else {
          let contentObj = content_response?.result?.content;
          if (
            contentObj?.mimeType == 'application/pdf' ||
            contentObj?.mimeType == 'video/mp4' ||
            contentObj?.mimeType == 'video/webm' ||
            contentObj?.mimeType == 'application/epub'
          ) {
            if (contentObj?.mimeType == 'application/pdf') {
              pdfPlayerConfig.metadata = contentObj;
              //console.log('pdfPlayerConfig set', pdfPlayerConfig);
            }
            if (
              contentObj?.mimeType == 'video/mp4' ||
              contentObj?.mimeType == 'video/webm'
            ) {
              videoPlayerConfig.metadata = contentObj;
              //console.log('videoPlayerConfig set', videoPlayerConfig);
            }
            if (contentObj?.mimeType == 'application/epub') {
              epubPlayerConfig.metadata = contentObj;
              //console.log('epubPlayerConfig set', epubPlayerConfig);
            }
            set_is_valid_file(true);
          } else {
            set_is_valid_file(false);
            Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
          }
        }
      } else if (
        contentObj?.mimeType == 'application/pdf' ||
        contentObj?.mimeType == 'video/mp4' ||
        contentObj?.mimeType == 'video/webm' ||
        contentObj?.mimeType == 'application/epub'
      ) {
        //play offline content
        //get content file name
        let temp_file_url = contentObj?.artifactUrl;
        const dividedArray = temp_file_url.split(content_do_id);
        const file_name =
          dividedArray[
            dividedArray.length > 0
              ? dividedArray.length - 1
              : dividedArray.length
          ];
        filePath = `file://${content_file}/${content_do_id}${file_name}`;
        //console.log('filePath', filePath);
        //console.log('create blob url');
        contentObj.artifactUrl = filePath;

        //previewUrl streamingUrl no needed for offline use
        delete contentObj.previewUrl;
        delete contentObj.streamingUrl;
        if (contentObj?.mimeType == 'application/pdf') {
          pdfPlayerConfig.metadata = contentObj;
          //console.log('pdfPlayerConfig set', pdfPlayerConfig);
        }
        if (
          contentObj?.mimeType == 'video/mp4' ||
          contentObj?.mimeType == 'video/webm'
        ) {
          videoPlayerConfig.metadata = contentObj;
          //console.log('videoPlayerConfig set', videoPlayerConfig);
        }
        if (contentObj?.mimeType == 'application/epub') {
          epubPlayerConfig.metadata = contentObj;
          //console.log('epubPlayerConfig set', epubPlayerConfig);
        }
        set_is_valid_file(true);
      } else {
        //invalid file
        set_is_valid_file(false);
        Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
      }
    } catch (e) {
      set_is_valid_file(false);
      Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
    }
    set_is_download(false);
    set_loading_text('');
    setLoading(false);
  };

  const [temp] = useState([]);
  useEffect(() => {
    content_mime_type == 'application/vnd.ekstep.ecml-archive'
      ? fetchDataEcml()
      : content_mime_type == 'video/x-youtube' ||
        content_mime_type == 'application/vnd.ekstep.html-archive' ||
        content_mime_type == 'application/vnd.ekstep.h5p-archive'
      ? fetchDataHtmlH5pYoutube()
      : content_mime_type == 'application/pdf' ||
        content_mime_type == 'video/mp4' ||
        content_mime_type == 'video/webm' ||
        content_mime_type == 'application/epub'
      ? fetchDataPdfVideoEpub()
      : content_mime_type == 'application/vnd.sunbird.questionset'
      ? fetchDataQuml()
      : '';
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      if (
        content_mime_type == 'application/vnd.ekstep.ecml-archive' ||
        content_mime_type == 'video/x-youtube' ||
        content_mime_type == 'application/vnd.ekstep.html-archive' ||
        content_mime_type == 'application/vnd.ekstep.h5p-archive' ||
        content_mime_type == 'application/pdf' ||
        content_mime_type == 'video/mp4' ||
        content_mime_type == 'application/epub' ||
        content_mime_type == 'application/vnd.sunbird.questionset'
      ) {
        setAlertModal(false);
      } else {
        setAlertModal(true);
        setErrorDetail('unsupported_content');
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const downloadContentECMLH5pHTMLYoutube = async () => {
    //content read
    setLoading(true);
    set_loading_text('Reading Content...');
    //get data online
    let content_response = await readContent(content_do_id);
    if (content_response == null) {
      //Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      setAlertModal(true);
      setErrorDetail('content_not_in_device');
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
          if (contentObj?.mimeType == 'video/x-youtube') {
            //console.log('permission got');
            //store content obj
            //console.log(contentObj);
            await storeData(content_do_id, contentObj, 'json');
            await fetchDataHtmlH5pYoutube();
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
                    await storeData(content_do_id, contentObj, 'json');
                    contentObj?.mimeType ==
                    'application/vnd.ekstep.ecml-archive'
                      ? fetchDataEcml()
                      : contentObj?.mimeType ==
                          'application/vnd.ekstep.html-archive' ||
                        contentObj?.mimeType ==
                          'application/vnd.ekstep.h5p-archive'
                      ? await fetchDataHtmlH5pYoutube()
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
              Alert.alert('Error Catch', `Failed to download file: ${error}`, [
                { text: 'OK' },
              ]);
              console.error('Error downloading file:', error);
            }
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
      //Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      setAlertModal(true);
      setErrorDetail('content_not_in_device');
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
              await fetchDataQuml();
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
  };

  // New zoom-disabling script
  const disableZoomJS = `
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  document.head.appendChild(meta);
  `;

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
        })(); ${disableZoomJS} true;`
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
        })(); ${disableZoomJS} true;`
      : content_mime_type == 'application/pdf'
      ? `(function() {
        window.setData('${JSON.stringify(pdfPlayerConfig)}');
        })(); ${disableZoomJS} true;`
      : content_mime_type == 'video/mp4' || content_mime_type == 'video/webm'
      ? `(function() {
        window.setData('${JSON.stringify(videoPlayerConfig)}');
        })(); ${disableZoomJS} true;`
      : content_mime_type == 'application/epub'
      ? `(function() {
        window.setData('${JSON.stringify(epubPlayerConfig)}');
        })(); ${disableZoomJS} true;`
      : ``;

  //event when player closed
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Handle back button press
        console.log('useFocusEffect Back button pressed or screen closed');
        fetchExitData();
        return false; // Return true if you want to block the back action, false to allow it
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        // Cleanup on unmount
        //console.log('useFocusEffect Screen closed');
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );

  const logEvent = async () => {
    const obj = {
      eventName: 'content_exited',
      method: 'button_click',
      screenName: 'Content-Player-exit',
    };

    await logEventFunction(obj);
  };

  const fetchExitData = async () => {
    //store telemetry event
    let storedTelemetryObject = await getData('telemetryObject', 'json');
    if (storedTelemetryObject && storedTelemetryObject.length > 0) {
      try {
        let create_telemetry = await telemetryTracking(storedTelemetryObject);
        //console.log('create_telemetry', create_telemetry);
        if (
          create_telemetry &&
          create_telemetry?.response?.responseCode == 'SUCCESS'
        ) {
          console.log('saved data');
        } else {
          console.log('no internet available');
          //store result in offline mode
          const userId = await getDataFromStorage('userId');
          await storeTelemetryOffline(userId, storedTelemetryObject);
        }
      } catch (e) {
        console.log(e);
      }
    }
    //console.log('storedTelemetryObject', JSON.stringify(storedTelemetryObject));
    //store content tracking
    let storedContentEidSTART = await getData('contentEidSTART', 'json');
    let storedContentEidINTERACT = await getData('contentEidINTERACT', 'json');
    let storedContentEidEND = await getData('contentEidEND', 'json');

    let detailsObject = [];
    if (storedContentEidSTART.length > 0) {
      detailsObject.push(storedContentEidSTART[0]);
    }
    if (storedContentEidINTERACT.length > 0) {
      detailsObject.push(storedContentEidINTERACT[0]);
    }
    if (storedContentEidEND.length > 0) {
      detailsObject.push(storedContentEidEND[0]);
    } else {
      //for only html content games push end event manually after close app
      if (content_mime_type == 'application/vnd.ekstep.html-archive') {
        detailsObject.push({
          eid: 'END',
          edata: {
            duration: 0,
            mode: 'play',
            pageid: 'sunbird-player-Endpage',
            summary: [
              {
                progress: 100,
              },
              {
                totallength: '',
              },
              {
                visitedlength: '',
              },
              {
                visitedcontentend: '',
              },
              {
                totalseekedlength: '',
              },
              {
                endpageseen: false,
              },
            ],
            type: 'content',
          },
        });
      }
    }

    let userId = await getDataFromStorage('userId');
    let courseId = await getData('courseId', '');
    let unitId = await getData('unitId', '');
    let contentId = await getData('contentId', '');
    let contentType = await getData('contentType', '');
    let contentMime = await getData('contentMimeType', '');
    let lastAccessOn = new Date().toISOString();

    if (detailsObject && detailsObject.length > 0) {
      try {
        let create_tracking = await contentTracking(
          userId,
          courseId,
          contentId,
          contentType,
          contentMime,
          lastAccessOn,
          detailsObject,
          unitId
        );
        console.log('create_tracking', create_tracking);
        if (create_tracking && create_tracking?.response?.responseCode == 201) {
          console.log('saved data');
        } else {
          console.log('no internet available');
          //store result in offline mode
          await storeTrackingOffline(
            userId,
            courseId,
            contentId,
            contentType,
            contentMime,
            lastAccessOn,
            detailsObject,
            unitId
          );
        }
        logEvent();
      } catch (e) {
        console.log(e);
      }
    }
  };
  //event when player closed

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.middle_screen}>
          <ActivityIndicator size="large" color="#0000ff" />
          {progress > 0 && progress < 100 ? (
            <Text
              allowFontScaling={false}
              style={{ color: '#000000' }}
            >{`Loading: ${progress.toFixed(2)}%`}</Text>
          ) : loading_text != '' ? (
            <Text allowFontScaling={false} style={{ color: '#000000' }}>
              {loading_text}
            </Text>
          ) : (
            <></>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      {/* Hides the status bar */}
      <StatusBar hidden={true} />
      <SafeAreaView style={styles.container}>
        {/* <StatusBar barStyle="dark-content" /> */}
        {is_valid_file == false ? (
          <View style={styles.middle_screen}>
            <Text allowFontScaling={false}>Invalid Player File</Text>
          </View>
        ) : is_download == true ? (
          <View style={styles.middle_screen}>
            <Button
              title="Download Content"
              onPress={() => {
                if (
                  content_mime_type == 'application/vnd.sunbird.questionset'
                ) {
                  downloadContentQuML();
                } else if (
                  content_mime_type == 'application/vnd.ekstep.ecml-archive' ||
                  content_mime_type == 'video/x-youtube' ||
                  content_mime_type == 'application/vnd.ekstep.html-archive' ||
                  content_mime_type == 'application/vnd.ekstep.h5p-archive'
                ) {
                  downloadContentECMLH5pHTMLYoutube();
                }
              }}
            />
          </View>
        ) : (
          <WebView
            ref={webviewRef}
            originWhitelist={['*']}
            source={
              Platform.OS === 'ios' ? htmlFilePath : { uri: htmlFilePath }
            }
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
        <TestResultModal
          modal={modal}
          title={title}
          isFromCourse={courseId == content_do_id ? true : false}
        />
        {alertModal && <MimeAlertModal textTitle={errorDetail} />}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Removes top padding for Android
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
