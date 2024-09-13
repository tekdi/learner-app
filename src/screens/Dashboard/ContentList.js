import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TextField from '../../components/TextField/TextField';
import { contentTrackingStatus, courseDetails } from '../../utils/API/ApiCalls';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ProgressBar } from '@ui-kitten/components';
import globalStyles from '../../utils/Helper/Style';
import DownloadCard from '../../components/DownloadCard/DownloadCard';
import { getDataFromStorage } from '../../utils/JsHelper/Helper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../../context/LanguageContext';

const ContentList = ({ route }) => {
  const { t } = useTranslation();
  const { do_id } = route.params;
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [identifiers, setIdentifiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const content_do_id = do_id;
        console.log({ content_do_id });

        // Fetch course details
        const data = await courseDetails(content_do_id);

        // Set courses
        const coursesData = data?.result?.content?.children?.[0]?.children;
        console.log('coursesData', coursesData);

        //setCourses(coursesData);

        updateContentProgress(coursesData);

        // Extract identifiers
        const identifiers_Id = coursesData?.map((course) => course?.identifier);
        setIdentifiers(identifiers_Id);
        console.log({ identifiers_Id });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateContentProgress = async (coursesData) => {
    if (coursesData && coursesData.length > 0) {
      console.log('updateContentProgress calling');
      //get progress details
      let tempCoursesData = coursesData;
      if (tempCoursesData) {
        let userId = await getDataFromStorage('userId');
        let batchId = await getDataFromStorage('cohortId');
        let contentId = [];
        for (let i = 0; i < tempCoursesData.length; i++) {
          contentId.push(tempCoursesData[i]?.identifier);
        }
        //call api
        let api_response = await contentTrackingStatus(
          userId,
          contentId,
          batchId
        );
        if (api_response && api_response?.success === true) {
          for (let i = 0; i < api_response?.data.length; i++) {
            let data_status = api_response.data[i];
            if (data_status?.userId == userId) {
              for (let j = 0; j < data_status?.contents.length; j++) {
                let content = data_status.contents[j];
                let contentId = content?.contentId;
                let percentage = content?.percentage;
                let status = content?.status;
                let foundindex = tempCoursesData.findIndex(
                  (item) => item.identifier === contentId
                );
                tempCoursesData[foundindex].trackPercentage = percentage;
                tempCoursesData[foundindex].trackStatus =
                  status == 'Completed'
                    ? 'completed'
                    : status == 'In_Progress'
                    ? 'Inprogress'
                    : '';
                console.log('contentId', contentId);
                console.log('percentage', percentage);
                console.log('status', status);
                console.log('foundindex', foundindex);
              }
              //console.log('api_response', JSON.stringify(data_status));
            }
          }
        }
      }
      setCourses(tempCoursesData);
    }
  };

  const handlePress = (data) => {
    navigation.navigate('StandAlonePlayer', {
      content_do_id: data?.identifier,
      content_mime_type: data?.mimeType,
      isOffline: false,
    });
  };

  function checkArchiveType(mimeType) {
    //bug fix undefined mimeType
    if (mimeType) {
      if (
        mimeType.includes('ecml-archive') ||
        mimeType.includes('h5p-archive') ||
        mimeType.includes('html-archive')
      ) {
        return 'touch-app';
      } else if (mimeType.includes('pdf') || mimeType.includes('epub')) {
        return 'file-copy';
      } else if (
        mimeType.includes('Webm') ||
        mimeType.includes('mp4') ||
        mimeType.includes('youtube')
      ) {
        return 'play-circle';
      }
    }

    return null; // or any default value you want to return if no conditions are met
  }

  const renderItem = ({ item }) => {
    if (!item?.trackStatus) {
      item.trackStatus = 'not_started';
    }
    return (
      <TouchableOpacity
        onPress={() => {
          handlePress(item);
        }}
      >
        <View style={styles.view}>
          <View style={globalStyles.flexrow}>
            <MaterialIcons
              name={checkArchiveType(item?.mimeType)}
              size={32}
              color="#9cb9ff"
              style={{ flex: 0.8 }}
            />
            <View style={{ flex: 3 }}>
              <Text style={globalStyles.text}>
                <TextField text={item?.name} />(
                <TextField text={item?.mimeType} />)
                <TextField text={'\n'} />
                <Text
                  style={[
                    globalStyles.subHeading,
                    { color: '#7C766F', marginLeft: 10 },
                  ]}
                >
                  {t(item?.trackStatus)}
                </Text>
              </Text>
            </View>
            <DownloadCard
              contentId={item?.identifier}
              contentMimeType={item?.mimeType}
            />
          </View>
          {item?.trackPercentage && (
            <ProgressBar
              style={{ marginTop: 15 }}
              progress={item?.trackPercentage}
              width={'100%'}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 50 }}>
      {/* <Header /> */}
      {loading ? (
        <ActivityIndicator style={{ top: 300 }} />
      ) : (
        <>
          <View style={{ padding: 20 }}>
            <TextField style={globalStyles.heading} text={'course_details'} />
          </View>
          <FlatList
            data={courses}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
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
});

ContentList.propTypes = {
  route: PropTypes.any,
};

export default ContentList;
