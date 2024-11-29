import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
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
import { courseListApi_testing } from '../../utils/API/AuthService';
import CoursesBox from '../CoursesBox/CoursesBox';

const ContinueLearning = ({ youthnet, t, userId }) => {
  const [data, setData] = useState([]);
  const [trackData, setTrackData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      let course_in_progress = await CourseInProgress(userId);
      let courseData = course_in_progress?.data;
      if (courseData) {
        console.log(
          '########## course_in_progress',
          JSON.stringify(courseData)
        );
        console.log(
          '########## course_in_progress?.[0]?.courseIdList',
          courseData?.[0]?.courseIdList
        );
        if (courseData?.[0]?.courseIdList) {
          let inprogress_do_ids = [];
          for (let i = 0; i < courseData?.[0]?.courseIdList.length; i++) {
            inprogress_do_ids.push(courseData?.[0]?.courseIdList[i]?.courseId);
          }
          console.log('########## inprogress_do_ids', inprogress_do_ids);
          let data = await courseListApi_testing({ inprogress_do_ids });
          //found course progress
          try {
            console.log('########## contentListApi');
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
            console.log(
              '########## course_track_data',
              JSON.stringify(course_track_data?.data)
            );
            let courseTrackData = [];
            if (course_track_data?.data) {
              courseTrackData =
                course_track_data?.data.find(
                  (course) => course.userId === userId
                )?.course || [];
            }
            setTrackData(courseTrackData);
            console.log('########## courseTrackData', courseTrackData);
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

  const debouncedSearch = useCallback(
    debounce(() => {}, 2000), // Adjust debounce time in milliseconds as needed
    []
  );

  return (
    <View style={styles.searchContainer}>
      <GlobalText style={styles.text}>{t('Continue_Learning')}</GlobalText>
      <SafeAreaView>
        {data.length > 0 ? (
          <CoursesBox
            // title={'Continue_Learning'}
            // description={'Food_Production'}
            style={{ titlecolor: '#06A816' }}
            viewAllLink={() =>
              navigation.navigate('ViewAll', {
                title: 'Continue_Learning',
                data: data,
              })
            }
            ContentData={data}
            TrackData={trackData}
            isHorizontal={true}
          />
        ) : (
          <GlobalText style={globalStyles.heading2}>
            {t('no_data_found')}
          </GlobalText>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    alignSelf: 'center',
    textAlign: 'center',
    // borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#EDEDED',
  },
});

ContinueLearning.propTypes = {};

export default ContinueLearning;
