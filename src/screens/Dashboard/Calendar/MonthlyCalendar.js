import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from '@ui-kitten/components';
import globalStyles from '../../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';

const MonthlyCalendar = ({
  setEventDate,
  attendance,
  learnerAttendance,
  setModal,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [date, setDate] = useState(new Date());

  const today = new Date();

  useEffect(() => {
    if (learnerAttendance) {
      // console.log('Updated learnerAttendance:', learnerAttendance);
    }
  }, [learnerAttendance]);

  const handleDateSelection = (selectedDate) => {
    const correctedDate = new Date(selectedDate);
    correctedDate.setDate(correctedDate.getDate() + 1); // Adjust if necessary
    setDate(selectedDate);
    setSelectedDate(correctedDate);
    setEventDate(correctedDate);
  };

  const renderDay = (day) => {
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
      return (
        attendanceDate.getDate() === dayNumber &&
        attendanceDate.getMonth() === monthNumber &&
        attendanceDate.getFullYear() === currentDate.getFullYear()
      );
    });

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
        <Text style={[globalStyles.text, { fontSize: 8 }]}>{dayNumber}</Text>
        {dayData &&
          (isPresent ? (
            <Icon name="checkcircleo" size={10} color="green" />
          ) : isAbsent ? (
            <FeatherIcon name="x-circle" size={10} color="red" />
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', // Set container width
    height: 320, // Set container height
  },
  dayBox: {
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 2, // Reduced margin to fit better in smaller size
    height: 35, // Adjusted height to fit in smaller size
    width: 45, // Adjusted width to fit in smaller size
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
