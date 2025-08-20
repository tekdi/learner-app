import React, { useCallback, useState, useEffect, useRef } from 'react';
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
  RefreshControl,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import { useTranslation } from '../../context/LanguageContext';
import ContentCard from './ContentCard';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';
import { contentListApi_Pratham } from '../../utils/API/AuthService';
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
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import {
  restoreScrollPosition,
  storeScrollPosition,
} from '../../utils/Helper/JSHelper';

const Contents = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [trackData, setTrackData] = useState([]);
  const [userInfo, setUserInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [instant, setInstant] = useState([]);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const scrollViewRef = useRef(null);
  // const [scrollPosition, setScrollPosition] = useState(0);
  const [restoreScroll, setRestoreScroll] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // State for re-rendering

  // Save scroll position when user scrolls
  const handleScroll = (event) => {
    const position = event.nativeEvent.contentOffset.y;
    const page = 'content';
    storeScrollPosition(position, page);
  };

  // Restore scroll position only when coming back
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      if (restoreScroll) {
        const page = 'content';
        restoreScrollPosition(scrollViewRef, page);
      }

      setRestoreScroll(true);
      setLoading(false);

      // onFopcusTrackCourse
      onFopcusTrackCourse();
    }, [restoreScroll])
  );

  const onFopcusTrackCourse = async () => {
    try {
      const contentList = data || [];
      let contentIdList = [];
      if (contentList) {
        for (let i = 0; i < contentList.length; i++) {
          contentIdList.push(contentList[i]?.identifier);
        }
      }
      // console.log(
      //   '########## contentIdList',
      //   JSON.stringify(contentIdList)
      // );
      let userId = await getDataFromStorage('userId');
      let course_track_data = await courseTrackingStatus(userId, contentIdList);

      let courseTrackData = [];
      if (course_track_data?.data) {
        courseTrackData =
          course_track_data?.data.find((course) => course.userId === userId)
            ?.course || [];
      }
      // setTrackData(courseTrackData);
      console.log(
        '########## courseTrackData',
        JSON.stringify(courseTrackData)
      );
      setTrackData(courseTrackData);
    } catch (e) {
      console.log('Error:', e);
    }
  };

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
      // setSearchText('');
      // console.log('########## in focus course');
      // setLoading(true);
      //bug fix for not realtime tracking
      // const append = offset > 0 ? true : false;
      // fetchData(offset, append);
      // setRefreshKey((prev) => prev + 1); // Force component reload
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
    fetchData();
    logEvent();
  }, []);

  const fetchData = async (offset, append = false) => {
    if (append === false) {
      setLoadingContent(true);
    } else {
      setLoadingMore(true);
    }
    console.log('refreshed');
    let userType = await getDataFromStorage('userType');
    const instant =
      userType === 'youthnet'
        ? { frameworkId: 'pos-framework', channelId: 'pos-channel' }
        : userType === 'scp'
        ? { frameworkId: 'scp-framework', channelId: 'scp-channel' }
        : { frameworkId: 'pos-framework', channelId: 'pos-channel' };

    const data = await contentListApi_Pratham({ searchText, instant, offset });
    //found content progress
    try {
      // console.log('########## contentListApi');
      const contentList = [
        ...(data?.content || []),
        ...(data?.QuestionSet || []),
      ];
      // console.log('########## contentList', contentList);
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
      // console.log(
      //   '########## course_track_data',
      //   JSON.stringify(course_track_data?.data)
      // );
      let courseTrackData = [];
      if (course_track_data?.data) {
        courseTrackData =
          course_track_data?.data.find((course) => course.userId === userId)
            ?.course || [];
      }

      // setTrackData((prevData) => [...prevData, ...(courseTrackData || [])]);
      setTrackData((pre) => [...pre, ...courseTrackData]);

      const result = JSON.parse(await getDataFromStorage('profileData'));
      setUserInfo(result?.getUserDetails);
      setCount(data?.count);
      // setData(contentList);
      setData((prevData) =>
        append ? [...prevData, ...(contentList || [])] : contentList || []
      );
      if (append === false) {
        setLoadingContent(false);
      } else {
        setLoadingMore(false);
      }
    } catch (e) {
      console.log('e', e);
    }
  };

  // const handleSearch = async () => {
  //   setOffset(0); // Reset offset when searching
  //   await fetchData(0, false); // Reset course data
  // };

  useEffect(() => {
    const handler = setTimeout(() => {
      setOffset(0); // Reset offset when searching
      fetchData(0, false); // Fetch with reset data
    }, 500);

    // Cleanup timeout on unmount or when searchText changes
    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const handleViewMore = () => {
    const newOffset = offset + 10; // Increase offset by 5
    setOffset(newOffset); // Update state
    fetchData(newOffset, true); // Append new data
    const page = 'content';
    restoreScrollPosition(scrollViewRef, page);
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

  // Refresh the component.
  const handleRefresh = async () => {
    setLoading(true); // Start Refresh Indicator

    try {
      setRefreshKey((prevKey) => prevKey + 1);
      if (searchText === '') {
        // console.log('Fetching Data...');
        setOffset(0); // Reset offset when searching
        fetchData(0, false); // Reset course data
      }
      setSearchText('');
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop Refresh Indicator
    }
  };

  return (
    <SafeAreaView
      key={refreshKey}
      style={{ flex: 1, backgroundColor: 'white' }}
    >
      <SecondaryHeader logo />
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
            <SafeAreaView>
              <View style={styles.view2}>
                <Image source={wave} resizeMode="contain" />
                <GlobalText style={styles.text2}>
                  {t('welcome')},{' '}
                  {userInfo?.[0]?.firstName &&
                    userInfo?.[0]?.lastName &&
                    capitalizeName(
                      `${userInfo?.[0]?.firstName} ${userInfo?.[0]?.lastName}!`
                    )}
                </GlobalText>
              </View>
              <GlobalText style={styles.text}>
                {t('Learning_Content')}
              </GlobalText>
              <CustomSearchBox
                setSearchText={setSearchText}
                searchText={searchText}
                // handleSearch={handleSearch}
                placeholder={t('Search Content')}
              />
              <SyncCard doneSync={fetchData} />
              <View
                style={{
                  padding: 10,
                  PaddinTop: 0,
                  // backgroundColor: '#F7ECDF',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                }}
              >
                {loadingContent === true ? (
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" />
                  </View>
                ) : (
                  <>
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
                  </>
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

                {data.length !== count && (
                  <View>
                    {loadingContent === false && (
                      <>
                        {loadingMore === true ? (
                          <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" />
                          </View>
                        ) : (
                          <PrimaryButton
                            onPress={handleViewMore}
                            text={t('viewmore')}
                          />
                        )}
                      </>
                    )}
                  </View>
                )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Contents;
