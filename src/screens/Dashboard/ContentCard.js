import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from '@changwoolab/react-native-fast-image';
import DownloadCard from '../../components/DownloadCard/DownloadCard';
import StatusCardIcon from '../../components/StatusCard/StatusCardIcon';
import globalStyles from '../../utils/Helper/Style';
import { getDataFromStorage } from '../../utils/JsHelper/Helper';
import { getSyncTrackingOfflineCourse } from '../../utils/API/AuthService';

const ContentCard = ({ item, index, course_id, unit_id, TrackData }) => {
  const navigation = useNavigation();
  // console.log('########## ContentCard');
  // console.log('course_id', course_id);
  // console.log('unit_id', unit_id);
  // console.log('##########');

  const backgroundImages = [
    require('../../assets/images/CardBackground/abstract_01.png'),
    require('../../assets/images/CardBackground/abstract_02.png'),
    require('../../assets/images/CardBackground/abstract_03.png'),
    require('../../assets/images/CardBackground/abstract_04.png'),
    require('../../assets/images/CardBackground/abstract_05.png'),
  ];

  const backgroundImage = backgroundImages[index % backgroundImages.length];

  const handlePress = (data) => {
    navigation.navigate('StandAlonePlayer', {
      content_do_id: data?.identifier,
      content_mime_type: data?.mimeType,
      isOffline: false,
      course_id: course_id,
      unit_id: unit_id,
    });
  };

  const mimeType = item?.mimeType?.split('/')[1];

  //set progress and start date
  const [trackStatus, setTrackStatus] = useState('');

  useEffect(() => {
    fetchDataTrack();
  }, [navigation]);

  const fetchDataTrack = async () => {
    try {
      console.log('########### TrackData', TrackData);
      if (TrackData && item?.identifier) {
        for (let i = 0; i < TrackData.length; i++) {
          if (TrackData[i]?.courseId == course_id) {
            let userId = await getDataFromStorage('userId');
            let batchId = await getDataFromStorage('cohortId');
            let offlineTrack = await getSyncTrackingOfflineCourse(
              userId,
              batchId,
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

            //get unique completed content list
            let completed = completed_list.length;

            //check all content
            let content_id = item?.identifier;
            let status = 'notstarted';
            if (in_progress_list.includes(content_id)) {
              status = 'inprogress';
            }
            if (completed_list.includes(content_id)) {
              status = 'completed';
            }
            setTrackStatus(status);
            console.log('########### trackStatus', status);
          }
        }
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.subcard}
        onPress={() => {
          handlePress(item);
        }}
      >
        {/* Background image covering entire card */}
        <FastImage
          style={styles.cardBackgroundImage}
          source={backgroundImage}
          resizeMode={FastImage.resizeMode.cover}
          priority={FastImage.priority.high}
        />

        {/* Content overlaid on top of the image */}
        <View style={styles.overlay}>
          <Text
            allowFontScaling={false}
            style={styles.cardText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {mimeType.toUpperCase()}
          </Text>
        </View>
        <View style={styles.view}>
          <DownloadCard
            name={item?.name}
            contentId={item?.identifier}
            contentMimeType={item?.mimeType}
          />
        </View>
      </TouchableOpacity>
      <View style={[globalStyles.flexrow, { marginVertical: 10 }]}>
        <StatusCardIcon status={trackStatus} />

        <Text
          allowFontScaling={false}
          style={[styles.cardText, { color: '#000' }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    height: 120,
    borderRadius: 20,
    marginVertical: 25,
    // overflow: 'hidden', // Ensure the background image and content stay within the card boundaries
  },
  subcard: {
    height: 120,
    borderRadius: 20,
    overflow: 'hidden', // Ensure content doesn't overflow the card boundaries
  },
  cardBackgroundImage: {
    ...StyleSheet.absoluteFillObject, // Make the background image cover the entire card
    borderRadius: 20,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay for text visibility
    width: 70,
    padding: 5,
    fontSize: 10,
    top: 15,
  },
  cardText: {
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 5,
  },
  view: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    // borderWidth: 1,
    right: 10,
    height: 60,
    top: 20,
  },
});

export default ContentCard;
