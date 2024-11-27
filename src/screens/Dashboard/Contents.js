import React, { useCallback, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  FlatList,
  View,
  ScrollView,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import { useTranslation } from '../../context/LanguageContext';
import ContentCard from './ContentCard';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';
import {
  contentListApi,
  contentListApi_Pratham,
} from '../../utils/API/AuthService';
import SyncCard from '../../components/SyncComponent/SyncCard';
import BackButtonHandler from '../../components/BackNavigation/BackButtonHandler';
import {
  capitalizeName,
  getDataFromStorage,
  logEventFunction,
} from '../../utils/JsHelper/Helper';
import wave from '../../assets/images/png/wave.png';
import { courseTrackingStatus } from '../../utils/API/ApiCalls';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
import CustomSearchBox from '../../components/CustomSearchBox/CustomSearchBox';
import globalStyles from '../../utils/Helper/Style';

import GlobalText from '@components/GlobalText/GlobalText';

const Contents = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [trackData, setTrackData] = useState([]);
  const [userInfo, setUserInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [searchText, setSearchText] = useState('');

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

  useFocusEffect(
    useCallback(() => {
      setSearchText('');
      // console.log('########## in focus course');
      // setLoading(true);
      //bug fix for not realtime tracking
      //fetchData();
      setTimeout(() => {
        // Code to run after 1 second
        fetchData();
      }, 500); // 1000 milliseconds = 1 second
    }, []) // Make sure to include the dependencies
  );
  useEffect(() => {
    const logEvent = async () => {
      const obj = {
        eventName: 'contents_page_view',
        method: 'on-view',
        screenName: 'Contents',
      };

      await logEventFunction(obj);
    };
    logEvent();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    //sunbird saas
    //const data = await contentListApi();
    //pratham
    const data = await contentListApi_Pratham({ searchText });
    //const data = await contentListApi({ searchText });
    //found content progress
    try {
      console.log('########## contentListApi');
      const contentList = [
        ...(data?.content || []),
        ...(data?.QuestionSet || []),
      ];
      console.log('########## contentList', contentList);
      let contentIdList = [];
      if (contentList) {
        for (let i = 0; i < contentList.length; i++) {
          contentIdList.push(contentList[i]?.identifier);
        }
      }
      // console.log('########## contentIdList', contentIdList);
      // console.log('########## contentList', contentList);
      //get course track data
      let userId = await getDataFromStorage('userId');
      let course_track_data = await courseTrackingStatus(userId, contentIdList);
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
      const result = JSON.parse(await getDataFromStorage('profileData'));
      setUserInfo(result?.getUserDetails);
      setData(contentList);
      setLoading(false);
    } catch (e) {
      console.log('e', e);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    console.log({ searchText });

    let result = await contentListApi_Pratham({ searchText });
    setData(result?.content || []);
    if (data.length < 0) {
      setSearchText('');
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SecondaryHeader logo />
      <ScrollView nestedScrollEnabled>
        <View style={styles.view}>
          {loading ? (
            <ActiveLoading />
          ) : (
            <SafeAreaView>
              <View style={styles.view2}>
                <Image source={wave} resizeMode="contain" />
                <GlobalText style={styles.text2}>
                  {t('welcome')}, {capitalizeName(userInfo?.[0]?.name)}!
                </GlobalText>
              </View>
              <GlobalText style={styles.text}>
                {t('Learning_Content')}
              </GlobalText>
              <CustomSearchBox
                setSearchText={setSearchText}
                searchText={searchText}
                handleSearch={handleSearch}
                placeholder={t('Search Content')}
              />
              <SyncCard
              //doneSync={fetchData}
              />
              <View
                style={{
                  padding: 10,
                  // backgroundColor: '#F7ECDF',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                }}
              >
                {data?.length > 0 ? (
                  data?.map((item, index) => {
                    return (
                      <ContentCard
                        key={index}
                        item={item}
                        index={index}
                        course_id={item?.identifier}
                        unit_id={item?.identifier}
                        TrackData={trackData}
                      />
                    );
                  })
                ) : (
                  <GlobalText style={globalStyles.heading2}>
                    {t('no_data_found')}
                  </GlobalText>
                )}
                {/* <FlatList
                  data={data}
                  renderItem={renderContentCard}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={2} // Number of columns for side by side view
                  contentContainerStyle={styles.flatListContent}
                  columnWrapperStyle={styles.columnWrapper} // Adds space between columns
                  scrollEnabled={false}
                /> */}
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
    padding: 15,
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
  flatListContent: {
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Spacing between columns
    paddingHorizontal: 10,
  },
});

export default Contents;
