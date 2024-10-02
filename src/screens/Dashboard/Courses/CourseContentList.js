import React, { useEffect, useState } from 'react';
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
import { courseDetails } from '../../../utils/API/ApiCalls';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CircularProgressBar } from '@ui-kitten/components';
import globalStyles from '../../../utils/Helper/Style';
import DownloadCard from '../../../components/DownloadCard/DownloadCard';
import SecondaryHeader from '../../../components/Layout/SecondaryHeader';
import FastImage from '@changwoolab/react-native-fast-image';
import UnitCard from './UnitCard';

const CourseContentList = ({ route }) => {
  const { do_id, course_id, content_list_node } = route.params;
  const navigation = useNavigation();
  const [coursesContent, setCoursesContent] = useState();
  const [identifiers, setIdentifiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null); // State to track which item is expanded

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // const content_do_id = 'do_1141503830938746881180';
      const content_do_id = do_id;

      // Fetch course details
      const data = await courseDetails(content_do_id);
      // Set courses
      const coursescontent = data?.result?.content;
      const coursesData = data?.result?.content?.children;
      setCoursesContent(coursescontent);

      // Extract identifiers
      const identifiers_Id = coursesData?.map((course) => course?.identifier);
      setIdentifiers(identifiers_Id);

      setLoading(false);
    };

    fetchData();
  }, []);

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
                <TextField style={globalStyles.text} text={'16'} />
              </View>
              <View style={globalStyles.flexrow}>
                <View>
                  <CircularProgressBar
                    progress={0.5}
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
