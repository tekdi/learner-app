import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  Alert,
} from 'react-native';
import FastImage from '@changwoolab/react-native-fast-image';
import globalStyles from '../../utils/Helper/Style';
import { useTranslation } from '../../context/LanguageContext';
import Config from 'react-native-config';
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import {
  hierarchyContent,
  listQuestion,
  questionsetRead,
  readContent,
} from '../../utils/API/ApiCalls';
import { getData, removeData, storeData } from '../../utils/Helper/JSHelper';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import { findObjectByIdentifier } from '../../utils/JsHelper/Helper';

const DownloadModal = ({
  setDrawerVisible,
  isDrawerVisible,
  title,
  contentId,
  contentMimeType,
  setDownload,
}) => {
  const { t } = useTranslation();
  const [downloadStatus, setDownloadStatus] = useState('');
  const questionListUrl = Config.QUESTION_LIST_URL;
  const [validDownloadFile, setValidDownloadFile] = useState(null);
  const [networkstatus, setNetworkstatus] = useState(true);
  //download status
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const downloadTask = useRef(null);
  const toggleDrawer = () => {
    setDrawerVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log('I am out', contentMimeType);
      if (
        contentMimeType == 'application/vnd.ekstep.ecml-archive' ||
        contentMimeType == 'application/vnd.ekstep.html-archive' ||
        contentMimeType == 'application/vnd.ekstep.h5p-archive' ||
        contentMimeType == 'application/pdf' ||
        contentMimeType == 'video/mp4' ||
        contentMimeType == 'video/webm' ||
        contentMimeType == 'application/epub' ||
        contentMimeType == 'application/vnd.sunbird.questionset'
      ) {
        console.log('I am here');

        setValidDownloadFile(true);
        let content_do_id = contentId;
        let contentObj = await getData(content_do_id, 'json');
        //console.log('contentObj', contentObj);
        if (contentObj == null) {
          setDownloadStatus('download');
          setDownload('download');
        } else {
          setDownloadStatus('completed');
          setDownload('completed');
        }
      } else {
        setValidDownloadFile(false);
      }
    };

    fetchData();
  }, [isDrawerVisible]);

  const downloadContentECMLH5pHTMLYoutube = async (content_do_id) => {
    const content_file = `${RNFS.DocumentDirectoryPath}/${content_do_id}`;
    const streamingPath = `${content_file}/${content_do_id}.json`;
    //content read
    setDownloadStatus('progress');
    setDownload('progress');
    //get data online
    let content_response = await readContent(content_do_id);
    if (content_response == null) {
      setNetworkstatus(false);
      setDownloadStatus('download');
      setDownload('download');
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
                progress: (res) => {},
              });
              const result = await download.promise;
              if (result.statusCode === 200) {
                console.log('File downloaded successfully:', filePath);
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
                    setDownloadStatus('completed');
                    setDownload('completed');
                  } catch (error) {
                    console.error(`Error extracting zip file: ${error}`);
                  }
                } catch (error) {
                  console.error(`Error extracting zip file: ${error}`);
                }
              } else {
                Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
                setDownloadStatus('download');
                setDownload('download');
                setDownload('download');
              }
            } catch (error) {
              Alert.alert('Error Catch', `Failed to create file: ${error}`, [
                { text: 'OK' },
              ]);
              console.error('Error creating file:', error);
              setDownloadStatus('download');
              setDownload('download');
            }
          }
        } catch (err) {
          Alert.alert('Error Catch', `Failed to download file: ${err}`, [
            { text: 'OK' },
          ]);
          console.log('display error', err);
          setDownloadStatus('download');
          setDownload('download');
        }
      } else {
        Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
        setDownloadStatus('download');
        setDownload('download');
      }
    }
  };

  const downloadContentQuML = async (content_do_id) => {
    const content_file = `${RNFS.DocumentDirectoryPath}/${content_do_id}`;
    const streamingPath = `${content_file}/${content_do_id}.json`;
    //content read
    setDownloadStatus('progress');
    //get data online
    let content_response = await hierarchyContent(content_do_id);
    if (content_response == null) {
      //Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      setNetworkstatus(false);
      setDownloadStatus('download');
    } else {
      let contentObj = content_response?.result?.questionSet;
      //fix for response with questionset
      if (!contentObj) {
        contentObj = content_response?.result?.questionset;
      }
      let filePath = '';
      if (contentObj?.mimeType == 'application/vnd.sunbird.questionset') {
        //find outcomeDeclaration
        let questionsetRead_response = await questionsetRead(content_do_id);

        // console.log(
        //   '######## questionsetRead_response',
        //   questionsetRead_response
        // );
        if (
          questionsetRead_response != null &&
          questionsetRead_response?.result?.questionset
        ) {
          contentObj.outcomeDeclaration =
            questionsetRead_response?.result?.questionset?.outcomeDeclaration;
        }
        filePath = `${content_file}`;
      }
      if (filePath != '') {
        //create file and store object in local
        try {
          //console.log('permission got');
          try {
            //create directory
            await RNFS.mkdir(filePath);
            //create directory and add json file in it
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
            //console.log('chunks', chunks);
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
            //console.log('questions', questions.length);
            //console.log('identifiers', identifiers.length);
            if (questions.length == identifiers.length) {
              //add questions in contentObj for offline use
              let temp_contentObj = contentObj;
              if (contentObj?.children) {
                for (let i = 0; i < contentObj.children.length; i++) {
                  if (contentObj.children[i]?.children) {
                    for (
                      let j = 0;
                      j < contentObj.children[i]?.children.length;
                      j++
                    ) {
                      let temp_obj = contentObj.children[i]?.children[j];
                      if (temp_obj?.identifier) {
                        // Example usage
                        const identifierToFind = temp_obj.identifier;
                        const result_question = findObjectByIdentifier(
                          questions,
                          identifierToFind
                        );
                        //replace with question
                        temp_contentObj.children[i].children[j] =
                          result_question;
                      }
                    }
                  }
                }
              }
              contentObj = temp_contentObj;
              //end add questions in contentObj for offline use

              let question_result = {
                questions: questions,
                count: questions.length,
              };
              let file_content = { result: question_result };
              await RNFS.writeFile(
                streamingPath,
                JSON.stringify(file_content),
                'utf8'
              );
              console.log('file created successfully:', streamingPath);
              //store content obj
              //console.log(contentObj);
              await storeData(content_do_id, contentObj, 'json');
              setDownloadStatus('completed');
            } else {
              Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
              setDownloadStatus('download');
            }
            //end download
          } catch (error) {
            Alert.alert('Error Catch', `Failed to create file: ${error}`, [
              { text: 'OK' },
            ]);
            console.error('Error creating file:', error);
            setDownloadStatus('download');
          }
        } catch (err) {
          Alert.alert('Error Catch', `Failed to create file: ${err}`, [
            { text: 'OK' },
          ]);
          console.log('display error', err);
          setDownloadStatus('download');
        }
      } else {
        Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
        setDownloadStatus('download');
      }
    }
  };

  const downloadContentPDFEpubVideo = async (content_do_id) => {
    const content_file = `${RNFS.DocumentDirectoryPath}/${content_do_id}`;
    const streamingPath = `${content_file}/${content_do_id}.json`;
    //content read
    setDownloadStatus('progress');
    setDownload('progress');
    setDownloadProgress(0);
    //get data online
    let content_response = await readContent(content_do_id);
    if (content_response == null) {
      //Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      setNetworkstatus(false);
      setDownloadStatus('download');
      setDownload('download');
    } else {
      let contentObj = content_response?.result?.content;
      let filePath = '';
      if (contentObj?.mimeType == 'application/pdf') {
        filePath = `${content_file}.pdf`;
      } else if (contentObj?.mimeType == 'application/epub') {
        filePath = `${content_file}.epub`;
      } else if (contentObj?.mimeType == 'video/mp4') {
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
          //console.log('permission got');
          try {
            setIsDownloading(true);
            downloadTask.current = RNFS.downloadFile({
              fromUrl: fileUrl,
              toFile: filePath,
              begin: (res) => {
                console.log('Download started');
              },
              progress: (res) => {
                const progressPercent =
                  (res.bytesWritten / res.contentLength) * 100;
                setDownloadProgress(Math.round(progressPercent));
              },
            });
            // Handle download completion or errors
            downloadTask.current.promise
              .then(async (res) => {
                setIsDownloading(false);
                if (res.statusCode === 200) {
                  console.log('File downloaded successfully:', filePath);
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
                    setDownloadStatus('completed');
                    setDownload('completed');
                  } catch (error) {
                    console.log('error', error);
                    Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
                    setDownloadStatus('download');
                    setDownload('download');
                  }
                } else {
                  console.log('Download failed');
                  setFailedModalVisible(true);
                  // Alert.alert(
                  //   'Error Internal',
                  //   `Failed to download file: ${JSON.stringify(res)}`,
                  //   [{ text: 'OK' }]
                  // );
                }
              })
              .catch((err) => {
                setIsDownloading(false);
                if (err.message !== 'Download has been aborted') {
                  setFailedModalVisible(true);
                  // Alert.alert(
                  //   'Error Internal',
                  //   `Failed to download file: ${JSON.stringify(err.message)}`,
                  //   [{ text: 'OK' }]
                  // );
                }
              });
            /*const result = await download.promise;
            if (result.statusCode === 200) {
            } else {
              console.log('Failed to download file:', result.statusCode);
            }*/
          } catch (error) {
            Alert.alert('Error Catch', `Failed to create file: ${error}`, [
              { text: 'OK' },
            ]);
            console.error('Error creating file:', error);
            setDownloadStatus('download');
            setDownload('download');
          }
        } catch (err) {
          Alert.alert('Error Catch', `Failed to create file: ${err}`, [
            { text: 'OK' },
          ]);
          console.log('display error', err);
          setDownloadStatus('download');
          setDownload('download');
        }
      } else {
        Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
        setDownloadStatus('download');
        setDownload('download');
      }
    }
  };
  const radius = 40; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle

  const handleDownload = async () => {
    setNetworkstatus(true);
    if (
      contentMimeType == 'application/vnd.ekstep.ecml-archive' ||
      contentMimeType == 'video/x-youtube' ||
      contentMimeType == 'application/vnd.ekstep.html-archive' ||
      contentMimeType == 'application/vnd.ekstep.h5p-archive'
    ) {
      await downloadContentECMLH5pHTMLYoutube(contentId);
    } else if (
      contentMimeType == 'application/pdf' ||
      contentMimeType == 'video/mp4' ||
      contentMimeType == 'video/webm' ||
      contentMimeType == 'application/epub'
    ) {
      await downloadContentPDFEpubVideo(contentId);
    } else if (contentMimeType == 'application/vnd.sunbird.questionset') {
      await downloadContentQuML(contentId);
    } else {
    }
  };

  const handleDelete = async () => {
    const content_folder = `${RNFS.DocumentDirectoryPath}/${contentId}`;
    const content_zip_file = `${content_folder}.zip`;
    //delete from internal storage
    try {
      //delete json object
      let contentRemoveObj = await removeData(contentId);
      console.log('contentRemoveObj', contentRemoveObj);
      if (contentRemoveObj) {
        // Check if the folder exists
        const folderExists = await RNFS.exists(content_folder);
        if (folderExists) {
          // Delete the folder and its contents
          await RNFS.unlink(content_folder);
          console.log('Folder deleted successfully');
        } else {
          console.log('Folder does not exist');
        }
        // Check if the file exists
        const fileExists = await RNFS.exists(content_zip_file);
        if (fileExists) {
          // Delete the file
          await RNFS.unlink(content_zip_file);
          console.log('File deleted successfully');
        } else {
          console.log('File does not exist');
        }
        //delete completed
        resetDownload();
      }
    } catch (error) {
      console.error('Error deleting folder files:', error);
    }
  };

  const cancelDownload = () => {
    // console.log('############## download Task', downloadTask);
    if (downloadTask.current && downloadTask.current?.jobId) {
      RNFS.stopDownload(downloadTask.current.jobId);
      // console.log('Download canceled');
      resetDownload();
    } else {
      // console.log('No active download to cancel');
    }
  };

  const resetDownload = () => {
    setDownloadStatus('download');
    setDownload('download');
    setDownloadProgress(0);
    setIsDownloading(false);
  };

  return (
    <>
      <NetworkAlert
        onTryAgain={handleDownload}
        isConnected={networkstatus}
        closeModal={() => {
          setNetworkstatus(!networkstatus);
        }}
      />
      <Modal
        visible={isDrawerVisible}
        transparent={true} // Enable transparency for the modal
        animationType="slide" // Slide in from the bottom
        onRequestClose={toggleDrawer} // Handle back button press (Android)
      >
        <Pressable style={styles.backdrop} onPress={toggleDrawer}>
          {/* Close on backdrop press */}
          <View />
        </Pressable>
        <View style={styles.drawer}>
          {/* Top Indicator */}
          <View style={styles.indicator} />

          {/* Modal Content */}
          <View style={{ width: '100%' }}>
            <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              style={[
                globalStyles.subHeading,
                { color: '#7C766F', marginBottom: 10 },
              ]}
            >
              {title}
            </Text>
            {/* Save for Offline */}

            {/* Saving */}

            {/* Remove Offline Access */}
            {validDownloadFile && downloadStatus == 'completed' ? (
              <TouchableOpacity
                style={globalStyles.flexrow}
                onPress={handleDelete}
              >
                <FastImage
                  style={styles.img}
                  source={require('../../assets/images/png/cloud_done.png')}
                  resizeMode={FastImage.resizeMode.contain}
                  priority={FastImage.priority.high}
                />
                <Text style={[globalStyles.text, { marginLeft: 10 }]}>
                  {t('remove_offline_access')}
                </Text>
              </TouchableOpacity>
            ) : validDownloadFile && downloadStatus == 'progress' ? (
              <TouchableOpacity
                style={globalStyles.flexrow}
                onPress={cancelDownload}
              >
                <View style={styles.flexRow}>
                  <FastImage
                    style={styles.img}
                    source={require('../../assets/images/png/cloud_download.gif')}
                    resizeMode={FastImage.resizeMode.contain}
                    priority={FastImage.priority.high}
                  />
                  <Text style={[globalStyles.text, { marginLeft: 5 }]}>
                    {downloadProgress}%
                  </Text>
                </View>
                <Text style={[globalStyles.text, { marginLeft: 10 }]}>
                  {t('saving')}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={globalStyles.flexrow}
                onPress={handleDownload}
              >
                <FastImage
                  style={styles.img}
                  source={require('../../assets/images/png/cloud.png')}
                  resizeMode={FastImage.resizeMode.contain}
                  priority={FastImage.priority.high}
                />
                <Text style={[globalStyles.text, { marginLeft: 10 }]}>
                  {t('save_for_offline_access')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent black background
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  drawer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    height: '30%', // Height of the drawer
    position: 'absolute',
    bottom: 0, // Align at the bottom
  },
  indicator: {
    borderWidth: 5,
    width: 50,
    borderRadius: 20,
    borderColor: '#DADADA',
    marginBottom: 20,
  },
  img: {
    width: 30,
    height: 30,
  },
});

export default DownloadModal;
