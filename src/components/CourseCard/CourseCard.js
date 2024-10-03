import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from '@changwoolab/react-native-fast-image';
import globalStyles from '../../utils/Helper/Style';
import { ProgressBar } from '@ui-kitten/components';
import StatusCard from '../StatusCard/StatusCard';

import moment from 'moment';

const CourseCard = ({
  onPress,
  style,
  setCardWidth,
  index,
  item,
  appIcon,
  TrackData,
  navigation,
}) => {
  const { width } = Dimensions.get('window');
  const cardWidth = setCardWidth;

  const backgroundImages = [
    require('../../assets/images/CardBackground/abstract_01.png'),
    require('../../assets/images/CardBackground/abstract_02.png'),
    require('../../assets/images/CardBackground/abstract_03.png'),
    require('../../assets/images/CardBackground/abstract_04.png'),
    require('../../assets/images/CardBackground/abstract_05.png'),
  ];

  const backgroundImage = backgroundImages[index % backgroundImages.length];

  // console.log('identifier', item?.identifier);
  // console.log('item', item?.leafNodes);

  //set progress and start date
  const [trackCompleted, setTrackCompleted] = useState(0);
  const [startedOn, setStartedOn] = useState('');

  useEffect(() => {
    fetchDataTrack();
  }, [navigation]);

  const fetchDataTrack = async () => {
    try {
      if (TrackData) {
        for (let i = 0; i < TrackData.length; i++) {
          if (TrackData[i]?.courseId == item?.identifier) {
            if (TrackData[i]?.started_on) {
              let temp_startedOn = TrackData[i].started_on;
              const formattedDate =
                moment(temp_startedOn).format('DD MMM YYYY');
              setStartedOn(formattedDate);
              // console.log('########### formattedDate', formattedDate);
            }
            let completed = TrackData[i]?.completed;
            let totalContent = 0;
            if (item?.leafNodes) {
              totalContent = item?.leafNodes.length;
            }
            let percentageCompleted = (completed / totalContent) * 100;
            percentageCompleted = Math.round(percentageCompleted);
            // console.log('########### completed', completed);
            // console.log('########### leafNodes', totalContent);
            // console.log('########### item?.leafNodes', item?.leafNodes);
            // console.log('########### percentageCompleted', percentageCompleted);
            setTrackCompleted(percentageCompleted);
          }
        }
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  TrackData;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        style,
        { width: cardWidth, backgroundColor: 'transparent' },
      ]}
    >
      <View style={styles.cardBackground}>
        <FastImage
          style={styles.cardBackgroundImage}
          source={backgroundImage}
          resizeMode={FastImage.resizeMode.cover}
          priority={FastImage.priority.high}
        />
        <View style={styles.downloadView}>
          <StatusCard
            status={
              trackCompleted == 0
                ? 'not_started'
                : trackCompleted > 100
                ? 'completed'
                : 'inprogress'
            }
            trackCompleted={trackCompleted}
          />
        </View>
      </View>
      <View style={styles.name}>
        <Text
          style={[globalStyles.text, { width: '80%', fontWeight: 700 }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item?.name}
        </Text>
        <Text
          style={[globalStyles.text, { width: '80%', marginVertical: 10 }]}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {item?.description}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    margin: 10,
  },
  cardBackground: {
    width: '100%',
    height: 70,
    borderRadius: 8,
    // overflow: 'hidden',
  },
  cardBackgroundImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },

  cardTitle: {
    width: '80%',
    height: 60,
    position: 'absolute',
    zIndex: 1,
    top: 15,
    left: 0, // Adjust this to align with the card's left padding
    justifyContent: 'center', // Center text vertically
  },
  cardTitleImage: {
    width: '100%',
    height: '50%',
    position: 'absolute',
  },
  cardTitleText: {
    width: '50%',
    position: 'absolute',
    top: '30%', // Center vertically within the title image
    left: '10%', // Align with some margin from the left
    fontSize: 16,
    color: '#fff', // Assuming the text should be white on the image
    zIndex: 2, // Ensure the text is above the image
    textAlign: 'left', // Align text to the left
  },
  circleContainer: {
    width: 50, // Adjust size for the circle
    height: 50, // Adjust size for the circle
    borderRadius: 25, // Half of width/height to make it a circle
    overflow: 'hidden', // Ensure the image stays within the circular container
    borderWidth: 1,
    borderColor: '#ccc',
    alignSelf: 'flex-end',
    top: '-15%',
    right: 5,
  },
  view: {
    width: '100%',
    height: '50%',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  grassImage: {
    width: '100%',
    height: 60,
    alignSelf: 'flex-end',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    width: '100%',
    // borderWidth: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  downloadView: {
    // top: 0,
    bottom: 70,
  },
  img: {
    width: 30,
    height: 30,
    top: 5,
  },
});

CourseCard.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.object,
  setCardWidth: PropTypes.any,
  index: PropTypes.any,
  item: PropTypes.any,
  appIcon: PropTypes.any,
};

export default CourseCard;
