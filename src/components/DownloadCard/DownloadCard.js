import React, { useState, useEffect, useRef } from 'react';
import download from '../../assets/images/png/download.png';
import download_inprogress from '../../assets/images/png/download_inprogress.png';
import download_complete from '../../assets/images/png/download_complete.png';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  View,
  Text,
  BackHandler,
} from 'react-native';
import { getData, removeData, storeData } from '../../utils/Helper/JSHelper';
import {
  hierarchyContent,
  listQuestion,
  questionsetRead,
  readContent,
} from '../../utils/API/ApiCalls';
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import Config from 'react-native-config';
import NetworkAlert from '../NetworkError/NetworkAlert';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import { useTranslation } from '../../context/LanguageContext';
import SecondaryButton from '../SecondaryButton/SecondaryButton';
import globalStyles from '../../utils/Helper/Style';
import HorizontalLine from '../HorizontalLine/HorizontalLine';
import { Icon, TopNavigation } from '@ui-kitten/components';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { findObjectByIdentifier } from '../../utils/JsHelper/Helper';

import GlobalText from '@components/GlobalText/GlobalText';

const DownloadCard = ({ contentId, contentMimeType, name }) => {
  const navigation = useNavigation();
  const [downloadIcon, setDownloadIcon] = useState(download);
  const [downloadStatus, setDownloadStatus] = useState('');
  const questionListUrl = Config.QUESTION_LIST_URL;
  const [validDownloadFile, setValidDownloadFile] = useState(null);
  const [networkstatus, setNetworkstatus] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [failedModalVisible, setFailedModalVisible] = useState(false);

  const { t } = useTranslation();

  //download status
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const downloadTask = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (
        contentMimeType == 'application/vnd.ekstep.ecml-archive' ||
        contentMimeType == 'application/vnd.ekstep.html-archive' ||
        contentMimeType == 'application/vnd.ekstep.h5p-archive' ||
        contentMimeType == 'application/pdf' ||
        contentMimeType == 'video/mp4' ||
        contentMimeType == 'video/webm' ||
        contentMimeType == 'audio/mp3' ||
        contentMimeType == 'audio/wav' ||
        contentMimeType == 'application/epub' ||
        contentMimeType == 'application/vnd.sunbird.questionset'
      ) {
        setValidDownloadFile(true);
        let content_do_id = contentId;
        let contentObj = await getData(content_do_id, 'json');
        //console.log('contentObj', contentObj);
        if (contentObj == null) {
          setDownloadStatus('download');
          setDownloadIcon(download);
        } else {
          setDownloadStatus('completed');
          setDownloadIcon(download_complete);
        }
      } else {
        setValidDownloadFile(false);
      }
    };

    fetchData();
  }, []);

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
      contentMimeType == 'audio/mp3' ||
      contentMimeType == 'audio/wav' ||
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

  // Function to cancel the download
  const cancelDownload = () => {
    //console.log('############## download Task', downloadTask);
    if (downloadTask.current && downloadTask.current?.jobId) {
      RNFS.stopDownload(downloadTask.current.jobId);
      console.log('Download canceled');
      resetDownload();
    } else {
      console.log('No active download to cancel');
    }
  };

  const resetDownload = () => {
    setDownloadStatus('download');
    setDownloadIcon(download);
    setModalVisible(false);
    setDownloadProgress(0);
    setIsDownloading(false);
  };

  // Handle the back button press while downloading
  const handleBackPress = () => {
    if (isDownloading) {
      Alert.alert(t('cancel_download'), t('go_back_cancel_download'), [
        { text: t('no'), style: 'cancel' },
        {
          text: t('yes'),
          onPress: () => {
            cancelDownload();
            navigation.goBack();
          },
        },
      ]);
      return true; // Prevent default back action
    }
    return false; // Allow back action
  };

  useEffect(() => {
    // Add back button event listener
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, [isDownloading]);

  const downloadContentECMLH5pHTMLYoutube = async (content_do_id) => {
    const content_file = `${RNFS.DocumentDirectoryPath}/${content_do_id}`;
    const streamingPath = `${content_file}/${content_do_id}.json`;
    //content read
    setDownloadStatus('progress');
    setDownloadIcon(download_inprogress);
    //get data online
    let content_response = await readContent(content_do_id);
    if (content_response == null) {
      setNetworkstatus(false);
      setDownloadStatus('download');
      setDownloadIcon(download);
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
                    setDownloadIcon(download_complete);
                  } catch (error) {
                    console.error(`Error extracting zip file: ${error}`);
                  }
                } catch (error) {
                  console.error(`Error extracting zip file: ${error}`);
                }
              } else {
                Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
                setDownloadStatus('download');
                setDownloadIcon(download);
              }
            } catch (error) {
              Alert.alert('Error Catch', `Failed to create file: ${error}`, [
                { text: 'OK' },
              ]);
              console.error('Error creating file:', error);
              setDownloadStatus('download');
              setDownloadIcon(download);
            }
          }
        } catch (err) {
          Alert.alert('Error Catch', `Failed to download file: ${err}`, [
            { text: 'OK' },
          ]);
          console.log('display error', err);
          setDownloadStatus('download');
          setDownloadIcon(download);
        }
      } else {
        Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
        setDownloadStatus('download');
        setDownloadIcon(download);
      }
    }
  };

  const downloadContentQuML = async (content_do_id) => {
    const content_file = `${RNFS.DocumentDirectoryPath}/${content_do_id}`;
    const streamingPath = `${content_file}/${content_do_id}.json`;
    //content read
    setDownloadStatus('progress');
    setDownloadIcon(download_inprogress);
    //get data online
    let content_response = await hierarchyContent(content_do_id);
    if (content_response == null) {
      //Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      setNetworkstatus(false);
      setDownloadStatus('download');
      setDownloadIcon(download);
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
              setDownloadIcon(download_complete);
            } else {
              Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
              setDownloadStatus('download');
              setDownloadIcon(download);
            }
            //end download
          } catch (error) {
            Alert.alert('Error Catch', `Failed to create file: ${error}`, [
              { text: 'OK' },
            ]);
            console.error('Error creating file:', error);
            setDownloadStatus('download');
            setDownloadIcon(download);
          }
        } catch (err) {
          Alert.alert('Error Catch', `Failed to create file: ${err}`, [
            { text: 'OK' },
          ]);
          console.log('display error', err);
          setDownloadStatus('download');
          setDownloadIcon(download);
        }
      } else {
        Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
        setDownloadStatus('download');
        setDownloadIcon(download);
      }
    }
  };

  const downloadContentPDFEpubVideo = async (content_do_id) => {
    const content_file = `${RNFS.DocumentDirectoryPath}/${content_do_id}`;
    const streamingPath = `${content_file}/${content_do_id}.json`;
    //content read
    setDownloadStatus('progress');
    setDownloadIcon(download_inprogress);
    setDownloadProgress(0);
    //get data online
    let content_response = await readContent(content_do_id);
    if (content_response == null) {
      //Alert.alert('Error', 'Internet is not available', [{ text: 'OK' }]);
      setNetworkstatus(false);
      setDownloadStatus('download');
      setDownloadIcon(download);
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
      } else if (contentObj?.mimeType == 'audio/mp3') {
        filePath = `${content_file}.mp3`;
      } else if (contentObj?.mimeType == 'audio/wav') {
        filePath = `${content_file}.wav`;
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
                    setDownloadIcon(download_complete);
                  } catch (error) {
                    console.log('error', error);
                    Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
                    setDownloadStatus('download');
                    setDownloadIcon(download);
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
            setDownloadIcon(download);
          }
        } catch (err) {
          Alert.alert('Error Catch', `Failed to create file: ${err}`, [
            { text: 'OK' },
          ]);
          console.log('display error', err);
          setDownloadStatus('download');
          setDownloadIcon(download);
        }
      } else {
        Alert.alert('Error', 'Invalid File', [{ text: 'OK' }]);
        setDownloadStatus('download');
        setDownloadIcon(download);
      }
    }
  };
  const radius = 40; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle

  return (
    <>
      {validDownloadFile && downloadStatus == 'progress' ? (
        <View style={styles.container}>
          {/* Right Bottom Corner */}
          <View style={styles.bottomRightContainer}>
            <GlobalText
              style={styles.loadingText}
            >{`${downloadProgress}%`}</GlobalText>
            {/* Custom ActivityIndicator with Cancel Button */}
            <TouchableOpacity onPress={() => cancelDownload()}>
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color="#fff"
                  style={styles.activityIndicator}
                />
                {/* Cancel Button in the center */}
                <View style={styles.cancelButton}>
                  <GlobalText style={styles.cancelText}>X</GlobalText>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : validDownloadFile && downloadStatus == 'completed' ? (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            style={styles.img}
            source={downloadIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : validDownloadFile ? (
        <TouchableOpacity onPress={handleDownload}>
          <Image
            style={styles.img}
            source={downloadIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
      <NetworkAlert
        onTryAgain={handleDownload}
        isConnected={networkstatus}
        closeModal={() => {
          setNetworkstatus(!networkstatus);
        }}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <GlobalText
              style={globalStyles.heading2}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {name}
            </GlobalText>
            <GlobalText
              style={[
                globalStyles.text,
                { marginVertical: 10, textAlign: 'center' },
              ]}
            >
              {t('delete_msg')}
            </GlobalText>
            <HorizontalLine />
            <View style={styles.modalButtonContainer}>
              <View>
                <SecondaryButton
                  onPress={() => {
                    setModalVisible(false);
                  }}
                  text={'cancel'}
                />
              </View>
              <View style={{ width: 120 }}>
                <PrimaryButton
                  onPress={handleDelete}
                  text={t('delete')}
                ></PrimaryButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={failedModalVisible}
        onRequestClose={() => setFailedModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <GlobalText
              style={globalStyles.heading2}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {name}
            </GlobalText>
            <HorizontalLine />
            <GlobalText
              style={[
                globalStyles.text,
                { marginVertical: 10, textAlign: 'center' },
              ]}
            >
              {t('failed_msg')}
            </GlobalText>
            <View>
              <View>
                <SecondaryButton
                  onPress={() => {
                    setFailedModalVisible(false);
                    resetDownload();
                  }}
                  text={t('okay')}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  img: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },

  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 20,
  },

  //for progress center button
  container: {
    flex: 1, // Occupy full height and width
    justifyContent: 'center', // Vertically center the content
    alignItems: 'center', // Horizontally center the content
  },
  circularContainer: {
    position: 'relative', // Position relative to allow absolute positioning of cancel button
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    position: 'absolute',
    top: 5, // Position at the top
    right: 5, // Position at the right
    padding: 5,
    backgroundColor: 'transparent', // Transparent background
  },
  cancelImage: {
    width: 20, // Width of the cancel image
    height: 20, // Height of the cancel image
  },

  //new loader
  bottomRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginRight: 5,
    fontSize: 20,
    color: '#333',
    marginTop: 0,
  },
  loadingContainer: {
    position: 'relative', // to enable the absolute positioning of the cancel button
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 50,
    marginTop: 0,
  },
  activityIndicator: {
    zIndex: 1, // Ensures the indicator stays in the background
  },
  cancelButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff3333',
    width: 25,
    height: 25,
    borderRadius: 15,
    zIndex: 2, // Makes sure the button appears on top
  },
  cancelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

DownloadCard.propTypes = {};

export default DownloadCard;
