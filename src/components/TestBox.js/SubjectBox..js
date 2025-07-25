import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryButton from '../SecondaryButton/SecondaryButton';
import {
  capitalizeFirstLetter,
  convertSecondsToMinutes,
  findObjectByIdentifier,
  getDataFromStorage,
} from '../../utils/JsHelper/Helper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import moment from 'moment';
import globalStyles from '../../utils/Helper/Style';
import download from '../../assets/images/png/download.png';
import download_inprogress from '../../assets/images/png/download_inprogress.png';
import download_complete from '../../assets/images/png/download_complete.png';
import { getData, removeData, storeData } from '../../utils/Helper/JSHelper';
import {
  hierarchyContent,
  listQuestion,
  questionsetRead,
} from '../../utils/API/ApiCalls';
import RNFS from 'react-native-fs';
import Config from 'react-native-config';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import { getAsessmentOffline } from '../../utils/API/AuthService';
import HorizontalLine from '../HorizontalLine/HorizontalLine';
import PrimaryButton from '../PrimaryButton/PrimaryButton';

import GlobalText from '@components/GlobalText/GlobalText';

const IconConditions = ({ status, styles }) => {
  let iconName;
  let IconComponent;

  switch (status) {
    case 'Completed':
      iconName = 'check-circle';
      IconComponent = Icon;
      break;
    case 'In_Progress':
      iconName = 'ellipsis-h';
      IconComponent = Icon;
      break;
    default:
      iconName = 'dash';
      IconComponent = Octicons;
  }

  return (
    <View style={styles.leftContainer}>
      <IconComponent name={iconName} size={24} color="black" />
    </View>
  );
};

const SubjectBox = ({
  name,
  disabled,
  data,
  isAiAssessment,
  aiQuestionSetStatus,
}) => {
  // console.log('#### isAiAssessment', isAiAssessment);
  // console.log('#### isAiAssessment', data?.identifier);
  console.log('#### aiQuestionSetStatus', JSON.stringify(aiQuestionSetStatus));
  // console.log('#### do id data', JSON.stringify(data));

  const { t } = useTranslation();
  const navigation = useNavigation();
  const time = convertSecondsToMinutes(JSON.parse(data?.timeLimits)?.maxTime);
  const [downloadIcon, setDownloadIcon] = useState(download);
  const [downloadStatus, setDownloadStatus] = useState('');
  const questionListUrl = Config.QUESTION_LIST_URL;
  const [networkstatus, setNetworkstatus] = useState(true);
  const [isSyncPending, setIsSyncPending] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // console.log('########### IN SUBJECT BOX');
    let content_do_id = data?.IL_UNIQUE_ID;
    // console.log('########### content_do_id', content_do_id);
    let contentObj = await getData(content_do_id, 'json');
    if (contentObj == null) {
      setDownloadStatus('download');
      setDownloadIcon(download);
    } else {
      setDownloadStatus('completed');
      setDownloadIcon(download_complete);
    }
    //get sync pending
    const user_id = await getDataFromStorage('userId');
    const content_id = data?.IL_UNIQUE_ID;
    const result_sync_offline = await getAsessmentOffline(user_id, content_id);
    // console.log('############ result_sync_offline', result_sync_offline);
    if (result_sync_offline) {
      setIsSyncPending(true);
    } else {
      setIsSyncPending(false);
    }
  };

  const handlePress = () => {
    if (!disabled && !isAiAssessment) {
      navigation.navigate('AnswerKeyView', {
        title: name,
        contentId: data?.IL_UNIQUE_ID,
      });
    } else if (isAiAssessment) {
      navigation.navigate('ATMAssessment', {
        title: name,
        data: data,
        aiQuestionSetStatus: aiQuestionSetStatus,
      });
    }
  };
  const handleDownload = async () => {
    setNetworkstatus(true);
    let content_do_id = data?.IL_UNIQUE_ID;
    await downloadContentQuML(content_do_id);
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
      //console.log('######## contentObj', contentObj);
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

  const handleDelete = async () => {
    let contentId = data?.IL_UNIQUE_ID;
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
        fetchData();
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error deleting folder files:', error);
    }
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.card}>
          <View style={styles.row}>
            {isAiAssessment == true && (
              <IconConditions
                status={
                  aiQuestionSetStatus?.status == 'AI Pending'
                    ? 'In_Progress'
                    : aiQuestionSetStatus?.status == 'Approved'
                    ? 'Completed'
                    : 'Not_Started'
                }
                styles={styles}
              />
            )}
            <View style={styles.contentSection}>
              <GlobalText style={globalStyles.subHeading}>
                {t(capitalizeFirstLetter(name))}
              </GlobalText>
              {isAiAssessment == false && (
                <>
                  {disabled && !isSyncPending ? (
                    <GlobalText style={{ color: '#7C766F' }}>
                      {t('not_submitted')}
                    </GlobalText>
                  ) : !isSyncPending ? (
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <GlobalText style={{ color: '#000' }}>
                        {data?.totalScore}/{data?.totalMaxScore}
                      </GlobalText>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 20,
                        }}
                      >
                        <Icon name="circle" size={8} color="#7C766F" />
                        <GlobalText
                          style={[
                            globalStyles.text,
                            { color: '#7C766F', marginLeft: 5 },
                          ]}
                        >
                          {moment(data?.createdOn).format('DD MMM, YYYY')}
                        </GlobalText>
                        {/* <View style={[globalStyles.flexrow, { marginLeft: 15 }]}>
                      <Ionicons
                        name="cloud-outline"
                        color={'#7C766F'}
                        size={15}
                      />
                      <GlobalText
                        style={[
                          globalStyles.text,
                          { color: '#7C766F', marginLeft: 5 },
                        ]}
                      >
                        {moment(data?.lastAttemptedOn).format('DD MMM, YYYY')}
                      </GlobalText>
                    </View> */}
                      </View>
                    </View>
                  ) : (
                    <></>
                  )}
                </>
              )}
              {isAiAssessment == true && (
                <>
                  {aiQuestionSetStatus?.status == 'AI Pending' && (
                    <GlobalText style={{ color: '#7C766F' }}>
                      {t('submitted_eval')}
                    </GlobalText>
                  )}
                  {aiQuestionSetStatus?.status == 'Approved' && (
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <GlobalText
                        style={{
                          color: '#1F1B13',
                          fontSize: 14,
                          fontFamily: 'Poppins-Medium',
                          letterSpacing: 0.1,
                          lineHeight: 20,
                        }}
                      >
                        Marks: ({data?.totalScore}/{data?.totalMaxScore}){' '}
                        <GlobalText
                          style={{
                            color: '#1A881F',
                            fontSize: 14,
                            fontFamily: 'Poppins-Medium',
                            letterSpacing: 0.1,
                            lineHeight: 20,
                          }}
                        >
                          {data?.totalScore && data?.totalMaxScore
                            ? Math.round((data.totalScore / 16) * 100)
                            : 0}
                          %
                        </GlobalText>
                      </GlobalText>
                    </View>
                  )}
                  {!aiQuestionSetStatus?.status && (
                    <GlobalText style={{ color: '#7C766F' }}>
                      {t('not_submitted')}
                    </GlobalText>
                  )}
                  <GlobalText style={{ color: '#7C766F' }}>
                    {t('published_on')}
                    {': '}
                    {moment(data?.lastPublishedOn).format('DD MMM, YYYY')}
                  </GlobalText>
                </>
              )}
            </View>

            {isAiAssessment == false && (
              <View style={{ marginRight: 10, paddingVertical: 10 }}>
                {data?.lastAttemptedOn ? (
                  <MaterialIcons name="navigate-next" size={32} color="black" />
                ) : isSyncPending ? (
                  <View style={globalStyles.flexrow}>
                    <Ionicons
                      name="cloud-offline-outline"
                      color={'#7C766F'}
                      size={22}
                    />
                    <GlobalText
                      style={[
                        globalStyles.subHeading,
                        { color: '#7C766F', marginLeft: 10 },
                      ]}
                    >
                      {t('sync_pending')}
                    </GlobalText>
                  </View>
                ) : (
                  <SecondaryButton
                    onPress={() => {
                      navigation.navigate('TestDetailView', {
                        title: name,
                        data: data,
                      });
                    }}
                    style={[globalStyles.text]}
                    text={'take_the_test'}
                  />
                )}
              </View>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {isAiAssessment == true ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ATMAssessment', {
                      title: name,
                      data: data,
                      aiQuestionSetStatus: aiQuestionSetStatus,
                    });
                  }}
                >
                  <MaterialIcons name="navigate-next" size={32} color="black" />
                </TouchableOpacity>
              ) : !data?.lastAttemptedOn && downloadStatus == 'progress' ? (
                <ActivityIndicator size="large" />
              ) : !data?.lastAttemptedOn && downloadStatus == 'completed' ? (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Image
                    style={styles.img}
                    source={downloadIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : !data?.lastAttemptedOn ? (
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
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
    </SafeAreaView>
  );
};

SubjectBox.propTypes = {
  name: PropTypes.string,
  data: PropTypes.any,
  disabled: PropTypes.bool,
};
IconConditions.propTypes = {
  status: PropTypes.string,
  styles: PropTypes.object,
};

const styles = StyleSheet.create({
  card: {
    // flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D0C5B4',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'white',
    // padding: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSection: {
    flex: 1,
    alignItems: 'center',
  },
  contentSection: {
    flex: 10,
    paddingHorizontal: 8,
  },
  buttonSection: {
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  leftContainer: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFDEA1',
    paddingVertical: 20,
    // borderWidth: 1,
    height: 'auto',
  },
  rightContainer: {
    flex: 4,
    marginLeft: 10,
    // borderWidth: 1,
  },

  smileyText: {
    fontSize: 16,
    marginLeft: 5,
  },
  rightArrow: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 20,
  },
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
});

export default SubjectBox;
