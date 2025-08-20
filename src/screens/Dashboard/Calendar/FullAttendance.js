import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import globalStyles from '../../../utils/Helper/Style';
import SecondaryHeader from '../../../components/Layout/SecondaryHeader';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import MonthlyCalendar from './MonthlyCalendar';
import { getAttendance } from '../../../utils/API/AuthService';

import GlobalText from '@components/GlobalText/GlobalText';
import ActiveLoading from '../../LoadingScreen/ActiveLoading';
import NetworkAlert from '../../../components/NetworkError/NetworkAlert';

const FullAttendance = () => {
  const [eventDate, setEventDate] = useState(null);
  const [learnerAttendance, setLearnerAttendance] = useState(null);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [networkstatus, setNetworkstatus] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Sample data for the last 30 days

  const fetchData = async () => {
    setLoading(true);

    const todayDate = new Date();
    const lastDate = new Date();
    lastDate.setDate(todayDate.getDate() - 91);

    const todate = todayDate.toISOString().split('T')[0];
    const fromDate = lastDate.toISOString().split('T')[0];

    const response = (await getAttendance({ todate, fromDate })) || [];
    console.log('response', response);

    if (response.length < 1) {
      setNetworkstatus(false);
    }

    // Ensure new state reference
    setLearnerAttendance(
      response?.attendanceList ? [...response.attendanceList] : []
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true); // Start Refresh Indicator

    try {
      console.log('Fetching Data...');
      await fetchData();
      setRefreshKey((prevKey) => prevKey + 1);
      // navigation.navigate('SCPUserTabScreen');
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

      <View style={styles.card}>
        <View style={styles.leftContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Octicons
              name="arrow-left"
              style={{ marginHorizontal: 10 }}
              color={'#000'}
              size={30}
            />
            {/* <GlobalText >Back</GlobalText> */}
          </TouchableOpacity>
        </View>
        <View style={styles.rightContainer}>
          <GlobalText style={globalStyles.heading}>
            {t('my_full_attendance')}
          </GlobalText>
        </View>
      </View>
      {loading ? (
        <ActiveLoading />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
          style={styles.scroll}
        >
          {learnerAttendance && (
            <MonthlyCalendar
              learnerAttendance={learnerAttendance}
              attendance
              setEventDate={setEventDate}
              key={refreshKey}
            />
          )}
        </ScrollView>
      )}
      <NetworkAlert
        onTryAgain={() => {
          navigation.goBack();
        }}
        isConnected={networkstatus}
        closeModal={() => {
          setNetworkstatus(!networkstatus);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    // borderWidth: 1,
    height: '70%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 4,
  },
});

export default FullAttendance;
