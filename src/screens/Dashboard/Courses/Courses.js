import React, { useCallback, useState, useEffect } from 'react';
import { CopilotStep, walkthroughable } from 'react-native-copilot';

import {
  BackHandler,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';

import { useTranslation } from '../../../context/LanguageContext';
import wave from '../../../assets/images/png/wave.png';
import CoursesBox from '../../../components/CoursesBox/CoursesBox';
import SecondaryHeader from '../../../components/Layout/SecondaryHeader';
import ContinueLearning from '../../../components/ContinueLearning/ContinueLearning';
import { courseListApi_testing } from '../../../utils/API/AuthService';
import SyncCard from '../../../components/SyncComponent/SyncCard';
import BackButtonHandler from '../../../components/BackNavigation/BackButtonHandler';
import FilterModal from '@components/FilterModal/FilterModal';
import {
  capitalizeName,
  getDataFromStorage,
  logEventFunction,
} from '../../../utils/JsHelper/Helper';
import { courseTrackingStatus } from '../../../utils/API/ApiCalls';
import ActiveLoading from '../../LoadingScreen/ActiveLoading';
import CustomSearchBox from '../../../components/CustomSearchBox/CustomSearchBox';
import globalStyles from '../../../utils/Helper/Style';

import GlobalText from '@components/GlobalText/GlobalText';
import AppUpdatePopup from '../../../components/AppUpdate/AppUpdatePopup';

const CopilotView = walkthroughable(View); // Wrap Text to make it interactable

const Courses = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [data, setData] = useState([]);
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
  const [filters, setFilters] = useState([]);

  const routeName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  useEffect(() => {
    const fetch = async () => {
      const cohort_id = await getDataFromStorage('cohortId');
      let userType = await getDataFromStorage('userType');
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
    const mainFormData = {
      ...parentFormData,
      ...parentStaticFormData,
    };
    setFilters(mainFormData);
    let data = await courseListApi_testing({ searchText, mainFormData });

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

  useEffect(() => {
    fetchData();
  }, [parentFormData, parentStaticFormData]);

  const handleSearch = async () => {
    await fetchData();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <SecondaryHeader logo />
      <AppUpdatePopup />
      <ScrollView nestedScrollEnabled>
        <View style={styles.view}>
          {loading ? (
            <ActiveLoading />
          ) : (
            <>
              <View style={styles.view2}>
                <Image source={wave} resizeMode="contain" />
                <GlobalText style={styles.text2}>
                  {t('welcome')},
                  {capitalizeName(
                    `${userInfo?.[0]?.firstName} ${userInfo?.[0]?.lastName}!`
                  )}
                </GlobalText>
              </View>

              <GlobalText style={styles.text}>
                {youthnet ? t('l1_courses') : t('courses')}
              </GlobalText>
              <ContinueLearning youthnet={youthnet} t={t} userId={userId} />
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
                        placeholder={t('Search Courses')}
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
                    setIsModal(true);
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
                </CopilotView>
              </CopilotStep>
            </>
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
      {isModal && (
        <FilterModal
          isModal={isModal}
          setIsModal={setIsModal}
          setParentFormData={setParentFormData}
          setParentStaticFormData={setParentStaticFormData}
          parentFormData={parentFormData}
          parentStaticFormData={parentStaticFormData}
        />
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

export default Courses;
