import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  BackHandler,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import SafeAreaWrapper from '../../../../components/SafeAreaWrapper/SafeAreaWrapper';
import SecondaryHeader from '../../../../components/Layout/SecondaryHeader';
import wave from '../../../../assets/images/png/wave.png';
import { useTranslation } from '../../../../context/LanguageContext';
import { View } from 'react-native';
import {
  capitalizeName,
  categorizeEvents,
  getDataFromStorage,
} from '../../../../utils/JsHelper/Helper';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import globalStyles from '../../../../utils/Helper/Style';
import { TouchableOpacity } from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import WeeklyCalendar from '../../Calendar/WeeklyCalendar';
import AttendanceCard from './AttendanceCard';
import SessionCard from './SessionCard';
import SubjectCard from './SubjectCard';
import {
  eventList,
  LearningMaterialAPI,
} from '../../../../utils/API/AuthService';
import ActiveLoading from '../../../LoadingScreen/ActiveLoading';
import BackButtonHandler from '../../../../components/BackNavigation/BackButtonHandler';

import GlobalText from '@components/GlobalText/GlobalText';
import AppUpdatePopup from '../../../../components/AppUpdate/AppUpdatePopup';
import NetworkAlert from '@components/NetworkError/NetworkAlert';
import { deepLinkCheck } from '../../../../utils/JsHelper/DeepLink';

const SCPDashboard = (props) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState();
  const [date, setDate] = useState();
  const [allEventData, setAllEventData] = useState();
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const currentMonthName = monthNames[new Date().getMonth()];
  const [showExitModal, setShowExitModal] = useState(false);
  const [networkstatus, setNetworkstatus] = useState(true);

  const getUserInfo = async () => {
    const result = JSON.parse(await getDataFromStorage('profileData'));
    setUserInfo(result?.getUserDetails);
  };

  useFocusEffect(
    useCallback(() => {
      getUserInfo();
    }, [navigation])
  );

  const routeName = useNavigationState((state) => {
    const route = state.routes[state.index];
    return route.name;
  });

  const fetchData = async () => {
    setLoading(true);

    // Set start date to yesterday at 18:30:00 UTC
    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() - 1); // Set to yesterday
    startDate.setUTCHours(18, 30, 0, 0); // Set time to 18:30:00 UTC

    // Set end date to today at 18:29:59 UTC
    const endDate = new Date();
    endDate.setUTCHours(18, 29, 59, 999); // Set time to 18:29:59 UTC

    // Fetch the data within the specified date range
    const data = await eventList({ startDate, endDate });

    const boardData = await LearningMaterialAPI();

    const finalData = await categorizeEvents(data?.events);

    setEventData(finalData);
    setLoading(false);
  };
  const fetchUpcomingData = async () => {
    setLoading(true);

    // Set start date to yesterday at 18:30:00 UTC
    const startDate = new Date(date);
    startDate.setUTCDate(startDate.getUTCDate() - 1); // Set to yesterday
    startDate.setUTCHours(18, 30, 0, 0); // Set time to 18:30:00 UTC

    // Set end date to today at 18:29:59 UTC
    const endDate = new Date(date);
    endDate.setUTCHours(18, 29, 59, 999); // Set time to 18:29:59 UTC

    // Fetch the data within the specified date range
    const data = await eventList({ startDate, endDate });
    // if (!data) {
    //   setNetworkstatus(false);
    // }
    const finalData = await categorizeEvents(data?.events);

    setEventData(finalData);
    setLoading(false);
  };

  const fetchCompleteWeekData = async () => {
    setLoading(true);

    // Set start date to yesterday at 18:30:00 UTC
    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() - 1); // Set to yesterday
    startDate.setUTCHours(18, 30, 0, 0); // Set time to 18:30:00 UTC
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 6);
    endDate.setUTCHours(18, 29, 59, 999); // Set time to 18:29:59 UTC

    // Fetch the data within the specified date range
    const data = await eventList({ startDate, endDate });

    setAllEventData(data?.events);
    // setLoading(false);
  };

  useEffect(() => {
    if (date) {
      fetchUpcomingData();
    }
  }, [date]);

  // useEffect(() => {
  //   fetchData();
  //   fetchCompleteWeekData();
  // }, []);

  //deeplink
  useEffect(() => {
    //check deeplink data
    deepLinkCheck(navigation);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      fetchCompleteWeekData();
    }, [])
  );

  const handleCancel = () => {
    setShowExitModal(false); // Close the modal
  };

  const handleExitApp = () => {
    setShowExitModal(false);
    BackHandler.exitApp(); // Exit the app
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (routeName === 'Home') {
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

  // Refresh the component.
  const handleRefresh = async () => {
    setLoading(true); // Start Refresh Indicator

    try {
      console.log('Fetching Data...');
      // fetchData();
      // fetchCompleteWeekData();
      setRefreshKey((prevKey) => prevKey + 1);
      // navigation.navigate('SCPUserTabScreen');
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop Refresh Indicator
    }
  };

  return (
    <SafeAreaWrapper
      key={refreshKey}
      style={{ flex: 1, backgroundColor: 'white' }}
    >
      <SecondaryHeader logo />
      <AppUpdatePopup />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        style={styles.view2}
      >
        <View style={globalStyles.flexrow}>
          <Image source={wave} resizeMode="contain" />
          <GlobalText style={styles.text2}>
            {t('welcome')},{' '}
            {capitalizeName(
              `${userInfo?.[0]?.firstName} ${userInfo?.[0]?.lastName || ''}!`
            )}
          </GlobalText>
        </View>
        <View style={{ marginVertical: 20, alignItems: 'center' }}>
          <SessionCard percentage={10} />
        </View>
          <TouchableOpacity
          onPress={() => {
            navigation.navigate('DuringSession');
          }}
          style={[styles.box]}
        >
          <View style={{ width: '90%' }}>
            <GlobalText
              style={[globalStyles.subHeading, { fontWeight: 'bold' }]}
            >
              {t('during_session') || 'During Session'} 
            </GlobalText>
            <GlobalText
              style={globalStyles.subHeading}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {t('complete_activities_during_session') || 'Complete activities during session'}
            </GlobalText>
          </View>
          <View>
            <Octicons
              name="arrow-right"
              style={{ marginHorizontal: 10 }}
              color={'#000'}
              size={20}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PreviousClassMaterial');
          }}
          style={[styles.box]}
        >
          <View style={{ width: '90%' }}>
            <GlobalText
              style={[globalStyles.subHeading, { fontWeight: 'bold' }]}
            >
              {t('homework_and_practice')} 
            </GlobalText>
            <GlobalText
              style={globalStyles.subHeading}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {t('complete_activities_for_previous_classes')}
            </GlobalText>
          </View>
          <View>
            <Octicons
              name="arrow-right"
              style={{ marginHorizontal: 10 }}
              color={'#000'}
              size={20}
            />
          </View>
        </TouchableOpacity>
      
        
        <View style={{ marginVertical: 20, borderRadius: 15 }}>
          <AttendanceCard attendance={10} />
        </View>
        <TouchableOpacity
          style={[
            globalStyles.flexrow,
            { justifyContent: 'space-between', marginTop: 20 },
          ]}
          onPress={() => {
            navigation.navigate('TimeTable');
          }}
        >
          <GlobalText style={globalStyles.subHeading}>
            {t('my_timetable')}
          </GlobalText>
          <View style={globalStyles.flexrow}>
            <GlobalText style={[globalStyles.subHeading, { color: '#0D599E' }]}>
              {currentMonthName}
            </GlobalText>

            <Octicons
              name="calendar"
              style={{ marginHorizontal: 10 }}
              color={'#0D599E'}
              size={20}
            />
          </View>
        </TouchableOpacity>
        <View style={{ marginVertical: 20 }}>
          <WeeklyCalendar
            allEventData={allEventData}
            setDate={setDate}
            postdays={true}
          />
        </View>
        <View style={{ minHeight: 240 }}>
          {loading ? (
            <ActiveLoading />
          ) : (
            <View
              style={{
                padding: 10,
                backgroundColor: '#fafafa',
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <GlobalText style={globalStyles.heading2}>
                {t('planned_sessions')}
              </GlobalText>

              {eventData?.plannedSessions?.length > 0 ? (
                eventData.plannedSessions.map((item, key) => (
                  <SubjectCard key={key} item={item} />
                ))
              ) : (
                <GlobalText style={globalStyles.text}>
                  {t('no_sessions_scheduled')}
                </GlobalText>
              )}

              <GlobalText style={globalStyles.heading2}>
                {t('extra_sessions')}
              </GlobalText>
              {eventData?.extraSessions?.length > 0 ? (
                eventData.extraSessions.map((item, key) => (
                  <SubjectCard key={key} item={item} />
                ))
              ) : (
                <GlobalText style={globalStyles.text}>
                  {t('no_sessions_scheduled')}
                </GlobalText>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      {showExitModal && (
        <BackButtonHandler
          exitRoute={true} // You can pass any props needed by the modal here
          onCancel={handleCancel}
          onExit={handleExitApp}
        />
      )}
      <NetworkAlert
        onTryAgain={() => {
          setNetworkstatus(!networkstatus);
        }}
        isConnected={networkstatus}
        closeModal={() => {
          setNetworkstatus(!networkstatus);
        }}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  view2: {
    paddingVertical: 25,
    paddingHorizontal: 10,
    // borderWidth: 1,
    height: '80%',
  },
  text2: {
    fontSize: 14,
    color: 'black',
    marginLeft: 10,
    fontWeight: '500',
  },
  box: {
    marginVertical: 10,
    backgroundColor: '#FFDEA1',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    flexDirection: 'row',
  },
});

SCPDashboard.propTypes = {};

export default SCPDashboard;
