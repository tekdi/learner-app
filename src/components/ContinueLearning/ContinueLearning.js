import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import debounce from 'lodash.debounce';

import GlobalText from '@components/GlobalText/GlobalText';
import {
  CourseInProgress,
  courseTrackingStatus,
} from '../../utils/API/ApiCalls';
import globalStyles from '../../utils/Helper/Style';
import {
  courseListApi_New,
  courseListApi_testing,
} from '../../utils/API/AuthService';
import CoursesBox from '../CoursesBox/CoursesBox';
import CourseCard from '../CourseCard/CourseCard';
import { useNavigation } from '@react-navigation/native';
import { getDataFromStorage } from '../../utils/JsHelper/Helper';

const ContinueLearning = ({ youthnet, t, userId }) => {
  const [data, setData] = useState([]);
  const [trackData, setTrackData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetch = async () => {
      let course_in_progress = await CourseInProgress(userId);

      let courseData = course_in_progress?.data;

      if (courseData) {
        // console.log(
        //   '########## course_in_progress',
        //   JSON.stringify(courseData)
        // );
        // console.log(
        //   '########## course_in_progress?.[0]?.courseIdList',
        //   courseData?.[0]?.courseIdList
        // );
        if (courseData?.[0]?.courseIdList?.length > 0) {
          let inprogress_do_ids = [];
          for (let i = 0; i < courseData?.[0]?.courseIdList.length; i++) {
            inprogress_do_ids.push(courseData?.[0]?.courseIdList[i]?.courseId);
          }
          // console.log('########## inprogress_do_ids', inprogress_do_ids);
          let userType = await getDataFromStorage('userType');

          const instant =
            userType === 'youthnet'
              ? {
                  frameworkId: 'youthnet-framework',
                  channelId: 'youthnet-channel',
                }
              : userType === 'scp'
                ? { frameworkId: 'scp-framework', channelId: 'scp-channel' }
                : { frameworkId: 'pos-framework', channelId: 'pos-channel' };
          const offset = 0;
          let data = await courseListApi_New({
            inprogress_do_ids,
            instant,
            offset,
          });
          //found course progress
          console.log('data', JSON.stringify(data));

          try {
            // console.log('########## contentListApi');
            const contentList = data?.content;
            //console.log('########## contentList', contentList);
            let courseList = [];
            if (contentList) {
              for (let i = 0; i < contentList.length; i++) {
                courseList.push(contentList[i]?.identifier);
              }
            }
            //console.log('########## courseList', courseList);
            //get course track data
            let course_track_data = await courseTrackingStatus(
              userId,
              courseList
            );
            // console.log(
            //   '########## course_track_data',
            //   JSON.stringify(course_track_data?.data)
            // );
            let courseTrackData = [];
            if (course_track_data?.data) {
              courseTrackData =
                course_track_data?.data.find(
                  (course) => course.userId === userId
                )?.course || [];
            }
            setTrackData(courseTrackData);
            // console.log('########## courseTrackData', courseTrackData);
            // console.log('##########');
          } catch (e) {
            console.log('e', e);
          }
          setData(data?.content || []);
        }
      }
    };
    fetch();
  }, []);

  // console.log('data', JSON.stringify(data));

  const handlePress = (item) => {
    //console.log('Card pressed!', item);
    // console.log('identifier', item?.identifier);
    // console.log('item', item?.leafNodes);
    navigation.navigate('CourseContentList', {
      do_id: item?.identifier,
      course_id: item?.identifier,
      content_list_node: item?.leafNodes,
    });
  };

  const renderItem = ({ item, index }) => (
    <CourseCard
      onPress={() => handlePress(item)}
      appIcon={item?.appIcon}
      index={index}
      cardWidth={260}
      item={item}
      TrackData={trackData}
      navigation={navigation}
    />
  );

  return (
    <View style={styles.searchContainer}>
      <GlobalText style={[globalStyles.heading2, { color: '#06A816' }]}>
        {t('Inprogress')}
      </GlobalText>
      <GlobalText style={[globalStyles.text]}>
        {t('you_have_ongoing').replace('{value}', data?.length)}
      </GlobalText>

      {data.length > 0 ? (
        //
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item?.identifier}
          horizontal={true} // Enable horizontal scrolling
          initialNumToRender={10} // Adjust the number of items to render initially
          maxToRenderPerBatch={10} // Number of items rendered per batch
          windowSize={21} // Controls the number of items rendered around the current index
        />
      ) : (
        <GlobalText style={globalStyles.heading2}>
          {t('no_data_found')}
        </GlobalText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginVertical: 16,
    textAlign: 'center',
    // borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#EDEDED',
  },
});

ContinueLearning.propTypes = {};

export default ContinueLearning;
