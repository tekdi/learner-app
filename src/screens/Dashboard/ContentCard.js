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
      if (TrackData && item?.identifier) {
        for (let i = 0; i < TrackData.length; i++) {
          if (TrackData[i]?.courseId == course_id) {
            //check all content
            let content_id = item?.identifier;
            let completed_list = TrackData[i]?.completed_list;
            let status = 'notstarted';
            if (completed_list.includes(content_id)) {
              status = 'completed';
            }
            let in_progress_list = TrackData[i]?.in_progress_list;
            if (in_progress_list.includes(content_id)) {
              status = 'inprogress';
            }
            setTrackStatus(status);
            // console.log('########### trackStatus', status);
          }
        }
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.card}
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
          <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">
            {mimeType.toUpperCase()}
          </Text>
        </View>
        <View style={styles.view}>
          <DownloadCard
            contentId={item?.identifier}
            contentMimeType={item?.mimeType}
          />
        </View>
      </TouchableOpacity>
      <View
        style={[globalStyles.flexrow, { marginLeft: 0, marginVertical: 0 }]}
      >
        <StatusCardIcon status={trackStatus} />
        <Text
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
    width: 160,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#EAC16C',
    marginVertical: 15,
    // overflow: 'hidden', // Ensure the background image and content stay within the card boundaries
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
  },
});

export default ContentCard;
