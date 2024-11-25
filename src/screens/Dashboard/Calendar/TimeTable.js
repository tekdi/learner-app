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
} from 'react-native';
import globalStyles from '../../../utils/Helper/Style';
import SecondaryHeader from '../../../components/Layout/SecondaryHeader';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import MonthlyCalendar from './MonthlyCalendar';
import { eventList, getAttendance } from '../../../utils/API/AuthService';
import { categorizeEvents } from '../../../utils/JsHelper/Helper';
import SubjectCard from '../Preference/SCPDashboard/SubjectCard';
import ActiveLoading from '../../LoadingScreen/ActiveLoading';

import GlobalText from "@components/GlobalText/GlobalText";

const TimeTable = () => {
  const [eventDate, setEventDate] = useState(null);
  const [learnerAttendance, setLearnerAttendance] = useState(null);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Sample data for the last 30 days

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
    const finalData = await categorizeEvents(data?.events);

    setEventData(finalData);
    setLoading(false);
  };
  const fetchUpcomingData = async () => {
    setLoading(true);

    // Set start date to yesterday at 18:30:00 UTC
    const startDate = new Date(eventDate);
    startDate.setUTCDate(startDate.getUTCDate() - 1); // Set to yesterday
    startDate.setUTCHours(18, 30, 0, 0); // Set time to 18:30:00 UTC

    // Set end date to today at 18:29:59 UTC
    const endDate = new Date(eventDate);
    endDate.setUTCHours(18, 29, 59, 999); // Set time to 18:29:59 UTC

    // Fetch the data within the specified date range
    const data = await eventList({ startDate, endDate });
    const finalData = await categorizeEvents(data?.events);

    setEventData(finalData);
    setLoading(false);
  };

  useEffect(() => {
    if (eventDate) {
      fetchUpcomingData();
    }
  }, [eventDate]);

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
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
            {t('my_timetable')}
          </GlobalText>
        </View>
      </View>
      <ScrollView style={styles.scroll}>
        <MonthlyCalendar setEventDate={setEventDate} />
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
      </ScrollView>
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

export default TimeTable;
