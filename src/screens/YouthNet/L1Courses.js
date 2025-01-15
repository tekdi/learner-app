import React, { useCallback, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import { useTranslation } from '@context/LanguageContext';
import wave from '@src/assets/images/png/wave.png';
import CoursesBox from '@src/components/CoursesBox/CoursesBox';
import SecondaryHeader from '@src/components/Layout/SecondaryHeader';
import ContinueLearning from '@src/components/ContinueLearning/ContinueLearning';
import {
  courseListApi_testing,
  getAccessToken,
} from '@src/utils/API/AuthService';
import SyncCard from '@src/components/SyncComponent/SyncCard';
import BackButtonHandler from '@src/components/BackNavigation/BackButtonHandler';
import {
  capitalizeName,
  getDataFromStorage,
  getTentantId,
  logEventFunction,
} from '@src/utils/JsHelper/Helper';
import { courseTrackingStatus } from '@src/utils/API/ApiCalls';
import ActiveLoading from '@src/screens/LoadingScreen/ActiveLoading';
import CustomSearchBox from '@src/components/CustomSearchBox/CustomSearchBox';
import globalStyles from '@src/utils/Helper/Style';

import GlobalText from '@components/GlobalText/GlobalText';
import AppUpdatePopup from '@src/components/AppUpdate/AppUpdatePopup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Linking } from 'react-native';

const L1Courses = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [trackData, setTrackData] = useState([]);
  const [userInfo, setUserInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [youthnet, setYouthnet] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [userId, setUserId] = useState('');

  const routeName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  useEffect(() => {
    const fetch = async () => {
      const cohort_id = await getDataFromStorage('cohortId');
      console.log({ cohort_id });
      let userType = await getDataFromStorage('userType');
      console.log('################## userType', userType);
      let isYouthnet = userType == 'youthnet' ? true : false;
      setYouthnet(isYouthnet);
      let userId = await getDataFromStorage('userId');
      setUserId(userId);
    };
    fetch();
  }, []);

  useEffect(() => {
    const logEvent = async () => {
      const obj = {
        eventName: 'course_page_view',
        method: 'on-view',
        screenName: 'Courses',
      };

      await logEventFunction(obj);
    };
    logEvent();
  }, [userInfo]);

  useFocusEffect(
    useCallback(() => {
      setSearchText('');
      const onBackPress = () => {
        if (routeName === 'youthNetHome') {
          setShowExitModal(true);
          return true; // Prevent default back behavior
        }
        return false; // Allow default back behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [routeName])
  );

  const handleExitApp = () => {
    setShowExitModal(false);
    BackHandler.exitApp(); // Exit the app
  };

  const handleCancel = () => {
    setShowExitModal(false); // Close the modal
  };

  const handlePress = () => {
    navigation.navigate('Preference');
  };

  useFocusEffect(
    useCallback(() => {
      // console.log('########## in focus course');
      const onBackPress = () => {
        if (routeName === 'Courses') {
          setShowExitModal(true);
          return true; // Prevent default back behavior
        }
        return false; // Allow default back behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      fetchData();

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []) // Make sure to include the dependencies
  );

  const fetchData = async () => {
    //setSearchText('');
    setLoading(true);
    let data = await courseListApi_testing({ searchText });

    //found course progress
    try {
      // console.log('########## contentListApi');
      const contentList = data?.content;
      //console.log('########## contentList', contentList);
      let courseList = [];
      if (contentList) {
        for (let i = 0; i < contentList.length; i++) {
          courseList.push(contentList[i]?.identifier);
        }
      }
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
    } catch (e) {
      console.log('e', e);
    }
    const result = JSON.parse(await getDataFromStorage('profileData'));
    setUserInfo(result?.getUserDetails);
    setData(data?.content || []);
    setLoading(false);
  };

  const handleSearch = async () => {
    await fetchData();
  };

  const callPhone = (number) => {
    Linking.openURL(`tel:${number}`); // Opens the phone dialer
  };
  const sendEmail = (email) => {
    Linking.openURL(`mailto:${email}`); // Opens the email client
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <SecondaryHeader logo />
      <AppUpdatePopup />
      <ScrollView nestedScrollEnabled>
        <View>
          {loading ? (
            <ActiveLoading />
          ) : (
            <SafeAreaView>
              <View style={styles.view}>
                <StatusBar
                  barStyle="dark-content"
                  // translucent={true}
                  backgroundColor="transparent"
                />
                <View style={styles.view2}>
                  <Image source={wave} resizeMode="contain" />
                  <GlobalText style={styles.text2}>
                    {t('welcome')}, {capitalizeName(userInfo?.[0]?.name)} !
                  </GlobalText>
                </View>
                <GlobalText
                  style={[globalStyles.heading2, { color: '#78590C' }]}
                >
                  {youthnet ? t('get_started_with_l1_courses') : t('courses')}
                </GlobalText>
                <ContinueLearning youthnet={youthnet} t={t} userId={userId} />
                <CustomSearchBox
                  setSearchText={setSearchText}
                  searchText={searchText}
                  handleSearch={handleSearch}
                  placeholder={t('Search Courses')}
                />

                <SyncCard doneSync={fetchData} />
                {data.length > 0 ? (
                  <>
                    <CoursesBox
                      title={'Continue_Learning'}
                      description={'Digital Skill Building'}
                      style={{ titlecolor: '#06A816' }}
                      viewAllLink={() =>
                        navigation.navigate('ViewAll', {
                          title: 'Continue_Learning',
                          data: data,
                        })
                      }
                      ContentData={data}
                      TrackData={trackData}
                      isHorizontal={true}
                    />
                    <CoursesBox
                      description={'Health Awareness'}
                      style={{ titlecolor: '#06A816' }}
                      viewAllLink={() =>
                        navigation.navigate('ViewAll', {
                          title: 'Continue_Learning',
                          data: data,
                        })
                      }
                      ContentData={data}
                      TrackData={trackData}
                      isHorizontal={true}
                    />
                  </>
                ) : (
                  <GlobalText style={globalStyles.heading2}>
                    {t('no_data_found')}
                  </GlobalText>
                )}
              </View>
              <View style={{ backgroundColor: '#FFF8F2', padding: 25 }}>
                <GlobalText
                  style={[globalStyles.subHeading, { fontWeight: 700 }]}
                >
                  {t('need_help_reach_out_to_your_mentor')}
                </GlobalText>
                <GlobalText style={[globalStyles.text, { marginVertical: 5 }]}>
                  {t(
                    'if_you_stuck_or_need_guidance_your_mentor_is_just_a_message_away'
                  )}
                </GlobalText>
                <View style={[globalStyles.flexrow, { marginVertical: 10 }]}>
                  <Icon name={'phone-outline'} size={20} color={'#7C766F'} />
                  <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => callPhone(`8888101624`)}
                  >
                    <GlobalText
                      style={[globalStyles.text, { color: '#0D599E' }]}
                    >
                      8888101624
                    </GlobalText>
                  </TouchableOpacity>
                </View>
                <View style={[globalStyles.flexrow]}>
                  <Icon name={'email-outline'} size={20} color={'#7C766F'} />
                  <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => sendEmail(`mentor_email@mail.com`)}
                  >
                    <GlobalText
                      style={[globalStyles.text, { color: '#0D599E' }]}
                    >
                      mentor_email@mail.com
                    </GlobalText>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          )}
          {showExitModal && (
            <BackButtonHandler
              exitRoute={true} // You can pass any props needed by the modal here
              onCancel={handleCancel}
              onExit={handleExitApp}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    width: '100%',
    //backgroundColor: 'white',
    padding: 15,
    // borderWidth: 1,
  },
  view2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  image: {
    height: 30,
    width: 20,
  },
  text: { fontSize: 26, color: 'black', fontWeight: '500' },
  text2: {
    fontSize: 14,
    color: 'black',
    marginLeft: 10,
    fontWeight: '500',
  },
});

export default L1Courses;
