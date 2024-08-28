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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import SecondaryButton from '../SecondaryButton/SecondaryButton';
import {
  capitalizeFirstLetter,
  convertSecondsToMinutes,
  getDataFromStorage,
} from '../../utils/JsHelper/Helper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import globalStyles from '../../utils/Helper/Style';
import download from '../../assets/images/png/download.png';
import download_inprogress from '../../assets/images/png/download_inprogress.png';
import download_complete from '../../assets/images/png/download_complete.png';
import { getData, storeData } from '../../utils/Helper/JSHelper';
import { hierarchyContent, listQuestion } from '../../utils/API/ApiCalls';
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import Config from 'react-native-config';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import { getAsessmentOffline } from '../../utils/API/AuthService';

const SubjectBox = ({ name, disabled, data }) => {
  // console.log({ data });
  const { t } = useTranslation();
  const navigation = useNavigation();
  const time = convertSecondsToMinutes(JSON.parse(data?.timeLimits)?.maxTime);
  const [downloadIcon, setDownloadIcon] = useState(download);
  const [downloadStatus, setDownloadStatus] = useState('');
  const questionListUrl = Config.QUESTION_LIST_URL;
  const [networkstatus, setNetworkstatus] = useState(true);
  const [isSyncPending, setIsSyncPending] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let content_do_id = data?.IL_UNIQUE_ID;
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
      const batch_id = await getDataFromStorage('cohortId');
      const content_id = data?.IL_UNIQUE_ID;
      const result_sync_offline = await getAsessmentOffline(
        user_id,
        batch_id,
        content_id
      );
      console.log({ result_sync_offline });
      if (result_sync_offline) {
        setIsSyncPending(true);
      } else {
        setIsSyncPending(false);
      }
    };
    fetchData();
  }, []);

  const handlePress = () => {
    navigation.navigate('AnswerKeyView', {
      title: name,
      contentId: data?.IL_UNIQUE_ID,
    });
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

  return (
    <SafeAreaView>
      <TouchableOpacity disabled={disabled} onPress={handlePress}>
        <View style={styles.card}>
          <View style={styles.rightContainer}>
            <Text style={globalStyles.subHeading}>
              {t(capitalizeFirstLetter(name))}
            </Text>
            {disabled && !isSyncPending ? (
              <Text style={[globalStyles.subHeading, { color: '#7C766F' }]}>
                {t('not_started')}
              </Text>
            ) : !isSyncPending ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#000' }}>
                  {data?.totalScore}/{data?.totalMaxScore}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 20,
                  }}
                >
                  <Icon name="circle" size={8} color="#7C766F" />
                  <Text
                    style={[
                      globalStyles.text,
                      { color: '#7C766F', marginLeft: 5 },
                    ]}
                  >
                    {moment(data?.createdOn).format('DD MMM, YYYY')}
                  </Text>
                  <View style={[globalStyles.flexrow, { marginLeft: 15 }]}>
                    <Ionicons
                      name="cloud-outline"
                      color={'#7C766F'}
                      size={15}
                    />
                    <Text
                      style={[
                        globalStyles.text,
                        { color: '#7C766F', marginLeft: 5 },
                      ]}
                    >
                      {moment(data?.lastAttemptedOn).format('DD MMM, YYYY')}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <></>
            )}
          </View>
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
                <Text
                  style={[
                    globalStyles.subHeading,
                    { color: '#7C766F', marginLeft: 10 },
                  ]}
                >
                  {t('sync_pending')}
                </Text>
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
          {!data?.lastAttemptedOn && downloadStatus == 'progress' ? (
            <ActivityIndicator size="large" />
          ) : !data?.lastAttemptedOn && downloadStatus == 'completed' ? (
            <TouchableOpacity>
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
      </TouchableOpacity>
      <NetworkAlert
        onTryAgain={handleDownload}
        isConnected={networkstatus}
        closeModal={() => {
          setNetworkstatus(!networkstatus);
        }}
      />
    </SafeAreaView>
  );
};

SubjectBox.propTypes = {
  name: PropTypes.string,
  data: PropTypes.any,
  disabled: PropTypes.bool,
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D0C5B4',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'white',
    padding: 5,
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
});

export default SubjectBox;
