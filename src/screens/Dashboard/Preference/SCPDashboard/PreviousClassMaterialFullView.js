import React, { useEffect, useState } from 'react';
import SecondaryHeader from '../../../../components/Layout/SecondaryHeader';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../../../utils/Helper/Style';
import { useTranslation } from '../../../../context/LanguageContext';
import Accordion from '../../../../components/Accordion/Accordion';
import WeeklyCalendar from '../../Calendar/WeeklyCalendar';
import MonthlyCalendar from '../../Calendar/MonthlyCalendar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { eventList } from '../../../../utils/API/AuthService';
import { categorizeEvents } from '../../../../utils/JsHelper/Helper';

import GlobalText from '@components/GlobalText/GlobalText';
import { convertDates } from '@src/utils/Helper/JSHelper';

const PreviousClassMaterialFullView = () => {
  const navigation = useNavigation();
  const { t, language } = useTranslation();
  const [eventDate, setEventDate] = useState();
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [track, setTrack] = useState([]);
  const [allEventData, setAllEventData] = useState([]);

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

  const fetchData = async () => {
    setLoading(true);

    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() - 1); // Go to yesterday
    startDate.setUTCHours(18, 30, 0, 0); // Set to 18:30:00

    const endDate = new Date();
    endDate.setUTCHours(18, 29, 59, 999); // Set to 18:29:59.999
    console.log(startDate, endDate, 'FirstTime');

    const data = await eventList({ startDate, endDate });
    const finalData = await categorizeEvents(data?.events);
    setEventData(finalData);
    setLoading(false);
  };
  const fetchPrevData = async () => {
    setLoading(true);
    const startDate = new Date(eventDate);
    startDate.setUTCDate(startDate.getUTCDate() - 1); // Go to yesterday
    startDate.setUTCHours(18, 30, 0, 0); // Set to 18:30:00

    const endDate = new Date(eventDate); // Create endDate from startDate
    endDate.setUTCHours(18, 29, 59, 999); // Set to 18:29:59.999
    console.log({ startDate, endDate });

    const data = await eventList({ startDate, endDate });
    const finalData = await categorizeEvents(data?.events);
    setEventData(finalData);
    setLoading(false);
  };

  const fetchCompleteMonthData = async () => {
    setLoading(true);

    // Get the current date
    const currentDate = new Date();

    // Set startDate to the 1st day of the current month at 18:30:00 UTC
    const startDate = new Date(
      Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 0, 18, 30, 0)
    );

    // Set endDate to the last day of the current month at 18:29:59.999 UTC
    const endDate = new Date(
      Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        18,
        29,
        59,
        999
      )
    );

    // Fetch the data within the specified date range
    const data = await eventList({ startDate, endDate });
    const uniqueDates = Array.from(
      new Set(
        data?.events?.map((item) => {
          const eventDate = new Date(item?.startDateTime);

          return eventDate; // Get the day of the month
        })
      )
    );
    const convertedData = convertDates(uniqueDates);
    // console.log('allEventData', JSON.stringify(convertedData));

    setAllEventData(convertedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchCompleteMonthData();
  }, []);

  useEffect(() => {
    if (eventDate) {
      fetchPrevData();
    }
  }, [eventDate]);

  // console.log(allEventData);

  return (
    <>
      <SecondaryHeader logo />

      <View style={styles.card}>
        <ScrollView style={{ height: '85%' }}>
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
            </TouchableOpacity>
            <GlobalText style={[globalStyles.heading2]}>
              {t('previous_class_materials')}
            </GlobalText>
          </View>
          <View style={{ marginVertical: 10 }}>
            {allEventData?.length > 0 && allEventData && (
              <MonthlyCalendar
                allEventData={allEventData}
                attendance={false}
                setEventDate={setEventDate}
              />
            )}
            {allEventData?.length === 0 && (
              <MonthlyCalendar
                allEventData={allEventData}
                attendance={false}
                setEventDate={setEventDate}
              />
            )}
          </View>
          <GlobalText style={[globalStyles.subHeading]}>
            {t('planned_sessions')}
          </GlobalText>

          {eventData?.plannedSessions?.length > 0 ? (
            eventData.plannedSessions.map((item, key) => (
              <Accordion
                subTopic={item?.erMetaData?.subTopic}
                setTrack={setTrack}
                postrequisites
                key={key}
                item={item}
              />
            ))
          ) : (
            <GlobalText style={globalStyles.text}>
              {t('no_sessions_scheduled')}
            </GlobalText>
          )}

          <GlobalText style={globalStyles.subHeading}>
            {t('extra_sessions')}
          </GlobalText>
          {eventData?.extraSessions?.length > 0 ? (
            eventData.extraSessions.map((item, key) => (
              <Accordion
                subTopic={item?.erMetaData?.subTopic}
                setTrack={setTrack}
                postrequisites
                key={key}
                item={item}
              />
            ))
          ) : (
            <GlobalText style={globalStyles.text}>
              {t('no_sessions_scheduled')}
            </GlobalText>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent dark background
  },
  modalContent: {
    width: '95%', // Adjust the width as per requirement
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center', // Center the modal content
    justifyContent: 'center',
    padding: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
});

export default PreviousClassMaterialFullView;
