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
import { getAttendance } from '../../../utils/API/AuthService';

import GlobalText from "@components/GlobalText/GlobalText";

const FullAttendance = () => {
  const [eventDate, setEventDate] = useState(null);
  const [learnerAttendance, setLearnerAttendance] = useState(null);
  const { t } = useTranslation();
  const navigation = useNavigation();

  // Sample data for the last 30 days

  console.log({ eventDate });

  const fetchData = async () => {
    // Get today's date
    const todayDate = new Date();

    // Get date 31 days ago
    const lastDate = new Date();
    lastDate.setDate(todayDate.getDate() - 91);

    // Format the dates as 'YYYY-MM-DD'
    const todate = todayDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const fromDate = lastDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const response = await getAttendance({ todate, fromDate });
    setLearnerAttendance(response.attendanceList);
  };

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
            {t('my_full_attendance')}
          </GlobalText>
        </View>
      </View>
      <ScrollView style={styles.scroll}>
        {learnerAttendance && (
          <MonthlyCalendar
            learnerAttendance={learnerAttendance}
            attendance
            setEventDate={setEventDate}
          />
        )}

        {eventDate && (
          <View
            style={{ padding: 10, backgroundColor: '#fafafa', marginTop: 20 }}
          >
            <GlobalText
              style={globalStyles.text}
            >{`Selected Date: `}</GlobalText>
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

export default FullAttendance;
