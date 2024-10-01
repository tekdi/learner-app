import React from 'react';
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

const ContentCard = ({ item, index }) => {
  const navigation = useNavigation();

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
    });
  };

  const mimeType = item?.mimeType?.split('/')[1];

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
        <Text
          style={[styles.cardText, { color: '#000', width: '80%', top: 20 }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.name}
        </Text>
      </TouchableOpacity>
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
