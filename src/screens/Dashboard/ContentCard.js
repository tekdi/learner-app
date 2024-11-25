import React, { useEffect, useState } from 'react';
import {
  Button,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from '@changwoolab/react-native-fast-image';
import Icon from 'react-native-vector-icons/Entypo';
import globalStyles from '../../utils/Helper/Style';
import {
  capitalizeFirstLetter,
  getDataFromStorage,
  logEventFunction,
} from '../../utils/JsHelper/Helper';
import { getSyncTrackingOfflineCourse } from '../../utils/API/AuthService';
import LinearGradient from 'react-native-linear-gradient';
import StatusCardLine from '../../components/StatusCard/StatusCardLine';
import pdf from '../../assets/images/png/pdf.png';
import mp4 from '../../assets/images/png/mp4.png';
import html from '../../assets/images/png/html.png';
import doc from '../../assets/images/png/doc.png';
import DownloadModal from './DownloadModal';

import GlobalText from "@components/GlobalText/GlobalText";

const ContentCard = ({ item, index, course_id, unit_id, TrackData }) => {
  const navigation = useNavigation();
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  // console.log('########## ContentCard', item?.identifier);
  console.log('course_id', course_id);
  // console.log('unit_id', unit_id);
  // console.log('##########', TrackData);

  const backgroundImages = [
    require('../../assets/images/CardBackground/abstract_01.png'),
    require('../../assets/images/CardBackground/abstract_02.png'),
    require('../../assets/images/CardBackground/abstract_03.png'),
    require('../../assets/images/CardBackground/abstract_04.png'),
    require('../../assets/images/CardBackground/abstract_05.png'),
  ];

  const backgroundImage = backgroundImages[index % backgroundImages.length];

  const logEvent = async () => {
    const obj = {
      eventName: 'content_played',
      method: 'button_click',
      screenName: 'Content-Player',
    };

    await logEventFunction(obj);
  };

  useEffect(() => {
    logEvent();
  }, []);

  const handlePress = (data) => {
    logEvent();
    navigation.navigate('StandAlonePlayer', {
      content_do_id: data?.identifier || data?.id,
      content_mime_type: data?.mimeType || data?.app,
      isOffline: false,
      course_id: course_id,
      unit_id: unit_id,
    });
  };

  const mimeType = item?.mimeType?.split('/')[1] || item?.app?.split('/')[1];

  // console.log({ mimeType });

  //set progress and start date
  const [trackStatus, setTrackStatus] = useState('');

  useEffect(() => {
    fetchDataTrack();
  }, [navigation]);

  const fetchDataTrack = async () => {
    try {
      //console.log('########### TrackData', TrackData);
      if (TrackData && (item?.identifier || item?.id)) {
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

            //get unique completed content list
            let completed = completed_list.length;

            //check all content
            let content_id = item?.identifier || item?.id;
            let status = 'notstarted';
            if (in_progress_list.includes(content_id)) {
              status = 'inprogress';
            }
            if (completed_list.includes(content_id)) {
              status = 'completed';
            }
            setTrackStatus(status);
            //console.log('########### trackStatus', status);
          }
        }
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  const toggleDrawer = () => setDrawerVisible(!isDrawerVisible);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        handlePress(item);
      }}
    >
      <ImageBackground
        source={
          item?.posterImage
            ? {
                uri: item?.posterImage,
                priority: FastImage.priority.high,
              }
            : backgroundImage
        }
        style={{ borderRadius: 50 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['#00000033', '#000000CC']} // Gradient colors
          start={{ x: 1, y: 0 }} // Gradient starting point
          end={{ x: 1, y: 1.5 }} // Gradient ending point
          style={styles.gradient}
        >
          <View
            style={{
              alignSelf: 'flex-end',
              padding: 5,
              borderRadius: 5,
              backgroundColor: '#1F1B1380',
            }}
          >
            <FastImage
              style={styles.img}
              source={require('../../assets/images/png/cloud_done_green.png')}
              resizeMode={FastImage.resizeMode.contain}
              priority={FastImage.priority.high}
            />
          </View>
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
              numberOfLines={4}
              ellipsizeMode="tail"
            >
              {item?.name}
            </GlobalText>
            <StatusCardLine
            // status={
            //   trackCompleted >= 100
            //     ? 'completed'
            //     : trackCompleted > 0
            //       ? 'inprogress'
            //       : trackProgress > 0
            //         ? 'progress'
            //         : 'not_started'
            // }
            // trackCompleted={trackCompleted}
            />
            <View style={styles.unitCard}>
              <View style={[globalStyles.flexrow]}>
                {mimeType === 'pdf' ? (
                  <Image style={styles.img} source={pdf} resizeMode="contain" />
                ) : mimeType === 'vnd.ekstep.html-archive' ||
                  mimeType == 'vnd.ekstep.h5p-archive' ? (
                  <Image
                    style={styles.img}
                    source={html}
                    resizeMode="contain"
                  />
                ) : mimeType === 'mp4' || mimeType === 'webm' ? (
                  <Image style={styles.img} source={mp4} resizeMode="contain" />
                ) : (
                  <></>
                )}

                <GlobalText
                  style={[globalStyles.text, { marginLeft: 10 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {mimeType === 'x-youtube'
                    ? `YouTube`
                    : mimeType === 'vnd.ekstep.html-archive'
                      ? `Web`
                      : mimeType == 'vnd.ekstep.h5p-archive'
                        ? `H5P`
                        : mimeType == 'vnd.ekstep.h5p-archive'
                          ? `ECML`
                          : mimeType == 'vnd.sunbird.questionset'
                            ? `QUML`
                            : capitalizeFirstLetter(mimeType)}
                </GlobalText>
              </View>
              <TouchableOpacity onPress={toggleDrawer} style={styles.threeDots}>
                <Icon name="dots-three-vertical" size={20} color="#0D599E" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        {isDrawerVisible && (
          <DownloadModal
            setDrawerVisible={setDrawerVisible}
            isDrawerVisible={isDrawerVisible}
            title={item?.name}
          />
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    height: 190,
    borderRadius: 20,
    marginVertical: 25,
    borderWidth: 1,
    overflow: 'hidden', // Ensure the background image and content stay within the card boundaries
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  unitCard: {
    backgroundColor: '#ECE6F0',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    // borderRadius: 20,
  },
  img: {
    width: 30,
    height: 30,
  },
  dot: {
    fontSize: 18,
    color: '#333',
  },
  threeDots: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0, // No margin for the modal
  },
  drawer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ContentCard;
