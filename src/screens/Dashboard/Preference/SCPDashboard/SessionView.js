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
import {
  categorizeEvents,
  setDataInStorage,
} from '../../../../utils/JsHelper/Helper';
import RocketImageClub from '../../../../components/rocketImageClub/RocketImageClub';

import GlobalText from '@components/GlobalText/GlobalText';

const SessionView = () => {
  const navigation = useNavigation();
  const { t, language } = useTranslation();
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [track, setTrack] = useState([]);
  const [percentage, setPercentage] = useState();
  // Function to get tomorrow's date in "DD Month" format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to tomorrow

    const day = tomorrow.toLocaleDateString(language, { day: 'numeric' });
    const month = tomorrow.toLocaleDateString(language, { month: 'long' });

    return `${day} ${month}`; // Format as "26 October"
  };

  const fetchData = async () => {
    const startDate = new Date();
    startDate.setUTCHours(18, 30, 0, 0); // Set today to 18:30:00Z

    const endDate = new Date(startDate); // Copy today
    endDate.setUTCDate(startDate.getUTCDate() + 1); // Increment the day by 1
    endDate.setUTCHours(18, 29, 59, 999); // Set time to 18:29:59Z
    const data = await eventList({ startDate, endDate });
    const finalData = await categorizeEvents(data?.events);

    setEventData(finalData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const totalCourses = track.length;
      let completedCount = 0;
      let inProgressCount = 0;
      let notStartedCount = 0;

      track.forEach((course) => {
        if (course.completed > 0) {
          completedCount += 1;
        } else if (course.in_progress > 0) {
          inProgressCount += 1;
        } else {
          notStartedCount += 1;
        }
      });
      // Calculate weighted progress
      const completedWeight = 1; // 100%
      const inProgressWeight = 0.5; // 50%
      const notStartedWeight = 0; // 0%

      const weightedProgress =
        ((completedCount * completedWeight +
          inProgressCount * inProgressWeight +
          notStartedCount * notStartedWeight) /
          totalCourses) *
        100;
      setPercentage(weightedProgress || 0);
      await setDataInStorage(
        'weightedProgress',
        JSON.stringify(weightedProgress || 0)
      );
      setLoading(false);
    };
    if (track) {
      getData();
    }
  }, [track]);

  console.log({ percentage });

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
          <GlobalText
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[globalStyles.heading2]}
          >
            {t('prepare_for')} {getTomorrowDate()} {t('sessions')}
          </GlobalText>
        </View>
        <View style={[globalStyles.flexrow, { marginVertical: 20 }]}>
          <View>
            {percentage <= 10 ? (
              <FastImage
                style={styles.img}
                source={
                  require('../../../../assets/images/png/Rocket.png') // Ensure correct image path
                }
                resizeMode={FastImage.resizeMode.contain}
                priority={FastImage.priority.high} // Set the priority here
              />
            ) : percentage === 100 ? (
              <View style={styles.img3}>
                <RocketImageClub />
              </View>
            ) : (
              <FastImage
                style={styles.img2}
                source={require('../../../../assets/images/gif/rocketrun.gif')}
                resizeMode={FastImage.resizeMode.contain}
                priority={FastImage.priority.high} // Set the priority here
              />
            )}
          </View>
          <View style={{ marginLeft: 20 }}>
            <ProgressBarCustom
              progress={percentage || 0}
              language={language}
              width={'80%'}
              color={'#000'}
              horizontal
            />
            <GlobalText style={[globalStyles.text, { color: '#1A8825' }]}>
              {percentage <= 10
                ? t('lets_get_started_dive_in')
                : percentage === 100
                  ? t('mission_accomplished')
                  : t('great_start_keep_going')}
            </GlobalText>
          </View>
        </View>
        <GlobalText style={globalStyles.subHeading}>
          {t('planned_sessions')}
        </GlobalText>
        <ScrollView style={{ height: '80%' }}>
          {eventData?.plannedSessions?.map((item, key) => {
            return <Accordion setTrack={setTrack} key={key} item={item} />;
          })}

          <GlobalText style={globalStyles.subHeading}>
            {t('extra_sessions')}
          </GlobalText>

          {eventData?.extraSessions?.length > 0 ? (
            eventData.extraSessions.map((item, key) => (
              <Accordion setTrack={setTrack} key={key} item={item} />
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
    padding: 20,
    backgroundColor: 'white',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    width: 50,
    height: 50,
  },

  img2: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    transform: [{ rotate: '-45deg' }], // Rotate the image by 45 degrees
  },
  img3: {
    top: -25,
    right: 10,
    width: 60,
    height: 60,
    alignSelf: 'center',
  },
});

export default SessionView;
