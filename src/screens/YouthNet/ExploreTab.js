import React, { useCallback, useState, useEffect } from 'react';
import {
  BackHandler,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import { useTranslation } from '@context/LanguageContext';
import CoursesBox from '@src/components/CoursesBox/CoursesBox';
import SecondaryHeader from '@src/components/Layout/SecondaryHeader';
import { courseListApi_testing } from '@src/utils/API/AuthService';
import SyncCard from '@src/components/SyncComponent/SyncCard';
import BackButtonHandler from '@src/components/BackNavigation/BackButtonHandler';
import {
  getDataFromStorage,
  logEventFunction,
} from '@src/utils/JsHelper/Helper';
import { courseTrackingStatus } from '@src/utils/API/ApiCalls';
import ActiveLoading from '@src/screens/LoadingScreen/ActiveLoading';
import CustomSearchBox from '@src/components/CustomSearchBox/CustomSearchBox';
import globalStyles from '@src/utils/Helper/Style';
import GlobalText from '@components/GlobalText/GlobalText';
import AppUpdatePopup from '@src/components/AppUpdate/AppUpdatePopup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SkillCenterCard from './SkillCenterCard';

const ExploreTab = () => {
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

  const mydata = {
    title: 'Bhor Electrical',
    address: 'Sharmik Hall, Near By ST Stand Bhor ,Tal Bhor, Dist Pune 412206',
    images: [
      'https://jll-global-gdim-res.cloudinary.com/image/upload/c_fill,h_600,w_1200/v1505556290/IN_ML20170916/Lohia-Jain-IT-Park---Wing-A_7569_20170916_002.jpg',
      'https://www.lohiajaingroup.com/images/lohiajain-projects-bavdhan.jpg',
      'https://images.nobroker.in/img/5e973c0da5a1662dac0b3444/5e973c0da5a1662dac0b3444_68671_733194_large.jpg',
    ],
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <SecondaryHeader logo />
      <StatusBar
        barStyle="dark-content"
        // translucent={true}
        backgroundColor="transparent"
      />
      <AppUpdatePopup />
      <ScrollView nestedScrollEnabled>
        <View>
          {loading ? (
            <ActiveLoading />
          ) : (
            <SafeAreaView>
              <View style={{ padding: 15 }}>
                <View style={styles.view2}>
                  <GlobalText style={globalStyles.heading}>
                    {t('explore')}
                  </GlobalText>
                </View>
                <GlobalText style={[globalStyles.text, { marginBottom: 15 }]}>
                  {t(
                    'explore_additional_resources_and_nearby_skilling_centers'
                  )}
                </GlobalText>
                <View
                  style={[
                    globalStyles.flexrow,
                    { justifyContent: 'space-between', marginVertical: 10 },
                  ]}
                >
                  <GlobalText style={[globalStyles.text, { color: '#78590C' }]}>
                    {t('explore_additional_courses')}
                  </GlobalText>

                  <TouchableOpacity
                    style={globalStyles.flexrow}
                    onPress={() => {}}
                  >
                    <GlobalText
                      style={[styles.description, { color: '#0D599E' }]}
                    >
                      {t('view_all')}
                    </GlobalText>
                    <Icon
                      name="arrow-right"
                      style={{ marginHorizontal: 10 }}
                      color={'#0D599E'}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
                <CustomSearchBox
                  setSearchText={setSearchText}
                  searchText={searchText}
                  handleSearch={handleSearch}
                  placeholder={t('Search Courses')}
                />

                <SyncCard doneSync={fetchData} />
              </View>
              {data.length > 0 ? (
                <View
                  style={{
                    backgroundColor: '#FFF8F2',
                    padding: 15,
                    borderRadius: 10,
                  }}
                >
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
                </View>
              ) : (
                <GlobalText style={globalStyles.heading2}>
                  {t('no_data_found')}
                </GlobalText>
              )}
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
        <View style={{ padding: 15 }}>
          <View
            style={[
              globalStyles.flexrow,
              { justifyContent: 'space-between', marginVertical: 10 },
            ]}
          >
            <GlobalText style={[globalStyles.text, { color: '#78590C' }]}>
              {t('skilling_center_near_you')}
            </GlobalText>
            <TouchableOpacity
              style={[globalStyles.flexrow]}
              onPress={() => {
                navigation.navigate('SkillCenter');
              }}
            >
              <GlobalText style={[styles.description, { color: '#0D599E' }]}>
                {t('view_all')}
              </GlobalText>
              <Icon
                name="arrow-right"
                style={{ marginHorizontal: 10 }}
                color={'#0D599E'}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <SkillCenterCard data={mydata} />
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

export default ExploreTab;
