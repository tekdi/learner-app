import React, { useEffect, useState } from 'react';
import SecondaryHeader from '../../../../components/Layout/SecondaryHeader';
import {
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
import ProgressBarCustom from '../../../../components/ProgressBarCustom/ProgressBarCustom';
import FastImage from '@changwoolab/react-native-fast-image';
import { eventList } from '../../../../utils/API/AuthService';
import Loading from '../../../LoadingScreen/Loading';
import { categorizeEvents } from '../../../../utils/JsHelper/Helper';

const SessionView = () => {
  const navigation = useNavigation();
  const { t, language } = useTranslation();
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Function to get tomorrow's date in "DD Month" format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to tomorrow

    const day = tomorrow.toLocaleDateString(language, { day: 'numeric' });
    const month = tomorrow.toLocaleDateString(language, { month: 'long' });

    return `${day} ${month}`; // Format as "26 October"
  };

  const fetchData = async () => {
    setLoading(true);
    const startDate = new Date();
    startDate.setUTCHours(18, 30, 0, 0); // Set today to 18:30:00Z

    const endDate = new Date(startDate); // Copy today
    endDate.setUTCDate(startDate.getUTCDate() + 1); // Increment the day by 1
    endDate.setUTCHours(18, 29, 59, 999); // Set time to 18:29:59Z
    const data = await eventList({ startDate, endDate });
    const finalData = await categorizeEvents(data?.events);
    console.log({ finalData });

    setEventData(finalData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <>
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
          </TouchableOpacity>
          <Text style={[globalStyles.heading2]}>
            {t('prepare_for')} {getTomorrowDate()} {t('sessions')}
          </Text>
        </View>
        {/* <View style={[globalStyles.flexrow, { marginVertical: 20 }]}>
          <FastImage
            style={styles.img}
            source={require('../../../../assets/images/gif/target.gif')}
            resizeMode={FastImage.resizeMode.contain}
            priority={FastImage.priority.high} // Set the priority here
          />
          <View style={{ marginLeft: 20 }}>
            <ProgressBarCustom
              progress={50}
              language={language}
              width={'80%'}
              color={'#000'}
              horizontal
            />
            <Text style={[globalStyles.text, { color: '#0D599E' }]}>
              {t('mission_accomplished')}
            </Text>
          </View>
        </View> */}
        <ScrollView style={{ height: '80%' }}>
          {eventData?.plannedSessions?.map((item, key) => {
            return <Accordion key={key} item={item} />;
          })}

          <Text style={globalStyles.subHeading}>{t('extra_sessions')}</Text>
          {eventData?.extraSessions?.map((item, key) => {
            return;
          })}
          {eventData?.extraSessions?.length > 0 ? (
            eventData.extraSessions.map((item, key) => (
              <Accordion key={key} item={item} />
            ))
          ) : (
            <Text style={globalStyles.text}>{t('no_sessions_scheduled')}</Text>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    width: 50,
    height: 50,
  },
});

export default SessionView;
