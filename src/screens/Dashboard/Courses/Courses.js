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
import Icon from 'react-native-vector-icons/Octicons';
import ScrollViewLayout from '../../../components/Layout/ScrollViewLayout';
import { useTranslation } from '../../../context/LanguageContext';
import wave from '../../../assets/images/png/wave.png';
import CoursesBox from '../../../components/CoursesBox/CoursesBox';
import SecondaryHeader from '../../../components/Layout/SecondaryHeader';
import {
  courseListApi,
  courseListApi_testing,
  getAccessToken,
} from '../../../utils/API/AuthService';
import SyncCard from '../../../components/SyncComponent/SyncCard';
import BackButtonHandler from '../../../components/BackNavigation/BackButtonHandler';
import {
  capitalizeName,
  getDataFromStorage,
  getTentantId,
  logEventFunction,
} from '../../../utils/JsHelper/Helper';
import { courseTrackingStatus } from '../../../utils/API/ApiCalls';
import ActiveLoading from '../../LoadingScreen/ActiveLoading';
import CustomSearchBox from '../../../components/CustomSearchBox/CustomSearchBox';
import globalStyles from '../../../utils/Helper/Style';

import GlobalText from "@components/GlobalText/GlobalText";

const Courses = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [trackData, setTrackData] = useState([]);
  const [userInfo, setUserInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [youthnet, setYouthnet] = useState(false);
  const [searchText, setSearchText] = useState('');

  const routeName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  useEffect(() => {
    const fetch = async () => {
      const cohort_id = await getDataFromStorage('cohortId');
      console.log({ cohort_id });
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
    setSearchText('');
    setLoading(true);
    let data;
    const tenantId = await getTentantId();
    // id = '10a9f829-3652-47d0-b17b-68c4428f9f89';
    /*id = '6c8b810a-66c2-4f0d-8c0c-c025415a4414';
    if (tenantId === id) {
      const payload = {
        request: {
          filters: {
            se_boards: ['nios'],
            se_gradeLevels: ['program'],
            se_subjects: ['literacy'],
            primaryCategory: [
              'Collection',
              'Resource',
              'Content Playlist',
              'Course',
              'Course Assessment',
              'Digital Textbook',
              'eTextbook',
              'Explanation Content',
              'Learning Resource',
              'Lesson Plan Unit',
              'Practice Question Set',
              'Teacher Resource',
              'Textbook Unit',
              'LessonPlan',
              'FocusSpot',
              'Learning Outcome Definition',
              'Curiosity Questions',
              'MarkingSchemeRubric',
              'ExplanationResource',
              'ExperientialResource',
              'Practice Resource',
              'TVLesson',
              'Course Unit',
              'Program',
              'Project',
              'improvementProject',
            ],
            visibility: ['Default', 'Parent'],
          },
          limit: 100,
          sort_by: {
            lastPublishedOn: 'desc',
          },
          fields: [
            'name',
            'appIcon',
            'mimeType',
            'gradeLevel',
            'description',
            'posterImage',
            'identifier',
            'medium',
            'pkgVersion',
            'board',
            'subject',
            'resourceType',
            'primaryCategory',
            'contentType',
            'channel',
            'organisation',
            'trackable',
          ],
          facets: [
            'se_boards',
            'se_gradeLevels',
            'se_subjects',
            'se_mediums',
            'primaryCategory',
          ],
          offset: 0,
        },
      };
      data = await courseListApi({ payload });
      setYouthnet(true);
    } else {
      const payload = {
        request: {
          filters: {
            se_boards: [
              'Odisha',
              'Uttar Pradesh',
              'Madhya Pradesh',
              'NIOS',
              'Rajasthan',
            ],
            primaryCategory: ['Course'],
            visibility: ['Default', 'Parent'],
          },
          limit: 100,
          sort_by: {
            lastPublishedOn: 'desc',
          },
          fields: [
            'name',
            'appIcon',
            'description',
            'posterImage',
            'mimeType',
            'identifier',
            'resourceType',
            'primaryCategory',
            'contentType',
            'trackable',
            'children',
            'leafNodes',
          ],
          facets: [
            'se_boards',
            'se_gradeLevels',
            'se_subjects',
            'se_mediums',
            'primaryCategory',
          ],
          offset: 0,
        },
      };
      data = await courseListApi({ payload });
    }*/

    //testing
    data = await courseListApi_testing({ searchText });

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
    setLoading(true);
    let result;
    const tenantId = await getTentantId();
    // id = '10a9f829-3652-47d0-b17b-68c4428f9f89';
    /*id = '6c8b810a-66c2-4f0d-8c0c-c025415a4414';
    if (tenantId === id) {
      const payload = {
        request: {
          filters: {
            se_boards: ['nios'],
            se_gradeLevels: ['program'],
            se_subjects: ['literacy'],
            primaryCategory: [
              'Collection',
              'Resource',
              'Content Playlist',
              'Course',
              'Course Assessment',
              'Digital Textbook',
              'eTextbook',
              'Explanation Content',
              'Learning Resource',
              'Lesson Plan Unit',
              'Practice Question Set',
              'Teacher Resource',
              'Textbook Unit',
              'LessonPlan',
              'FocusSpot',
              'Learning Outcome Definition',
              'Curiosity Questions',
              'MarkingSchemeRubric',
              'ExplanationResource',
              'ExperientialResource',
              'Practice Resource',
              'TVLesson',
              'Course Unit',
              'Program',
              'Project',
              'improvementProject',
            ],
            visibility: ['Default', 'Parent'],
          },
          limit: 100,
          sort_by: {
            lastPublishedOn: 'desc',
          },
          query: searchText,
          fields: [
            'name',
            'appIcon',
            'mimeType',
            'gradeLevel',
            'description',
            'posterImage',
            'identifier',
            'medium',
            'pkgVersion',
            'board',
            'subject',
            'resourceType',
            'primaryCategory',
            'contentType',
            'channel',
            'organisation',
            'trackable',
          ],
          facets: [
            'se_boards',
            'se_gradeLevels',
            'se_subjects',
            'se_mediums',
            'primaryCategory',
          ],
          offset: 0,
        },
      };
      result = await courseListApi({ payload });
      setYouthnet(true);
    } else {
      const payload = {
        request: {
          filters: {
            se_boards: [
              'Odisha',
              'Uttar Pradesh',
              'Madhya Pradesh',
              'NIOS',
              'Rajasthan',
            ],
            primaryCategory: ['Course'],
            visibility: ['Default', 'Parent'],
          },
          limit: 100,
          sort_by: {
            lastPublishedOn: 'desc',
          },
          query: searchText,
          fields: [
            'name',
            'appIcon',
            'description',
            'posterImage',
            'mimeType',
            'identifier',
            'resourceType',
            'primaryCategory',
            'contentType',
            'trackable',
            'children',
            'leafNodes',
          ],
          facets: [
            'se_boards',
            'se_gradeLevels',
            'se_subjects',
            'se_mediums',
            'primaryCategory',
          ],
          offset: 0,
        },
      };
      result = await courseListApi({ payload });
    }*/

    result = await courseListApi_testing({ searchText });
    console.log('result?.content', result?.content);

    setData(result?.content || []);
    // console.log(result?.content?.length, 'ddddd');

    // if (result?.content?.length == undefined) {
    //   setSearchText('');
    // }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <SecondaryHeader logo />
      <ScrollView nestedScrollEnabled>
        <View style={styles.view}>
          {loading ? (
            <ActiveLoading />
          ) : (
            <SafeAreaView>
              <StatusBar
                barStyle="dark-content"
                translucent={true}
                backgroundColor="transparent"
              />
              <View style={styles.view2}>
                <Image source={wave} resizeMode="contain" />
                <GlobalText style={styles.text2}>
                  {t('welcome')}, {capitalizeName(userInfo?.[0]?.name)} !
                </GlobalText>
              </View>
              <GlobalText style={styles.text}>
                {youthnet ? t('l1_courses') : t('courses')}
              </GlobalText>

              <CustomSearchBox
                setSearchText={setSearchText}
                searchText={searchText}
                handleSearch={handleSearch}
                placeholder={t('Search Courses')}
              />

              <SyncCard
              //doneSync={fetchData}
              />
              {data.length > 0 ? (
                <CoursesBox
                  // title={'Continue_Learning'}
                  // description={'Food_Production'}
                  style={{ titlecolor: '#06A816' }}
                  viewAllLink={() =>
                    navigation.navigate('ViewAll', {
                      title: 'Continue_Learning',
                      data: data,
                    })
                  }
                  ContentData={data}
                  TrackData={trackData}
                />
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

export default Courses;
