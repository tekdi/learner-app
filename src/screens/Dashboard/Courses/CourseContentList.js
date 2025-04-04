import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import TextField from '../../../components/TextField/TextField';
import {
  courseDetails,
  courseTrackingStatus,
} from '../../../utils/API/ApiCalls';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../../utils/Helper/Style';
import SecondaryHeader from '../../../components/Layout/SecondaryHeader';
import FastImage from '@changwoolab/react-native-fast-image';
import UnitCard from './UnitCard';
import moment from 'moment';
import {
  getDataFromStorage,
  translateDate,
  translateDigits,
  logEventFunction,
} from '../../../utils/JsHelper/Helper';
import {
  courseEnroll,
  CourseEnrollStatus,
  getSyncTrackingOfflineCourse,
  issueCertificate,
  updateCourseStatus,
  viewCertificate,
} from '../../../utils/API/AuthService';
import CircularProgressBarCustom from '../../../components/CircularProgressBarCustom.js/CircularProgressBarCustom';
import StatusCardCourse from '../../../components/StatusCard/StatusCardCourse';
import { useTranslation } from '../../../context/LanguageContext';
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton';
import CertificateViewer from '../../CertificateViewer/CertificateViewer';
import GlobalText from '@components/GlobalText/GlobalText';
import { getFormattedDate } from '@src/utils/Helper/JSHelper';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Accordion3 from '@components/Accordion/Accordion3';
import Icon from 'react-native-vector-icons/Ionicons';
import SecondaryButton from '@components/SecondaryButton/SecondaryButton';
import NetworkAlert from '../../../components/NetworkError/NetworkAlert';
import { useInternet } from '../../../context/NetworkContext';

const CourseContentList = ({ route }) => {
  const { language, t } = useTranslation();
  const { do_id, course_id, content_list_node } = route.params;
  // console.log('########## CourseContentList');
  // console.log('course_id', course_id);
  // console.log('##########');
  const navigation = useNavigation();
  const [coursesContent, setCoursesContent] = useState();
  const [identifiers, setIdentifiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollStatus, setEnrollStatus] = useState(false); // State to track which item is expanded
  const [visible, setVisible] = useState(false); // State to track which item is expanded
  const [certificateId, setCertificateId] = useState(null); // State to track which item is expanded
  const [certificateModal, setCertificateModal] = useState(false); // State to track which item is expanded
  const [certificateHtml, setCertificateHtml] = useState(null); // State to track which item is expanded
  const [isModal, setIsModal] = useState(false); // State to track which item is expanded

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []) // Make sure to include the dependencies
  );

  useEffect(() => {
    const logEvent = async () => {
      const obj = {
        eventName: 'course_content_view',
        method: 'on-view',
        screenName: 'Course-content-list',
      };
      await logEventFunction(obj);
    };
    logEvent();
    fetchEnrollStatus();
  }, []);

  const fetchEnrollStatus = async () => {
    setLoading(true);
    setEnrollStatus(true);
    const data = await CourseEnrollStatus({ course_id });
    console.log('data', data);

    if (data?.params?.status === 'successful') {
      setEnrollStatus(true);
      if (data?.result?.certificateId) {
        setCertificateId(data?.result?.certificateId);
      }
    } else {
      setEnrollStatus(false);
    }
    setLoading(false);
  };

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

  const fetchData = async () => {
    setLoading(true);
    // const content_do_id = 'do_1141503830938746881180';
    // const content_do_id = 'do_11415396442603520013';
    const content_do_id = do_id;
    // Fetch course details
    const data = await courseDetails(content_do_id);
    // Set courses
    const coursescontent = data?.result?.content;

    // console.log('########## coursescontent');
    // console.log('coursescontent', JSON.stringify(coursescontent));
    // console.log('##########');

    const coursesData = data?.result?.content?.children;
    setCoursesContent(coursescontent);

    // Extract identifiers
    const identifiers_Id = coursesData?.map((course) => course?.identifier);
    setIdentifiers(identifiers_Id);

    setLoading(false);

    // console.log('############ in focus');
    setLoading(true);
    fetchDataTrack();
  };

  //set progress and start date
  const { isConnected } = useInternet();
  const [trackData, setTrackData] = useState([]);
  const [trackCompleted, setTrackCompleted] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);
  const [startedOn, setStartedOn] = useState('');
  const [networkstatus, setNetworkstatus] = useState(true);
  console.log('isConnected', isConnected);

  const fetchDataTrack = async () => {
    //found course progress
    try {
      // console.log('########## contentListApi');
      //console.log('########## contentList', contentList);
      let courseList = [course_id];
      //console.log('########## courseList', courseList);
      //get course track data
      let userId = await getDataFromStorage('userId');
      let course_track_data = await courseTrackingStatus(userId, courseList);
      //console.log('########## course_track_data', course_track_data?.data);
      let courseTrackData = [];
      if (course_track_data?.data) {
        courseTrackData =
          course_track_data?.data.find((course) => course.userId === userId)
            ?.course || [];
      }
      setTrackData(courseTrackData);
      // console.log('########## courseTrackData', courseTrackData);
      // console.log('##########');
      setLoading(false); // Ensure to stop loading when data fetch completes
    } catch (e) {
      // console.log('e', e);
      setLoading(false); // Stop loading even on error
    }
  };

  useEffect(() => {
    const fetchTrackData = async () => {
      if (trackData && trackData.length > 0) {
        for (let i = 0; i < trackData.length; i++) {
          if (trackData[i]?.courseId == course_id) {
            let userId = await getDataFromStorage('userId');
            let offlineTrack = await getSyncTrackingOfflineCourse(
              userId,
              trackData[i].courseId
            );
            let offline_in_progress = [];
            let offline_completed = [];
            let lastAccessOn = '';
            // console.log(
            //   '############ offlineTrack',
            //   JSON.stringify(offlineTrack)
            // );
            if (offlineTrack) {
              for (let jj = 0; jj < offlineTrack.length; jj++) {
                let offlineTrackItem = offlineTrack[jj];
                let content_id = offlineTrackItem?.content_id;
                lastAccessOn = offlineTrack[0]?.lastAccessOn;
                //console.log('############ lastAccessOn', lastAccessOn);
                try {
                  let detailsObject = JSON.parse(
                    offlineTrackItem?.detailsObject
                  );
                  let status = 'no_started';
                  for (let k = 0; k < detailsObject.length; k++) {
                    let eid = detailsObject[k]?.eid;
                    if (eid == 'START' || eid == 'INTERACT') {
                      status = 'in_progress';
                    }
                    if (eid == 'END') {
                      status = 'completed';
                    }
                    // console.log(
                    //   '##### detailsObject length',
                    //   detailsObject[k]?.eid
                    // );
                  }
                  if (status == 'in_progress') {
                    offline_in_progress.push(content_id);
                  }
                  if (status == 'completed') {
                    offline_completed.push(content_id);
                  }
                } catch (e) {
                  console.log('e', e);
                }
              }
            }
            // console.log(
            //   '############ offline_in_progress',
            //   offline_in_progress
            // );
            // console.log('############ offline_completed', offline_completed);
            if (trackData[i]?.started_on) {
              let temp_startedOn = trackData[i].started_on;
              const formattedDate =
                moment(temp_startedOn).format('DD MMM YYYY');
              setStartedOn(formattedDate);
              // console.log('########### formattedDate', formattedDate);
            } else if (lastAccessOn !== '') {
              //get offlien time
              let temp_startedOn = lastAccessOn;
              const formattedDate =
                moment(temp_startedOn).format('DD MMM YYYY');
              setStartedOn(formattedDate);
              // console.log('########### formattedDate', formattedDate);
            }

            //merge offlien and online
            const mergedArray = [
              ...trackData[i]?.completed_list,
              ...offline_completed,
            ];
            const uniqueArray = [...new Set(mergedArray)];
            let completed_list = uniqueArray;

            //merge offlien and online
            const mergedArray_progress = [
              ...trackData[i]?.in_progress_list,
              ...offline_in_progress,
            ];
            const uniqueArray_progress = [...new Set(mergedArray_progress)];
            let in_progress_list = uniqueArray_progress;

            //get unique completed content list
            let completed = completed_list.length;
            let totalContent = 0;
            if (content_list_node) {
              totalContent = content_list_node.length;
            }
            let percentageCompleted = (completed / totalContent) * 100;
            percentageCompleted = Math.round(percentageCompleted);
            // console.log('########### completed', completed);
            // console.log('########### leafNodes', totalContent);
            // console.log('########### content_list_node', content_list_node);
            // console.log('########### percentageCompleted', percentageCompleted);
            setTrackCompleted(percentageCompleted);

            //get unique in progress content list
            let in_progress = in_progress_list.length;
            let percentageInProgress = (in_progress / totalContent) * 100;
            percentageInProgress = Math.round(percentageInProgress);
            setTrackProgress(percentageInProgress);
          }
        }
      }
    };
    fetchTrackData();
  }, [trackData]);

  const handleEnroll = async () => {
    if (!isConnected) {
      setNetworkstatus(false);
    }
    const data = await courseEnroll({ course_id });
    if (data?.params?.status === 'successful') {
      setIsModal(true);
      setEnrollStatus(true);
    }
  };

  const updateCourseStatusFun = async () => {
    const data = await updateCourseStatus({ course_id });
    // console.log('data', JSON.stringify(data));
    const result = JSON.parse(await getDataFromStorage('profileData'));
    const userDetails = result?.getUserDetails?.[0];
    let userId = await getDataFromStorage('userId');
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    const payload = {
      issuanceDate: getFormattedDate(today), // Today's date in ISO format
      expirationDate: getFormattedDate(nextYear), // Today's date + 1 year in ISO format
      firstName: userDetails?.firstName,
      middleName: userDetails?.middleName || '',
      lastName: userDetails?.lastName,
      userId: userId,
      courseId: course_id,
      courseName: coursesContent?.name,
    };
    const certificate = await issueCertificate({ payload });
    // console.log(
    //   'certificate',
    //   JSON.stringify(certificate?.result?.credential?.id)
    // );
    setCertificateId(certificate?.result?.credential?.id);
    setCertificateModal(true);
  };

  useEffect(() => {
    setLoading(true);

    if (trackCompleted >= 100) {
      // console.log('completed====>');
      if (!certificateId) {
        updateCourseStatusFun();
      }
    }
    setLoading(false);
  }, [trackCompleted]);

  const handleViewCertificate = async () => {
    const data = await viewCertificate({ certificateId });
    // console.log('data', JSON.stringify(data?.result));
    setCertificateHtml(data?.result);
    setVisible(true);
  };

  // console.log('coursesContent',  JSON.stringify(coursesContent?.children));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SecondaryHeader />
      {loading ? (
        <ActivityIndicator style={{ top: 300 }} />
      ) : (
        <>
          {coursesContent ? (
            <ScrollView>
              <View style={{ padding: 20, paddingBottom: 10 }}>
                <View style={[globalStyles.flexrow]}>
                  <FastImage
                    style={styles.image}
                    source={
                      coursesContent?.posterImage
                        ? {
                            uri: coursesContent?.posterImage,
                            priority: FastImage.priority.high,
                          }
                        : require('../../../assets/images/png/Course.png')
                    }
                    resizeMode={FastImage.resizeMode.contain} // Adjust to cover the circular area
                  />
                  <GlobalText
                    style={[globalStyles.heading2, { flex: 1 }]}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {coursesContent?.name}
                  </GlobalText>
                </View>
                <View style={globalStyles.flexrow}>
                  <GlobalText
                    style={[globalStyles.subHeading, { marginVertical: 10 }]}
                  >
                    {coursesContent?.description}
                  </GlobalText>
                </View>
                <View style={globalStyles.flexrow}>
                  <GlobalText
                    style={[globalStyles.heading2, { fontWeight: 'bold' }]}
                  >
                    {t('what_you_learn')}
                  </GlobalText>
                </View>
                <View>
                  {coursesContent?.children?.map((item, i) => {
                    return (
                      <Accordion3
                        key={i}
                        index={i}
                        openDropDown={true}
                        title={item?.name}
                        description={item?.description}
                      />
                    );
                  })}
                </View>
              </View>

              {!enrollStatus ? (
                <View style={{ width: '90%', alignSelf: 'center' }}>
                  <PrimaryButton
                    onPress={handleEnroll}
                    text={t('enroll_now')}
                  />
                </View>
              ) : (
                certificateId && (
                  <View style={{ width: '90%', alignSelf: 'center' }}>
                    <PrimaryButton
                      onPress={handleViewCertificate}
                      text={t('view_certificate')}
                    />
                  </View>
                )
              )}
              {enrollStatus && (
                <>
                  <View
                    style={[
                      globalStyles.flexrow,
                      {
                        justifyContent: 'space-between',
                        backgroundColor: '#3B383E',
                        paddingHorizontal: 25,
                        paddingVertical: 10,
                        borderRadius: 20,
                        width: '90%',
                        alignSelf: 'center',
                      },
                    ]}
                  >
                    {trackCompleted != 0 || trackProgress != 0 ? (
                      <View style={[globalStyles.flexrow]}>
                        <TextField
                          style={[
                            globalStyles.text,
                            { fontSize: 12, color: 'white' },
                          ]}
                          text={'started_on'}
                        />
                        <TextField
                          style={[
                            globalStyles.text,
                            { fontSize: 12, color: 'white' },
                          ]}
                          text={`${translateDate(startedOn, language)}`}
                        />
                      </View>
                    ) : (
                      <></>
                    )}
                    <View
                      style={[
                        globalStyles.flexrow,
                        { flex: 1, justifyContent: 'flex-end' },
                      ]}
                    >
                      {trackCompleted < 100 && trackCompleted > 0 ? (
                        <>
                          <CircularProgressBarCustom
                            size={30}
                            strokeWidth={5}
                            progress={trackCompleted / 100}
                            color="green"
                            backgroundColor="#e6e6e6"
                            textStyle={{ fontSize: 8, color: 'white' }}
                          />
                          <GlobalText
                            style={{ marginLeft: 10, color: 'white' }}
                          >{`${translateDigits(
                            Math.round((trackCompleted / 100) * 100),
                            language
                          )}%`}</GlobalText>
                          <TextField
                            style={[
                              globalStyles.text,
                              { fontSize: 12, color: 'white' },
                            ]}
                            text={'completed'}
                          />
                        </>
                      ) : (
                        <StatusCardCourse
                          status={
                            trackCompleted >= 100
                              ? 'completed'
                              : trackCompleted > 0
                                ? 'inprogress'
                                : trackProgress > 0
                                  ? 'progress'
                                  : 'not_started'
                          }
                          trackCompleted={trackCompleted}
                          viewStyle={{
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                          }}
                        />
                      )}
                    </View>
                  </View>
                  <View
                    style={{
                      padding: 20,
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      minHeight: 300,
                      // borderWidth: 1,
                    }}
                  >
                    {coursesContent?.children?.map((item) => {
                      return (
                        <UnitCard
                          key={item?.name}
                          item={item}
                          headingName={coursesContent?.name}
                          course_id={course_id}
                          unit_id={item?.identifier}
                          TrackData={trackData}
                        />
                      );
                    })}
                  </View>
                </>
              )}
              <CertificateViewer
                visible={visible}
                setVisible={setVisible}
                certificateHtml={certificateHtml}
                certificateId={certificateId}
                certificateName={coursesContent?.name}
              />

              <Modal visible={isModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer} activeOpacity={1}>
                  <View style={styles.alertBox}>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderColor: '#D0C5B4',
                        marginVertical: 20,
                        width: '100%',
                      }}
                    >
                      <View style={{ alignItems: 'center', marginLeft: 20 }}>
                        <FastImage
                          style={styles.image}
                          // eslint-disable-next-line no-undef
                          source={require('../../../assets/images/gif/party.gif')}
                          resizeMode={FastImage.resizeMode.contain}
                          priority={FastImage.priority.high} // Set the priority here
                        />
                      </View>
                      <View style={{ paddingVertical: 10 }}>
                        <GlobalText
                          style={[
                            globalStyles.subHeading,
                            { textAlign: 'center' },
                          ]}
                        >
                          {t('good_luck')}
                        </GlobalText>
                        <GlobalText
                          style={[
                            globalStyles.subHeading,
                            { textAlign: 'center' },
                          ]}
                        >
                          {t('you_are_now_enrolled_to_the_course')}
                        </GlobalText>
                      </View>
                    </View>
                    <View style={styles.btnbox}>
                      <PrimaryButton
                        text={t('close')}
                        onPress={() => {
                          setIsModal(false);
                        }}
                      />
                    </View>
                  </View>
                </View>
              </Modal>

              <Modal
                visible={certificateModal}
                transparent={true}
                animationType="slide"
              >
                <View style={styles.modalContainer} activeOpacity={1}>
                  <View style={styles.alertBox}>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderColor: '#D0C5B4',
                        marginVertical: 20,
                        width: '100%',
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setCertificateModal(false);
                        }}
                        style={{ alignSelf: 'flex-end' }}
                      >
                        <Icon name={'close'} color="#000" size={30} />
                      </TouchableOpacity>
                      <View style={{ alignItems: 'center', marginLeft: 20 }}>
                        <FastImage
                          style={styles.image}
                          // eslint-disable-next-line no-undef
                          source={require('../../../assets/images/gif/party.gif')}
                          resizeMode={FastImage.resizeMode.contain}
                          priority={FastImage.priority.high} // Set the priority here
                        />
                      </View>
                      <View
                        style={{
                          marginVertical: 20,
                          paddingVertical: 20,
                          // backgroundColor: '#FFDEA1',
                        }}
                      >
                        <GlobalText
                          style={[
                            globalStyles.subHeading,
                            { textAlign: 'center', color: '#1A8825' },
                          ]}
                        >
                          {t('congratulation')}
                        </GlobalText>
                        <GlobalText
                          style={[
                            globalStyles.heading2,
                            {
                              textAlign: 'center',
                              fontWeight: 'bold',
                              marginVertical: 10,
                            },
                          ]}
                        >
                          {t('you_have_completed_the_course')}
                        </GlobalText>
                        <GlobalText
                          style={[globalStyles.text, { textAlign: 'center' }]}
                        >
                          {t(
                            'you_can_access_the_Certificate_at_any_time_from_your_rofile'
                          )}
                        </GlobalText>
                      </View>
                    </View>
                    <View
                      style={[
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          // paddingHorizontal: 20,
                        },
                      ]}
                    >
                      <View style={{ width: 180 }}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.goBack();
                          }}
                        >
                          <GlobalText
                            style={[
                              globalStyles.text,
                              {
                                textAlign: 'center',
                                fontWeight: 'bold',
                                color: '#0D599E',
                              },
                            ]}
                          >
                            {t('view_more_courses')}
                          </GlobalText>
                        </TouchableOpacity>
                      </View>
                      <View style={{ width: 160 }}>
                        <PrimaryButton
                          text={t('view_certificate')}
                          onPress={() => {
                            setCertificateModal(false);
                            handleViewCertificate();
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
            </ScrollView>
          ) : (
            <GlobalText
              style={[
                globalStyles.text,
                {
                  fontWeight: 'bold',
                  color: '#0D599E',
                  padding: 30,
                },
              ]}
            >
              {t('sync_pending_no_internet_available')}
            </GlobalText>
          )}
        </>
      )}
      <NetworkAlert
        onTryAgain={handleEnroll}
        isConnected={networkstatus}
        closeModal={() => {
          setNetworkstatus(!networkstatus);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    borderWidth: 1,
    padding: 20,
    margin: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderColor: '#D0C5B4',
  },
  subview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#e9e8d9',
    marginVertical: 20,
  },
  cardContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 20,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    padding: 10,
  },
  btnbox: {
    width: 200,
  },
});

CourseContentList.propTypes = {
  route: PropTypes.any,
};

export default CourseContentList;
