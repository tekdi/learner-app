import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import globalStyles from '../../../utils/Helper/Style';

import GlobalText from '@components/GlobalText/GlobalText';

const WeeklyCalendar = ({ setDate, postdays }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const flatListRef = useRef(null);

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Generate data for last 7 or next 7 days
  const generateDaysData = () => {
    const daysData = Array.from({ length: 7 }, (_, i) => {
      const currentDate = new Date();
      if (postdays) {
        // If postdays prop is true, calculate the upcoming days
        currentDate.setDate(currentDate.getDate() + i);
      } else {
        // Default: calculate the previous days
        currentDate.setDate(currentDate.getDate() - (6 - i));
      }
      return {
        id: i,
        date: currentDate.getDate(),
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
          currentDate.getDay()
        ],
        exactDate: currentDate,
      };
    });
    return daysData;
  };

  const last30Days = generateDaysData();

  const onDateClick = (item) => {
    // console.log('Selected Date:', formatDate(item.exactDate));
    setSelectedDate(item.date);
    setDate(item?.exactDate);
  };

  const today = new Date();

  useEffect(() => {
    if (flatListRef.current && last30Days && !postdays) {
      flatListRef.current.scrollToIndex({
        index: last30Days.length - 1,
        animated: true,
      });
    }
  }, [last30Days]);

  const getItemLayout = (data, index) => ({
    length: 100,
    offset: 58 * index,
    index,
  });

  const handleScrollToIndexFailed = (info) => {
    console.warn('Failed to scroll to index', info.index);
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: last30Days.length - 1,
        animated: true,
      });
    }
  };

  return (
    <SafeAreaView>
      <FlatList
        ref={flatListRef}
        data={last30Days}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() => onDateClick(item)}
          >
            <GlobalText style={globalStyles.text}>
              {item.date === today.getDate() ? 'Today' : item.day}
            </GlobalText>

            <View
              style={[
                styles.box,
                item.date === selectedDate && styles.selectedBox,
                item.date === today.getDate() && styles.todayBox,
              ]}
            >
              <GlobalText style={[globalStyles.text, { fontSize: 12 }]}>
                {item.date}
              </GlobalText>
            </View>
          </TouchableOpacity>
        )}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  box: {
    padding: 16,
    paddingVertical: 25,
    margin: 5,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#eee',
    width: 50,
  },
  todayBox: {
    backgroundColor: '#FDBE16',
  },
  selectedBox: {
    borderWidth: 1,
  },
});

export default WeeklyCalendar;
