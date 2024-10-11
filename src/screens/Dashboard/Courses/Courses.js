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
import { getDataFromStorage } from '../../../utils/JsHelper/Helper';
import { courseTrackingStatus } from '../../../utils/API/ApiCalls';
import ActiveLoading from '../../LoadingScreen/ActiveLoading';

const Courses = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [trackData, setTrackData] = useState([]);
  const [userInfo, setUserInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);

  const routeName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

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
      console.log('########## in focus course');
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
    setLoading(true);
    const data = await courseListApi();

    //const data = await courseListApi_testing();

    //found course progress
    try {
      console.log('########## contentListApi');
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
      let batchId = await getDataFromStorage('cohortId');
      let course_track_data = await courseTrackingStatus(
        userId,
        batchId,
        courseList
      );
      //console.log('########## course_track_data', course_track_data?.data);
      let courseTrackData = [];
      if (course_track_data?.data) {
        courseTrackData =
          course_track_data?.data.find((course) => course.userId === userId)
            ?.course || [];
      }
      setTrackData(courseTrackData);
      console.log('########## courseTrackData', courseTrackData);
      console.log('##########');
    } catch (e) {
      console.log('e', e);
    }
    const result = JSON.parse(await getDataFromStorage('profileData'));
    setUserInfo(result?.getUserDetails);
    setData(data?.content);
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
              <Text allowFontScaling={false} style={styles.text}>
                {t('courses')}
              </Text>
              <View style={styles.view2}>
                <Image source={wave} resizeMode="contain" />
                <Text allowFontScaling={false} style={styles.text2}>
                  {t('welcome')}, {userInfo?.[0]?.name} !
                </Text>
              </View>
              <SyncCard
              //doneSync={fetchData}
              />

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
