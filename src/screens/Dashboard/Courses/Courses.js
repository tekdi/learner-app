import React, { useCallback, useState, useEffect, useRef } from 'react';
import { CopilotStep, walkthroughable } from 'react-native-copilot';

import {
  BackHandler,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigationState } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';

import { useTranslation } from '../../../context/LanguageContext';
import wave from '../../../assets/images/png/wave.png';
import CoursesBox from '../../../components/CoursesBox/CoursesBox';
import SecondaryHeader from '../../../components/Layout/SecondaryHeader';
import ContinueLearning from '../../../components/ContinueLearning/ContinueLearning';
import {
  courseListApi_New,
  enrollInterest,
  filterContent,
} from '../../../utils/API/AuthService';
import SyncCard from '../../../components/SyncComponent/SyncCard';
import BackButtonHandler from '../../../components/BackNavigation/BackButtonHandler';
import FilterModal from '@components/FilterModal/FilterModal';
import FilterList from '@components/FilterModal/FilterList';
import FilterDrawer from '@components/FilterModal/FilterDrawer';
import {
  capitalizeName,
  getDataFromStorage,
  logEventFunction,
  setDataInStorage,
} from '../../../utils/JsHelper/Helper';
import { courseTrackingStatus } from '../../../utils/API/ApiCalls';
import ActiveLoading from '../../LoadingScreen/ActiveLoading';
import CustomSearchBox from '../../../components/CustomSearchBox/CustomSearchBox';
import globalStyles from '../../../utils/Helper/Style';

import GlobalText from '@components/GlobalText/GlobalText';
import AppUpdatePopup from '../../../components/AppUpdate/AppUpdatePopup';
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton';
import InterestModal from './InterestModal';
import InterestTopicModal from './InterestTopicModal';
import {
  restoreScrollPosition,
  storeScrollPosition,
} from '../../../utils/Helper/JSHelper';
import { useInternet } from '../../../context/NetworkContext';

const CopilotView = walkthroughable(View); // Wrap Text to make it interactable

const Courses = () => {
  // const navigation = useNavigation();
  const { t } = useTranslation();
  const { isConnected } = useInternet();

  const [courseData, setCourseData] = useState([]);
  const [trackData, setTrackData] = useState([]);
  const [userInfo, setUserInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [youthnet, setYouthnet] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [userId, setUserId] = useState('');
  const [parentFormData, setParentFormData] = useState([]);
  const [parentStaticFormData, setParentStaticFormData] = useState([]);
  const [orginalFormData, setOrginalFormData] = useState([]);
  const [instant, setInstant] = useState([]);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const scrollViewRef = useRef(null);
  // const [scrollPosition, setScrollPosition] = useState(0);
  const [restoreScroll, setRestoreScroll] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [interestModal, setInterestModal] = useState(false);
  const [isTopicModal, setIsTopicModal] = useState(false);
  const [interestContent, setInterestContent] = useState(false);
  const [topicList, setTopicList] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to store the scroll position

  // Save scroll position when user scrolls
  const handleScroll = (event) => {
    const position = event.nativeEvent.contentOffset.y;
    const page = 'courses';
    storeScrollPosition(position, page);
  };

  // Restore scroll position only when coming back
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      if (restoreScroll) {
        const page = 'courses';
        restoreScrollPosition(scrollViewRef, page);
      }

      setRestoreScroll(true);
      setLoading(false);
    }, [restoreScroll])
  );
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData(0, false); // Reset course data
      fetchInterestStatus();
      setLoading(false);
    }, [])
  );

  const fetchInterestStatus = async () => {
    let user_Id = await getDataFromStorage('userId');
    const data = (await getDataFromStorage(`Enrolled_to_l2${user_Id}`)) || '';
    if (data === 'yes') {
      setInterestContent(false);
    }
  };

  const routeName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  useEffect(() => {
    const fetch = async () => {
      // const cohort_id = await getDataFromStorage('cohortId');
      let userType = await getDataFromStorage('userType');

      let isYouthnet = userType == 'youthnet' ? true : false;
      setYouthnet(isYouthnet);
      let userId = await getDataFromStorage('userId');
      setUserId(userId);
      const instant =
        userType === 'youthnet'
          ? { frameworkId: 'youthnet-framework', channelId: 'youthnet-channel' }
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
        if (routeName === 'Courses') {
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
      // const newOffset = offset; // Increase offset by 5
      // console.log('newOffset', newOffset);

      // setOffset(newOffset); // Update state
      // fetchData(newOffset, false); // Append new data
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []) // Make sure to include the dependencies
  );

  const fetchTopics = async () => {
    console.log('hi');

    const instantId = `youthnet-framework`;
    const data = await filterContent({ instantId });
    const newData = data?.framework?.categories?.filter((item) => {
      return item?.code === 'stream';
    });

    setTopicList(newData);
  };

  // console.log('offset', offset);

  const fetchData = async (offset, append = false) => {
    setLoading(true);
    fetchTopics();
    const mergedFilter = { ...parentFormData, ...parentStaticFormData };
    let userType = await getDataFromStorage('userType');

    const instant =
      userType === 'youthnet'
        ? { frameworkId: 'youthnet-framework', channelId: 'youthnet-channel' }
        : userType === 'scp'
          ? { frameworkId: 'scp-framework', channelId: 'scp-channel' }
          : { frameworkId: 'pos-framework', channelId: 'pos-channel' };

    let data = await courseListApi_New({
      searchText,
      mergedFilter,
      instant,
      offset,
    });

    try {
      const contentList = data?.content || [];
      let courseList = contentList.map((item) => item?.identifier);

      let userId = await getDataFromStorage('userId');
      let course_track_data = await courseTrackingStatus(userId, courseList);

      let courseTrackData = [];
      if (course_track_data?.data) {
        courseTrackData =
          course_track_data?.data.find((course) => course.userId === userId)
            ?.course || [];
      }
      // setTrackData(courseTrackData);
      setTrackData((prevData) =>
        append
          ? [...prevData, ...(courseTrackData || [])]
          : courseTrackData || []
      );
      updateInterestStatus(courseTrackData);
    } catch (e) {
      console.log('Error:', e);
    }

    const result = JSON.parse(await getDataFromStorage('profileData'));
    // console.log('result', JSON.stringify(result));

    setUserInfo(result?.getUserDetails);
    setCount(data?.count);
    // Append new data only if handleViewMore is triggered
    setCourseData((prevData) =>
      append ? [...prevData, ...(data?.content || [])] : data?.content || []
    );

    setLoading(false);
  };

  async function updateInterestStatus(trackData) {
    let user_Id = await getDataFromStorage('userId');

    const isInterested = trackData.some((course) => course.completed);
    const data = (await getDataFromStorage(`Enrolled_to_l2${user_Id}`)) || '';
    // console.log('data==>', data);

    if (data === 'yes') {
      setInterestContent(false);
    } else if (isInterested && data !== 'yes') {
      setInterestContent(true);
    }
  }

  // console.log('intereest', interestContent);

  useEffect(() => {
    fetchData(0, false);
  }, [parentFormData, parentStaticFormData]);

  const handleSearch = async () => {
    setOffset(0); // Reset offset when searching
    await fetchData(0, false); // Reset course data
  };

  const handleViewMore = () => {
    // console.log('offset', offset);

    const newOffset = offset + 10; // Increase offset by 5
    setOffset(newOffset); // Update state
    fetchData(newOffset, true); // Append new data
    const page = 'courses';
    restoreScrollPosition(scrollViewRef, page);
  };

  // Refresh the component.
  const handleRefresh = async () => {
    setLoading(true); // Start Refresh Indicator

    try {
      setRefreshKey((prevKey) => prevKey + 1);
      setOffset(0);
      fetchData(0, false); // Reset course data
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop Refresh Indicator
    }
  };

  const handleInterest = async (selectedIds) => {
    setLoading(true);
    const data = await enrollInterest(selectedIds);
    if (data?.params?.status === 'successful') {
      setIsTopicModal(false);
      setInterestModal(true);
      setInterestContent(false);
      await setDataInStorage(`Enrolled_to_l2${userId}`, 'yes');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView
      key={refreshKey}
      style={{ flex: 1, backgroundColor: 'white' }}
    >
      <SecondaryHeader logo />
      <AppUpdatePopup />
      <ScrollView
        nestedScrollEnabled
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.view}>
          {loading ? (
            <ActiveLoading />
          ) : (
            <>
              <View style={styles.view2}>
                <Image source={wave} resizeMode="contain" />
                <GlobalText style={globalStyles.h6}>
                  {t('welcome')},{' '}
                  {capitalizeName(
                    `${userInfo?.[0]?.firstName} ${userInfo?.[0]?.lastName}!`
                  )}
                </GlobalText>
              </View>
              {/* {!youthnet && (
                <GlobalText style={globalStyles.text}>
                  {t('courses')}
                </GlobalText>
              )} */}
              <ContinueLearning youthnet={youthnet} t={t} userId={userId} />
              {youthnet && interestContent && (
                <View>
                  <GlobalText
                    style={[
                      globalStyles.h4,
                      { color: '#78590C', marginTop: 5 },
                    ]}
                  >
                    {youthnet && t('l2_courses')}
                  </GlobalText>
                  <View
                    style={{
                      borderRadius: 20,
                      padding: 20,
                      backgroundColor: '#F3EDF7',
                      marginTop: 10,
                    }}
                  >
                    <GlobalText
                      style={[globalStyles.text, { color: '#1F1B13' }]}
                    >
                      {t(
                        'you_can_boost_your_skills_and_unlock_new_job_opportunities_with_our_L2_course'
                      )}
                    </GlobalText>
                    <View style={{ width: 180, marginVertical: 10 }}>
                      <PrimaryButton
                        onPress={() => {
                          setIsTopicModal(true);
                        }}
                        text={t('Im_interested')}
                      />
                    </View>

                    <GlobalText
                      style={[globalStyles.text, { color: '#635E57' }]}
                    >
                      {t(
                        'show_interest_to_receive_personalized_guidance_from_our_expert'
                      )}
                    </GlobalText>
                  </View>
                </View>
              )}
              <GlobalText
                style={[globalStyles.h4, { color: '#78590C', top: 10 }]}
              >
                {youthnet && t('l1_courses')}
              </GlobalText>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CopilotStep
                  text="You can search courses from here"
                  order={6}
                  name="start"
                >
                  <CopilotView style={{ width: '70%' }}>
                    <View>
                      <CustomSearchBox
                        setSearchText={setSearchText}
                        searchText={searchText}
                        handleSearch={handleSearch}
                        placeholder={t('Search...')}
                      />
                    </View>
                  </CopilotView>
                </CopilotStep>

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
                    setIsDrawerOpen(true);
                  }}
                >
                  <GlobalText style={globalStyles.text}>
                    {t('filter')}
                  </GlobalText>
                  <Icon
                    name={'caretdown'}
                    size={10}
                    color="#000"
                    // style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              </View>

              <SyncCard doneSync={fetchData} />
              <CopilotStep
                text="You can explore courses from here!"
                order={7}
                name="end"
              >
                <CopilotView style={{ width: '100%' }}>
                  <View>
                    {courseData.length > 0 ? (
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
                        ContentData={courseData}
                        TrackData={trackData}
                        isHorizontal={false}
                      />
                    ) : (
                      <GlobalText style={globalStyles.heading2}>
                        {t('no_data_found')}
                      </GlobalText>
                    )}
                  </View>
                </CopilotView>
              </CopilotStep>
              {courseData.length !== count && courseData.length > 0 && (
                <View>
                  <PrimaryButton
                    onPress={handleViewMore}
                    text={t('viewmore')}
                  />
                </View>
              )}
            </>
          )}
          {showExitModal && (
            <BackButtonHandler
              exitRoute={true} // You can pass any props needed by the modal here
              onCancel={handleCancel}
              onExit={handleExitApp}
            />
          )}
          <InterestModal
            setIsModal={setInterestModal}
            isModal={interestModal}
          />
          <InterestTopicModal
            setIsTopicModal={setIsTopicModal}
            isTopicModal={isTopicModal}
            topicList={topicList}
            handleInterest={handleInterest}
          />
        </View>
      </ScrollView>
      {/* {isModal && (
        <FilterModal
          isModal={isModal}
          setIsModal={setIsModal}
          setParentFormData={setParentFormData}
          setParentStaticFormData={setParentStaticFormData}
          parentFormData={parentFormData}
          parentStaticFormData={parentStaticFormData}
          setOrginalFormData={setOrginalFormData}
          orginalFormData={orginalFormData}
          instant={instant}
        />
      )} */}

      {isDrawerOpen && (
        <FilterDrawer
          isVisible={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        >
          <FilterList
            isModal={isModal}
            setIsModal={setIsModal}
            setParentFormData={setParentFormData}
            setParentStaticFormData={setParentStaticFormData}
            parentFormData={parentFormData}
            parentStaticFormData={parentStaticFormData}
            setOrginalFormData={setOrginalFormData}
            orginalFormData={orginalFormData}
            instant={instant}
            setIsDrawerOpen={setIsDrawerOpen}
          />
        </FilterDrawer>
      )}
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

export default Courses;
