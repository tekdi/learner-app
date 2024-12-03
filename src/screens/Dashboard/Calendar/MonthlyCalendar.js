import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Calendar } from '@ui-kitten/components';
import globalStyles from '../../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import GlobalText from '@components/GlobalText/GlobalText';
import eventcal from '../../../assets/images/png/eventcal.png';

const MonthlyCalendar = ({
  setEventDate,
  attendance,
  learnerAttendance,
  setModal,
  allEventData,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  // console.log({ allEventData });

  const today = new Date();

  const handleDateSelection = (selectedDate) => {
    const correctedDate = new Date(selectedDate);
    correctedDate.setDate(correctedDate.getDate() + 1); // Adjust if necessary
    setDate(selectedDate);
    setSelectedDate(correctedDate);
    setEventDate(correctedDate);
  };

  const getDaysInMonth = (year, month) => {
    const days = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const handleVisibleDateChange = (visibleDate) => {
    const year = visibleDate.getFullYear();
    const month = visibleDate.getMonth();
    const days = getDaysInMonth(year, month);
    console.log({ visibleDate, year });
    console.log(
      'Days in month:',
      days.map((day) => day.toDateString())
    );
  };

  const renderDay = (day) => {
    // console.log('sdfsdfsdsdffdf', allEventData);

    const currentDate = new Date(day.date);
    const dayNumber = currentDate.getDate();
    const monthNumber = currentDate.getMonth();

    const isToday =
      dayNumber === today.getDate() &&
      monthNumber === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();

    const isSelected =
      date &&
      dayNumber === date.getDate() &&
      monthNumber === date.getMonth() &&
      currentDate.getFullYear() === date.getFullYear();

    const dayData = learnerAttendance?.find((item) => {
      const attendanceDate = new Date(item.attendanceDate);
      // console.log({ attendanceDate });

      return (
        attendanceDate.getDate() === dayNumber &&
        attendanceDate.getMonth() === monthNumber &&
        attendanceDate.getFullYear() === currentDate.getFullYear()
      );
    });
    const eventDates = allEventData?.find((item) => {
      const eventDate = new Date(item);
      // console.log('sdasdsad', eventDate);

      return (
        eventDate.getDate() === dayNumber &&
        eventDate.getMonth() === monthNumber &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
    const isEvent = eventDates || null;
    console.log({ isEvent });

    const isPresent = dayData?.attendance === 'present';
    const isAbsent = dayData?.attendance === 'absent';

    return (
      <View
        style={[
          styles.dayBox,
          isToday ? styles.today : null,
          isSelected ? styles.selected : null,
        ]}
      >
        <GlobalText style={[globalStyles.text, { fontSize: 14 }]}>
          {dayNumber}
        </GlobalText>
        {dayData &&
          (isPresent ? (
            <Icon name="checkcircleo" size={15} color="green" />
          ) : isAbsent ? (
            <FeatherIcon name="x-circle" size={15} color="red" />
          ) : null)}
        {eventDates &&
          (isEvent ? (
            <Image source={eventcal} style={{ width: 20, height: 20 }} />
          ) : null)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        date={date}
        onSelect={handleDateSelection}
        style={styles.calendar}
        renderDay={renderDay}
        min={new Date(2000, 0, 1)} // Set minimum date to Jan 1, 2000
        max={new Date(2030, 11, 31)} // Set maximum date to Dec 31, 2030
        boundingMonth={false}
        onVisibleDateChange={handleVisibleDateChange} // Triggered when the calendar view changes
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', // Set container width
    height: 420, // Set container height
  },
  dayBox: {
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 2, // Reduced margin to fit better in smaller size
    height: 55, // Adjusted height to fit in smaller size
    width: 42, // Adjusted width to fit in smaller size
  },
  today: {
    backgroundColor: '#FDBE16',
  },
  selected: {
    borderWidth: 1,
    borderColor: 'black',
  },
  calendar: {
    width: '100%',
    height: '100%', // Ensure calendar takes full size of container
    backgroundColor: 'white',
  },
});

export default MonthlyCalendar;
