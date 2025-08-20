import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from '@changwoolab/react-native-fast-image';
import { useTranslation } from '../../../context/LanguageContext';
import StatusCard from '../../../components/StatusCard/StatusCard';
import globalStyles from '../../../utils/Helper/Style';
import StatusCardLine from '../../../components/StatusCard/StatusCardLine';
import { getDataFromStorage } from '../../../utils/JsHelper/Helper';
import { getSyncTrackingOfflineCourse } from '../../../utils/API/AuthService';
import unit from '../../../assets/images/png/Unitcard.png';
import book from '../../../assets/images/png/book_open.png';
import LinearGradient from 'react-native-linear-gradient';

import GlobalText from '@components/GlobalText/GlobalText';

const UnitCard = ({ item, course_id, unit_id, TrackData, headingName }) => {
  // console.log('########## UnitCard');
  // console.log('course_id', course_id);
  // console.log('unit_id', unit_id);
  // console.log('item', JSON.stringify(item));
  // console.log('##########');
  const navigation = useNavigation();
  const { t } = useTranslation();
  const handleCardPress = (item) => {
    navigation.push('UnitList', {
      children: item?.children,
      name: item?.name,
      description: item?.description,
      course_id: course_id,
      unit_id: item?.identifier,
      headingName: headingName,
    });
  };

  //set progress and start date
  const [trackCompleted, setTrackCompleted] = useState(0);
  const [trackProgress, setTrackProgress] = useState(0);

  useEffect(() => {
    fetchDataTrack();
  }, [course_id, TrackData]);
  // Recursive function to collect leaf nodes
  const getLeafNodes = (node) => {
    let result = [];

    // If the node has leafNodes, add them to the result array
    if (node.leafNodes) {
      result.push(...node.leafNodes);
    }

    // If the node has children, iterate through them and recursively collect leaf nodes
    if (node.children) {
      node.children.forEach((child) => {
        result.push(...getLeafNodes(child));
      });
    }

    return result;
  };
  const fetchDataTrack = async () => {
    try {
      // console.log('####', item?.children);

      if (TrackData && item?.children) {
        for (let i = 0; i < TrackData.length; i++) {
          if (TrackData[i]?.courseId == course_id) {
            let userId = await getDataFromStorage('userId');
            let offlineTrack = await getSyncTrackingOfflineCourse(
              userId,
              TrackData[i].courseId
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

            //merge offlien and online
            const mergedArray = [
              ...TrackData[i]?.completed_list,
              ...offline_completed,
            ];
            const uniqueArray = [...new Set(mergedArray)];
            let completed_list = uniqueArray;

            //merge offlien and online
            const mergedArray_progress = [
              ...TrackData[i]?.in_progress_list,
              ...offline_in_progress,
            ];
            const uniqueArray_progress = [...new Set(mergedArray_progress)];
            let in_progress_list = uniqueArray_progress;

            //fetch all content in unit
            let unit_content_list = getLeafNodes(item);
            // console.log('########### unit_content_list', unit_content_list);
            let unit_content_completed_list = [];
            if (unit_content_list && completed_list) {
              if (unit_content_list.length > 0 && completed_list.length > 0) {
                for (let ii = 0; ii < unit_content_list.length; ii++) {
                  let temp_item = unit_content_list[ii];
                  if (completed_list.includes(temp_item)) {
                    unit_content_completed_list.push(temp_item);
                  }
                }
                let totalContent = unit_content_list.length;
                let completed = unit_content_completed_list.length;
                let percentageCompleted = (completed / totalContent) * 100;
                percentageCompleted = Math.round(percentageCompleted);
                // console.log('########### completed', completed);
                // console.log('########### leafNodes', totalContent);
                // console.log('########### unit_content_list', unit_content_list);
                // console.log(
                //   '########### percentageCompleted',
                //   percentageCompleted
                // );
                setTrackCompleted(percentageCompleted);
              }
            }
            let unit_content_in_progress_list = [];
            if (unit_content_list && in_progress_list) {
              if (unit_content_list.length > 0 && in_progress_list.length > 0) {
                for (let ii = 0; ii < unit_content_list.length; ii++) {
                  let temp_item = unit_content_list[ii];
                  if (in_progress_list.includes(temp_item)) {
                    unit_content_in_progress_list.push(temp_item);
                  }
                }
                let totalContent = unit_content_list.length;
                let in_progress = unit_content_in_progress_list.length;
                let percentageInProgress = (in_progress / totalContent) * 100;
                percentageInProgress = Math.round(percentageInProgress);
                setTrackProgress(percentageInProgress);
              }
            }
          }
        }
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
      <ImageBackground source={unit} resizeMode="cover">
        <View style={styles.gradient}>
          <View
            style={{
              bottom: 0,
              position: 'absolute',
              width: '100%',
            }}
          >
            <GlobalText
              style={[
                globalStyles.subHeading,
                { color: 'white', marginLeft: 5 },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item?.name}
            </GlobalText>
            {/* <GlobalText
              style={[
                globalStyles.subHeading,
                { color: 'white', marginLeft: 5 },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item?.description}
            </GlobalText> */}
            <StatusCardLine
              status={
                trackCompleted >= 100
                  ? 'completed'
                  : trackCompleted > 0
                  ? 'inprogress'
                  : trackProgress > 0
                  ? 'progress'
                  : 'not_started'
              }
              trackCompleted={trackCompleted}
            />
            {/* <StatusCard
              status={
                trackCompleted >= 100
                  ? 'completed'
                  : trackCompleted > 0
                    ? 'inprogress'
                    : trackProgress > 0
                      ? 'progress'
                      : 'not_started'
              }
              trackCompleted={trackCompleted}
              viewStyle={{
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            /> */}
            <View style={styles.unitCard}>
              <View style={[globalStyles.flexrow]}>
                <Image style={styles.img} source={book} resizeMode="contain" />
                <GlobalText
                  style={[globalStyles.text, { marginLeft: 10 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t('unit')}
                </GlobalText>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    height: 210,
    borderRadius: 20,
    marginVertical: 10,
    overflow: 'hidden', // Ensure content doesn't overflow the card boundaries
    // borderWidth: 1,
  },
  gradient: {
    width: '100%',
    height: '100%',
  },

  unitCard: {
    backgroundColor: '#ECE6F0',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  img: {
    width: 30,
    height: 30,
  },

  downloadView: {
    // top: 0,
    bottom: 70,
  },
});

export default UnitCard;
