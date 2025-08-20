import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import globalStyles from '../../../../utils/Helper/Style';
import { useTranslation } from '../../../../context/LanguageContext';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BG from '../../../../assets/images/png/BG.png';
import FastImage from '@changwoolab/react-native-fast-image';
import { getAttendance } from '../../../../utils/API/AuthService';
import { setDataInStorage } from '../../../../utils/JsHelper/Helper';

import GlobalText from '@components/GlobalText/GlobalText';

const AttendanceCard = ({ attendance }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [presentPercentage, setPresentPercentage] = useState('');

  const calculateAttendance = (attendanceData) => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    // Filter data for the last 30 days
    const filteredData = attendanceData?.filter((item) => {
      const attendanceDate = new Date(item.attendanceDate);
      return attendanceDate >= last30Days;
    });

    // Calculate counts for 'present' and 'absent'
    const present = filteredData?.filter(
      (item) => item.attendance === 'present'
    ).length;
    const absent = filteredData?.filter(
      (item) => item.attendance === 'absent'
    ).length;

    // Calculate percentage of 'present' (based on the days that have attendance records)
    const totalDaysWithData = present + absent;
    const percentage =
      totalDaysWithData > 0 ? (present / totalDaysWithData) * 100 : 0;

    setPresentPercentage(percentage.toFixed(2)); // Round to 2 decimal places
  };

  const fetchData = async () => {
    // Get today's date
    const todayDate = new Date();

    // Get date 31 days ago
    const lastDate = new Date();
    lastDate.setDate(todayDate.getDate() - 31);

    // Format the dates as 'YYYY-MM-DD'
    const todate = todayDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const fromDate = lastDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const response = await getAttendance({ todate, fromDate });
    calculateAttendance(response.attendanceList);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <ImageBackground
      source={BG}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View
        style={[
          styles.viewBox,
          globalStyles.flexrow,
          { justifyContent: 'space-between' },
        ]}
      >
        <View>
          <FastImage
            style={styles.img}
            source={
              presentPercentage <= 35
                ? require('../../../../assets/images/gif/turtle.gif')
                : presentPercentage <= 65
                  ? require('../../../../assets/images/gif/rabbit.gif')
                  : presentPercentage <= 99
                    ? require('../../../../assets/images/gif/horse.gif')
                    : require('../../../../assets/images/gif/happy.gif')
            }
            resizeMode={FastImage.resizeMode.contain}
            priority={FastImage.priority.high} // Set the priority here
          />
        </View>
        <View style={{ width: '80%', marginLeft: 25 }}>
          <GlobalText style={[globalStyles.heading2, { fontWeight: 800 }]}>
            {presentPercentage}%
          </GlobalText>
          <GlobalText style={[globalStyles.text, { color: '#635E57' }]}>
            {t('overall_attendance')}
          </GlobalText>
          <GlobalText
            style={[globalStyles.text, { color: '#1A8825', width: '95%' }]}
          >
            {presentPercentage <= 35
              ? t('attendance_1')
              : presentPercentage <= 65
                ? t('attendance_2')
                : presentPercentage <= 99
                  ? t('attendance_3')
                  : t('attendance_4')}
          </GlobalText>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('FullAttendance');
            }}
            style={[globalStyles.flexrow, { marginTop: 10 }]}
          >
            <GlobalText style={[globalStyles.subHeading, { color: '#0D599E' }]}>
              {t('see_my_full_attendance')}
            </GlobalText>
            <Octicons
              name="arrow-right"
              style={{ marginHorizontal: 10 }}
              color={'#0D599E'}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    borderRadius: 20,
    overflow: 'hidden',
    // borderWidth: 1,
  },
  viewBox: {
    padding: 20,
    justifyContent: 'space-between',
    // backgroundColor: 'rgba(255, 255, 255, 0.5)', // Optional: Add a semi-transparent background to make text readable
    borderRadius: 20,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  img: {
    width: 70,
    height: 70,
  },
});

AttendanceCard.propTypes = {};

export default AttendanceCard;
