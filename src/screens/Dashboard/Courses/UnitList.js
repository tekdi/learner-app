import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  BackHandler,
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
import { ProgressBar } from '@ui-kitten/components';
import globalStyles from '../../../utils/Helper/Style';
import DownloadCard from '../../../components/DownloadCard/DownloadCard';
import SecondaryHeader from '../../../components/Layout/SecondaryHeader';
import FastImage from '@changwoolab/react-native-fast-image';
import UnitCard from './UnitCard';
import ContentCard from '../ContentCard';
import {
  getDataFromStorage,
  logEventFunction,
} from '../../../utils/JsHelper/Helper';

const UnitList = ({ route }) => {
  const { children, name, course_id, unit_id, headingName } = route.params;
  // console.log('########## UnitList');
  // console.log('course_id', course_id);
  // console.log('unit_id', unit_id);
  // console.log('##########');
  const navigation = useNavigation();
  const [coursesContent, setCoursesContent] = useState();
  const [identifiers, setIdentifiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null); // State to track which item is expanded

  //set progress and start date
  const [trackData, setTrackData] = useState([]);

  useEffect(() => {
    const logEvent = async () => {
      const obj = {
        eventName: 'course_content_unit_list',
        method: 'on-view',
        screenName: 'Course-content-unit-list',
      };
      await logEventFunction(obj);
    };
    logEvent();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        navigation.goBack(); // Navigate back to the previous screen
        return true; // Returning true prevents the default behavior (exiting the app)
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      console.log('############ in focus unit list');
      setLoading(true);
      //bug fix for not realtime tracking
      //fetchDataTrack();
      setTimeout(() => {
        // Code to run after 1 second
        fetchDataTrack();
      }, 1000); // 1000 milliseconds = 1 second

      // Clean up the event listener on component unmount
      return () => {
        backHandler.remove();
      };
    }, []) // Make sure to include the dependencies
  );

  // useEffect(() => {
  //   const backAction = () => {
  //     navigation.goBack(); // Navigate back to the previous screen
  //     return true; // Returning true prevents the default behavior (exiting the app)
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction
  //   );

  //   // Clean up the event listener on component unmount
  //   return () => {
  //     backHandler.remove();
  //   };
  // }, [navigation]);

  const fetchDataTrack = async () => {
    //found course progress
    try {
      console.log('########## fetchDataTrack');
      //console.log('########## contentList', contentList);
      let courseList = [course_id];
      //console.log('########## courseList', courseList);
      //get course track data
      let userId = await getDataFromStorage('userId');
      let course_track_data = await courseTrackingStatus(userId, courseList);
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SecondaryHeader />
      {loading ? (
        <ActivityIndicator style={{ top: 300 }} />
      ) : (
        <ScrollView>
          <View style={{ padding: 20 }}>
            {headingName && (
              <Text
                allowFontScaling={false}
                style={[globalStyles.heading, { marginBottom: 10 }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {headingName}
              </Text>
            )}
            <Text
              allowFontScaling={false}
              style={[globalStyles.heading2]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {name}
            </Text>
          </View>
          <View
            style={{
              padding: 20,
              paddingTop: 0,
              // backgroundColor: '#F7ECDF',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}
          >
            {children?.map((item, index) => {
              if (
                item?.mimeType === 'application/vnd.ekstep.content-collection'
              ) {
                return (
                  item?.children.length > 0 && (
                    <UnitCard
                      key={item?.name}
                      item={item}
                      course_id={course_id}
                      unit_id={item?.identifier}
                      TrackData={trackData}
                    />
                  )
                );
              } else {
                return (
                  <ContentCard
                    key={item?.name}
                    index={index}
                    item={item}
                    course_id={course_id}
                    unit_id={unit_id}
                    TrackData={trackData}
                  />
                );
              }
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

UnitList.propTypes = {
  route: PropTypes.any,
};

export default UnitList;
