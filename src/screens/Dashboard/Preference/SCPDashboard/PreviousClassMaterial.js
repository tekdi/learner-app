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

const PreviousClassMaterial = () => {
  const navigation = useNavigation();
  const { t, language } = useTranslation();
  const [modal, setModal] = useState(false);
  const [eventDate, setEventDate] = useState();
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [track, setTrack] = useState([]);
  const [allEventData, setAllEventData] = useState();

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
    const data = await eventList({ startDate, endDate });
    const finalData = await categorizeEvents(data?.events);
    setEventData(finalData);
    setLoading(false);
  };

  const fetchCompleteWeekData = async () => {
    setLoading(true);

    // Set start date to yesterday at 18:30:00 UTC
    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() - 7); // Set to yesterday
    startDate.setUTCHours(18, 30, 0, 0); // Set time to 18:30:00 UTC
    const endDate = new Date();
    endDate.setUTCHours(18, 29, 59, 999); // Set time to 18:29:59 UTC
    // Fetch the data within the specified date range
    const data = await eventList({ startDate, endDate });

    setAllEventData(data?.events);
    // setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchCompleteWeekData();
  }, []);

  useEffect(() => {
    if (eventDate) {
      fetchPrevData();
    }
  }, [eventDate]);

  return (
    <>
      <SecondaryHeader logo />

      <View style={styles.card}>
        <ScrollView>
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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('PreviousClassMaterialFullView');
            }}
            style={[globalStyles.flexrow, { alignSelf: 'flex-end' }]}
          >
            <GlobalText
              style={[globalStyles.text, { color: '#0D599E', top: 2 }]}
            >
              {currentMonthName}
            </GlobalText>

            <Octicons
              name="calendar"
              style={{ marginHorizontal: 10 }}
              color={'#0D599E'}
              size={20}
            />
          </TouchableOpacity>
          <View style={{ marginVertical: 20 }}>
            <WeeklyCalendar
              allEventData={allEventData}
              setDate={setEventDate}
            />
          </View>
          <GlobalText style={globalStyles.subHeading}>
            {t('planned_sessions')}
          </GlobalText>

          {eventData?.plannedSessions?.length > 0 ? (
            eventData?.plannedSessions?.map((item, key) => (
              <Accordion
                subTopic={item?.erMetaData?.subTopic}
                postrequisites
                setTrack={setTrack}
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
            eventData?.extraSessions?.map((item, key) => (
              <Accordion
                subTopic={item?.erMetaData?.subTopic}
                postrequisites
                setTrack={setTrack}
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

        {/* Centered Modal */}
        {/* <Modal
          visible={modal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModal(false)} // Close the modal on back press
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={30} color={'#000'} />
              </TouchableOpacity>
              <MonthlyCalendar
                attendance={false}
                setModal={setModal}
                setEventDate={setEventDate}
              />
            </View>
          </View>
        </Modal> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    backgroundColor: 'white',
    flex: 1,
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

export default PreviousClassMaterial;
