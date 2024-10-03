import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FastImage from '@changwoolab/react-native-fast-image';
import { useTranslation } from '../../../context/LanguageContext';
import StatusCardIcon from '../../../components/StatusCard/StatusCardIcon';
import globalStyles from '../../../utils/Helper/Style';
import StatusCard from '../../../components/StatusCard/StatusCard';

const UnitCard = ({ item, course_id, unit_id, TrackData }) => {
  // console.log('########## UnitCard');
  // console.log('course_id', course_id);
  // console.log('unit_id', unit_id);
  // console.log('item', JSON.stringify(item));
  // console.log('##########');
  const navigation = useNavigation();
  const { t } = useTranslation();
  const handleCardPress = (item) => {
    navigation.navigate('UnitList', {
      children: item?.children,
      name: item?.name,
      course_id: course_id,
      unit_id: item?.identifier,
    });
  };

  //set progress and start date
  const [trackCompleted, setTrackCompleted] = useState(0);

  useEffect(() => {
    fetchDataTrack();
  }, [course_id]);
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
      if (TrackData && item?.children) {
        for (let i = 0; i < TrackData.length; i++) {
          if (TrackData[i]?.courseId == course_id) {
            //fetch all content in unit
            let unit_content_list = getLeafNodes(item);
            // console.log('########### unit_content_list', unit_content_list);
            let completed_list = TrackData[i]?.completed_list;
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
        onPress={() => handleCardPress(item)}
      >
        {/* Background image */}
        <FastImage
          style={styles.cardBackgroundImage}
          source={require('../../../assets/images/png/Unit.png')}
          resizeMode={FastImage.resizeMode.cover}
          priority={FastImage.priority.high}
        />
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
        {/* Content overlay */}
        <View style={styles.overlay}>
          <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">
            {t('unit')}
          </Text>
        </View>
      </TouchableOpacity>
      <View
        style={[globalStyles.flexrow, { marginLeft: 20, marginVertical: 10 }]}
      >
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
    margin: 5,
    overflow: 'hidden', // Ensure content doesn't overflow the card boundaries
  },
  cardBackgroundImage: {
    ...StyleSheet.absoluteFillObject, // Makes the background image cover the entire card
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
    textAlign: 'center',
  },
  downloadView: {
    // top: 0,
    bottom: 70,
  },
});

export default UnitCard;
