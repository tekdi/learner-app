import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TextField from '../../../components/TextField/TextField';
import {
  courseDetails,
  courseTrackingStatus,
} from '../../../utils/API/ApiCalls';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CircularProgressBar } from '@ui-kitten/components';
import globalStyles from '../../../utils/Helper/Style';
import DownloadCard from '../../../components/DownloadCard/DownloadCard';
import SecondaryHeader from '../../../components/Layout/SecondaryHeader';
import FastImage from '@changwoolab/react-native-fast-image';
import UnitCard from './UnitCard';

import moment from 'moment';
import { getDataFromStorage } from '../../../utils/JsHelper/Helper';
import { getSyncTrackingOfflineCourse } from '../../../utils/API/AuthService';

const CourseContentList = ({ route }) => {
  const { do_id, course_id, content_list_node } = route.params;
  // console.log('########## CourseContentList');
  // console.log('course_id', course_id);
  // console.log('##########');
  const navigation = useNavigation();
  const [coursesContent, setCoursesContent] = useState();
  const [identifiers, setIdentifiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null); // State to track which item is expanded

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []) // Make sure to include the dependencies
  );

  const fetchData = async () => {
    setLoading(true);
    // const content_do_id = 'do_1141503830938746881180';
    // const content_do_id = 'do_11415396442603520013';
    const content_do_id = do_id;

    // Fetch course details
    const data = await courseDetails(content_do_id);
    // Set courses
    const coursescontent = data?.result?.content;

    // console.log('########## coursescontent');
    // console.log('coursescontent', JSON.stringify(coursescontent));
    // console.log('##########');

    const coursesData = data?.result?.content?.children;
    setCoursesContent(coursescontent);

    // Extract identifiers
    const identifiers_Id = coursesData?.map((course) => course?.identifier);
    setIdentifiers(identifiers_Id);

    setLoading(false);

    console.log('############ in focus');
    setLoading(true);
    fetchDataTrack();
  };

  //set progress and start date
  const [trackData, setTrackData] = useState([]);
  const [trackCompleted, setTrackCompleted] = useState(0);
  const [startedOn, setStartedOn] = useState('');

  const fetchDataTrack = async () => {
    //found course progress
    try {
      console.log('########## contentListApi');
      //console.log('########## contentList', contentList);
      let courseList = [course_id];
      //console.log('########## courseList', courseList);
      //get course track data
      let userId = await getDataFromStorage('userId');
      let batchId = await getDataFromStorage('cohortId');
      let course_track_data = await courseTrackingStatus(
        userId,
        batchId,
        courseList
      );
      //console.log('########## course_track_data', course_track_data?.data);
      let courseTrackData = [];
      if (course_track_data?.data) {
        courseTrackData =
          course_track_data?.data.find((course) => course.userId === userId)
            ?.course || [];
      }
      setTrackData(courseTrackData);
      console.log('########## courseTrackData', courseTrackData);
      console.log('##########');
      setLoading(false); // Ensure to stop loading when data fetch completes
    } catch (e) {
      console.log('e', e);
      setLoading(false); // Stop loading even on error
    }
  };

  useEffect(() => {
    const fetchTrackData = async () => {
      if (trackData && trackData.length > 0) {
        for (let i = 0; i < trackData.length; i++) {
          if (trackData[i]?.courseId == course_id) {
            let userId = await getDataFromStorage('userId');
            let batchId = await getDataFromStorage('cohortId');
            let offlineTrack = await getSyncTrackingOfflineCourse(
              userId,
              batchId,
              trackData[i].courseId
            );
            let offline_in_progress = [];
            let offline_completed = [];
            let lastAccessOn = '';
            // console.log(
            //   '############ offlineTrack',
            //   JSON.stringify(offlineTrack)
            // );
            if (offlineTrack) {
              for (let jj = 0; jj < offlineTrack.length; jj++) {
                let offlineTrackItem = offlineTrack[jj];
                let content_id = offlineTrackItem?.content_id;
                lastAccessOn = offlineTrack[0]?.lastAccessOn;
                //console.log('############ lastAccessOn', lastAccessOn);
                try {
                  let detailsObject = JSON.parse(
                    offlineTrackItem?.detailsObject
                  );
                  let status = 'no_started';
                  for (let k = 0; k < detailsObject.length; k++) {
                    let eid = detailsObject[k]?.eid;
                    if (eid == 'START' || eid == 'INTERACT') {
                      status = 'in_progress';
                    }
                    if (eid == 'END') {
                      status = 'completed';
                    }
                    // console.log(
                    //   '##### detailsObject length',
                    //   detailsObject[k]?.eid
                    // );
                  }
                  if (status == 'in_progress') {
                    offline_in_progress.push(content_id);
                  }
                  if (status == 'completed') {
                    offline_completed.push(content_id);
                  }
                } catch (e) {
                  console.log('e', e);
                }
              }
            }
            // console.log(
            //   '############ offline_in_progress',
            //   offline_in_progress
            // );
            // console.log('############ offline_completed', offline_completed);
            if (trackData[i]?.started_on) {
              let temp_startedOn = trackData[i].started_on;
              const formattedDate =
                moment(temp_startedOn).format('DD MMM YYYY');
              setStartedOn(formattedDate);
              console.log('########### formattedDate', formattedDate);
            } else if (lastAccessOn !== '') {
              //get offlien time
              let temp_startedOn = lastAccessOn;
              const formattedDate =
                moment(temp_startedOn).format('DD MMM YYYY');
              setStartedOn(formattedDate);
              console.log('########### formattedDate', formattedDate);
            }

            //merge offlien and online
            const mergedArray = [
              ...trackData[i]?.completed_list,
              ...offline_completed,
            ];
            const uniqueArray = [...new Set(mergedArray)];
            let completed_list = uniqueArray;

            //get unique completed content list
            let completed = completed_list.length;
            let totalContent = 0;
            if (content_list_node) {
              totalContent = content_list_node.length;
            }
            let percentageCompleted = (completed / totalContent) * 100;
            percentageCompleted = Math.round(percentageCompleted);
            // console.log('########### completed', completed);
            // console.log('########### leafNodes', totalContent);
            // console.log('########### content_list_node', content_list_node);
            // console.log('########### percentageCompleted', percentageCompleted);
            setTrackCompleted(percentageCompleted);
          }
        }
      }
    };
    fetchTrackData();
  }, [trackData]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SecondaryHeader />
      {loading ? (
        <ActivityIndicator style={{ top: 300 }} />
      ) : (
        <ScrollView>
          <View style={{ padding: 20, paddingBottom: 10 }}>
            <Text
              style={[globalStyles.heading, { marginBottom: 10 }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {coursesContent?.name}
            </Text>
            <FastImage
              style={styles.image}
              source={
                coursesContent?.posterImage
                  ? {
                      uri: coursesContent?.posterImage,
                      priority: FastImage.priority.high,
                    }
                  : require('../../../assets/images/png/poster.png')
              }
              resizeMode={FastImage.resizeMode.cover} // Adjust to cover the circular area
            />
            <View style={globalStyles.flexrow}>
              <Text style={[globalStyles.subHeading, { marginVertical: 10 }]}>
                {coursesContent?.description}
              </Text>
            </View>
            <View
              style={[
                globalStyles.flexrow,
                {
                  justifyContent: 'space-between',
                  backgroundColor: '#FFDEA1',
                  paddingHorizontal: 25,
                  paddingVertical: 10,
                  borderRadius: 20,
                },
              ]}
            >
              <View style={globalStyles.flexrow}>
                <TextField style={globalStyles.text} text={'started_on'} />
                <TextField style={globalStyles.text} text={startedOn} />
              </View>
              <View style={globalStyles.flexrow}>
                <View>
                  <CircularProgressBar
                    progress={trackCompleted / 100}
                    style={{ width: 40, height: 40 }}
                    // size="tiny"
                    textStyle={{ fontSize: 10 }}
                  />
                </View>
                <TextField style={globalStyles.text} text={'completed'} />
              </View>
            </View>
          </View>
          <View
            style={{
              padding: 20,
              backgroundColor: '#F7ECDF',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              flexDirection: 'row',
              minHeight: 300,
            }}
          >
            {coursesContent?.children?.map((item) => {
              return (
                <UnitCard
                  key={item?.name}
                  item={item}
                  course_id={course_id}
                  unit_id={item?.identifier}
                  TrackData={trackData}
                />
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    borderWidth: 1,
    padding: 20,
    margin: 10,
    borderRadius: 20,
    backgroundColor: 'white',
    borderColor: '#D0C5B4',
  },
  subview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#e9e8d9',
    marginVertical: 20,
  },
  cardContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  image: {
    height: 200,
  },
});

CourseContentList.propTypes = {
  route: PropTypes.any,
};

export default CourseContentList;
