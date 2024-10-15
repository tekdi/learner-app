import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
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
  const [coursesContent, setCoursesContent] = useState();
  const [identifiers, setIdentifiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null); // State to track which item is expanded

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const content_do_id = do_id;

        // Fetch course details
        const data = await courseDetails(content_do_id);

        // Set courses
        /*const coursesData = data?.result?.content?.children?.[0]?.children;
        console.log('coursesData', coursesData);

        //setCourses(coursesData);

        updateContentProgress(coursesData);*/

        const coursescontent = data?.result?.content;
        const coursesData = data?.result?.content?.children;
        setCoursesContent(coursescontent);

        // Extract identifiers
        const identifiers_Id = coursesData?.map((course) => course?.identifier);
        setIdentifiers(identifiers_Id);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /*const updateContentProgress = async (coursesData) => {
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
  };*/

  const handlecardPress = (item) => {
    setExpandedItem(expandedItem === item.identifier ? null : item.identifier); // Toggle accordion open/close
  };

  const renderAccordionContent = (item) => {
    return (
      <View>
        {item?.children?.map((card) => (
          <TouchableOpacity
            key={card?.identifier}
            onPress={() => {
              handlePress(card);
            }}
          >
            <View style={styles.view}>
              <View style={globalStyles.flexrow}>
                <MaterialIcons
                  name={checkArchiveType(card?.mimeType)}
                  size={32}
                  color="#9cb9ff"
                  style={{ flex: 0.8 }}
                />
                <View style={{ flex: 3 }}>
                  <Text allowFontScaling={false} style={globalStyles.text}>
                    <TextField text={card?.name} />(
                    <TextField text={card?.mimeType} />)
                  </Text>
                </View>
                <DownloadCard
                  contentId={card?.identifier}
                  contentMimeType={card?.mimeType}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        handlecardPress(item);
      }}
    >
      <View style={styles.view}>
        <View style={styles.subview}>
          <View style={globalStyles.flexrow}>
            <MaterialIcons name="folder" size={32} color="#9cb9ff" />
            <Text
              allowFontScaling={false}
              style={[globalStyles.text, { height: 20, marginLeft: 10 }]}
            >
              {item?.name}
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={32} color="#9cb9ff" />
        </View>

        {expandedItem === item.identifier && renderAccordionContent(item)}
      </View>
    </TouchableOpacity>
  );

  const handlePress = (data) => {
    navigation.navigate('StandAlonePlayer', {
      content_do_id: data?.identifier,
      content_mime_type: data?.mimeType,
      isOffline: false,
      course_id: data?.identifier,
      unit_id: data?.identifier,
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
      } else {
        return 'file-copy';
      }
    }

    return null; // or any default value you want to return if no conditions are met
  }

  /*const renderItem = ({ item }) => {
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
              <Text allowFontScaling={false} style={globalStyles.text}>
                <TextField text={item?.name} />(
                <TextField text={item?.mimeType} />)
                <TextField text={'\n'} />
                <Text allowFontScaling={false}
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
  };*/
  // const renderItem = ({ item }) => (
  //   <TouchableOpacity
  //     onPress={() => {
  //       handlePress(item);
  //     }}
  //   >
  //     <View style={styles.view}>
  //       <View style={globalStyles.flexrow}>
  //         <MaterialIcons
  //           name={checkArchiveType(item?.mimeType)}
  //           size={32}
  //           color="#9cb9ff"
  //           style={{ flex: 0.8 }}
  //         />
  //         <View style={{ flex: 3 }}>
  //           <Text allowFontScaling={false} style={globalStyles.text}>
  //             <TextField text={item?.name} />(
  //             <TextField text={item?.mimeType} />)
  //           </Text>
  //         </View>
  //         <DownloadCard
  //           contentId={item?.identifier}
  //           contentMimeType={item?.mimeType}
  //         />
  //       </View>
  //     </View>
  //   </TouchableOpacity>
  // );

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 50 }}>
      {/* <Header /> */}
      {loading ? (
        <ActivityIndicator style={{ top: 300 }} />
      ) : (
        <>
          <View style={{ padding: 20 }}>
            <TextField style={globalStyles.heading} text={'course_details'} />
            <View style={styles.card}>
              <TextField
                style={[globalStyles.subHeading, { fontWeight: '800' }]}
                text={'the_course_is_relevant_for'}
              />
              <View style={globalStyles.flexrow}>
                <TextField
                  style={globalStyles.text}
                  text={'board_university'}
                />
                <Text
                  allowFontScaling={false}
                  style={[globalStyles.text, { width: '50%' }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {coursesContent?.se_boards}
                </Text>
              </View>
              <View style={globalStyles.flexrow}>
                <TextField style={globalStyles.text} text={'medium'} />
                <Text
                  allowFontScaling={false}
                  style={[globalStyles.text, { width: '50%' }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {coursesContent?.se_mediums}
                </Text>
              </View>
              <View style={globalStyles.flexrow}>
                <TextField style={globalStyles.text} text={'class'} />
                <Text
                  allowFontScaling={false}
                  style={[globalStyles.text, { width: '50%' }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {coursesContent?.se_gradeLevels}
                </Text>
              </View>
              <View style={globalStyles.flexrow}>
                <TextField style={globalStyles.text} text={'user_type'} />
                <Text
                  allowFontScaling={false}
                  style={[globalStyles.text, { width: '50%' }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {coursesContent?.description}
                </Text>
              </View>
              <TextField
                style={[globalStyles.subHeading, { fontWeight: '800' }]}
                text={'description'}
              />
              <Text
                allowFontScaling={false}
                style={[globalStyles.text, { width: '80%' }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {coursesContent?.description}
              </Text>
            </View>
            <View>
              <TextField style={globalStyles.heading} text={'course_modules'} />
            </View>
          </View>
          <FlatList
            data={coursesContent?.children}
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
});

ContentList.propTypes = {
  route: PropTypes.any,
};

export default ContentList;
