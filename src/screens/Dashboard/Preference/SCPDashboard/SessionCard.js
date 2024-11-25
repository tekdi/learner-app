import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import globalStyles from '../../../../utils/Helper/Style';
import { useTranslation } from '../../../../context/LanguageContext';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ProgressBarCustom from '../../../../components/ProgressBarCustom/ProgressBarCustom';
import subjectwave2 from '../../../../assets/images/png/subjectwave2.png';
import subjectwave3 from '../../../../assets/images/png/subjectwave3.png';
import RocketImageClub from '../../../../components/rocketImageClub/RocketImageClub';
import FastImage from '@changwoolab/react-native-fast-image';
import { getDataFromStorage } from '../../../../utils/JsHelper/Helper';

import GlobalText from "@components/GlobalText/GlobalText";

const SessionCard = ({ percentage }) => {
  const { t, language } = useTranslation();
  const navigation = useNavigation();
  const [percent, setPercent] = useState();

  // Function to get tomorrow's date in "DD Month" format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to tomorrow

    const day = tomorrow.toLocaleDateString(language, { day: 'numeric' });
    const month = tomorrow.toLocaleDateString(language, { month: 'long' });

    return `${day} ${month}`; // Format as "26 October"
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const courseTrackData = JSON.parse(
          await getDataFromStorage('courseTrackData')
        );
        const percentage = JSON.parse(
          await getDataFromStorage('weightedProgress')
        );
        setPercent(percentage);
        // console.log({ courseTrackData, percent });
      };
      fetchData();
    }, [navigation])
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('SessionView');
      }}
    >
      <View style={[styles.viewBox, globalStyles.flexrow]}>
        {/* Background Image */}
        <ImageBackground
          source={percent === 100 ? subjectwave3 : subjectwave2}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          {/* Text Content */}
          <View style={styles.viewSub2}>
            <View
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }, // Added marginBottom for spacing
              ]}
            >
              <View>
                <GlobalText style={[globalStyles.subHeading]}>
                  {t('prepare_for')} {getTomorrowDate()} {t('sessions')}
                </GlobalText>
                <GlobalText style={[globalStyles.subHeading]}>
                  {t('pre_requisites')}
                </GlobalText>
              </View>

              <Octicons
                name="arrow-right"
                style={{ marginHorizontal: 10 }}
                color={'#000'}
                size={20}
              />
            </View>

            <View>
              {percent <= 10 ? (
                <FastImage
                  style={styles.img}
                  source={
                    require('../../../../assets/images/png/Rocket.png') // Ensure correct image path
                  }
                  resizeMode={FastImage.resizeMode.contain}
                  priority={FastImage.priority.high} // Set the priority here
                />
              ) : percent === 100 ? (
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

            <View style={{ opacity: 1 }}>
              <ProgressBarCustom
                progress={percent || 0}
                language={language}
                width={'90%'}
                color={'#000'}
                horizontal
              />

              <GlobalText style={[globalStyles.text, { color: '#1A8825' }]}>
                {percent <= 10
                  ? t('lets_get_started_dive_in')
                  : percent === 100
                  ? t('mission_accomplished')
                  : t('great_start_keep_going')}
              </GlobalText>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  viewBox: {
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 5,
    overflow: 'hidden',
    width: '98%',
    height: 200,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    top: -60,
    justifyContent: 'center', // Centers the content vertically
  },
  // overlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay for better text visibility
  // },
  viewSub2: {
    padding: 10,
    justifyContent: 'space-between',
    // borderWidth: 1,
    height: '100%',
    top: 60,
  },
  img: {
    position: 'absolute',
    width: 80,
    height: 80,
    alignSelf: 'center',
    top: -45,
  },
  img2: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignSelf: 'center',
    top: -25,
    transform: [{ rotate: '-45deg' }], // Rotate the image by 45 degrees
  },
  img3: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignSelf: 'center',
    top: -55,
    left: '35%',
  },
});

SessionCard.propTypes = {
  percentage: PropTypes.number,
};

export default SessionCard;
