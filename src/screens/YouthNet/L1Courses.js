import React, { useCallback, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SafeAreaWrapper from '../../components/SafeAreaWrapper/SafeAreaWrapper';
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
  courseListApi_New,
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
import AntDesign from 'react-native-vector-icons/AntDesign';

import { Linking } from 'react-native';
import FilterModal from '@components/FilterModal/FilterModal';

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
  const [isModal, setIsModal] = useState(false);
  const [parentFormData, setParentFormData] = useState([]);
  const [parentStaticFormData, setParentStaticFormData] = useState([]);
  const [orginalFormData, setOrginalFormData] = useState([]);
  const [instant, setInstant] = useState([]);

  const routeName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  useEffect(() => {
    const fetch = async () => {
      const cohort_id = await getDataFromStorage('cohortId');
      const userType = await getDataFromStorage('userType');
      const isYouthnet = userType === 'youthnet';
      setYouthnet(isYouthnet);
      const userId = await getDataFromStorage('userId');
      setUserId(userId);

      const instant =
        userType === 'youthnet'
          ? { frameworkId: 'pos-framework', channelId: 'pos-channel' }
          : userType === 'scp'
          ? { frameworkId: 'scp-framework', channelId: 'scp-channel' }
          : { frameworkId: 'pos-framework', channelId: 'pos-channel' };
      setInstant(instant);
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

      // fetchData();

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []) // Make sure to include the dependencies
  );

  const fetchData = async () => {
    //setSearchText('');
    setLoading(true);
    const mergedFilter = { ...parentFormData, ...parentStaticFormData };
    console.log('mergedFilter', mergedFilter);
    let contentFilter = JSON.parse(await getDataFromStorage('contentFilter'));
    let data = await courseListApi_New({
      searchText,
      mergedFilter,
      contentFilter,
    });

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

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [parentFormData, parentStaticFormData])
  );

  return (
    <SafeAreaWrapper style={{ flex: 1, backgroundColor: 'white' }}>
      <SecondaryHeader logo />
      <AppUpdatePopup />
      <ScrollView nestedScrollEnabled>
        <View>
          {loading ? (
            <ActiveLoading />
          ) : (
            <View>
              <View style={styles.view}>
                <StatusBar
                  barStyle="dark-content"
                  // translucent={true}
                  backgroundColor="transparent"
                />
                <View style={styles.view2}>
                  <Image source={wave} resizeMode="contain" />
                  <GlobalText style={styles.text2}>
                    {t('welcome')},
                    {/* {capitalizeName(
                      `${userInfo?.[0]?.firstName} ${userInfo?.[0]?.lastName}!`
                    )} */}
                  </GlobalText>
                </View>
                <GlobalText
                  style={[globalStyles.heading2, { color: '#78590C' }]}
                >
                  {youthnet ? t('get_started_with_l1_courses') : t('courses')}
                </GlobalText>
                <ContinueLearning youthnet={youthnet} t={t} userId={userId} />
                <View style={globalStyles.flexrow}>
                  <View style={{ width: '70%' }}>
                    <CustomSearchBox
                      setSearchText={setSearchText}
                      searchText={searchText}
                      handleSearch={handleSearch}
                      placeholder={t('Search Courses')}
                    />
                  </View>
                  <TouchableOpacity
                    style={[
                      globalStyles.flexrow,
                      {
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 10,
                        width: 100,
                        justifyContent: 'space-evenly',
                        borderColor: '#DADADA',
                      },
                    ]}
                    onPress={() => {
                      setIsModal(true);
                    }}
                  >
                    <GlobalText style={globalStyles.text}>
                      {t('filter')}
                    </GlobalText>
                    <AntDesign
                      name={'caretdown'}
                      size={10}
                      color="#000"
                      // style={{ marginLeft: 10 }}
                    />
                  </TouchableOpacity>
                </View>
                <SyncCard doneSync={fetchData} />
                {data.length > 0 ? (
                  <CoursesBox
                    // title={'Continue_Learning'}
                    // description={'Food_Production'}
                    style={{ titlecolor: '#06A816' }}
                    // viewAllLink={() =>
                    //   navigation.navigate('ViewAll', {
                    //     title: 'Continue_Learning',
                    //     data: data,
                    //   }
                    // )
                    // }
                    ContentData={data}
                    TrackData={trackData}
                    isHorizontal={false}
                  />
                ) : (
                  <GlobalText style={globalStyles.heading2}>
                    {t('no_data_found')}
                  </GlobalText>
                )}
              </View>
              {/* <View style={{ backgroundColor: '#FFF8F2', padding: 25 }}>
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
              </View> */}
            </View>
          )}
          {showExitModal && (
            <BackButtonHandler
              exitRoute={true} // You can pass any props needed by the modal here
              onCancel={handleCancel}
              onExit={handleExitApp}
            />
          )}
        </View>
        {isModal && (
          <FilterModal
            isModal={isModal}
            setIsModal={setIsModal}
            setParentFormData={setParentFormData}
            parentFormData={parentFormData}
            setParentStaticFormData={setParentStaticFormData}
            parentStaticFormData={parentStaticFormData}
            setOrginalFormData={setOrginalFormData}
            orginalFormData={orginalFormData}
            instant={instant}
          />
        )}
      </ScrollView>
    </SafeAreaWrapper>
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
