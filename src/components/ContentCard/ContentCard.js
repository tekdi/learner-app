import React, { useState } from 'react';
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
import download from '../../assets/images/png/download.png';
import download_inprogress from '../../assets/images/png/download_inprogress.png';
import download_complete from '../../assets/images/png/download_complete.png';
import globalStyles from '../../utils/Helper/Style';
import { ProgressBar } from '@ui-kitten/components';

const ContentCard = ({
  onPress,
  style,
  setCardWidth,
  index,
  item,
  appIcon,
}) => {
  const { width } = Dimensions.get('window');
  const cardWidth = (width - setCardWidth) / 2;
  const [downloadIcon, setDownloadIcon] = useState(download);

  const handleDownload = () => {
    setDownloadIcon(download_inprogress);
    setTimeout(() => {
      setDownloadIcon(download_complete);
    }, 1000);
  };

  const backgroundImages = [
    require('../../assets/images/CardBackground/abstract_01.png'),
    require('../../assets/images/CardBackground/abstract_02.png'),
    require('../../assets/images/CardBackground/abstract_03.png'),
    require('../../assets/images/CardBackground/abstract_04.png'),
    require('../../assets/images/CardBackground/abstract_05.png'),
  ];

  const backgroundImage = backgroundImages[index % backgroundImages.length];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        style,
        { width: cardWidth, backgroundColor: 'transparent' },
      ]}
    >
      <View style={styles.cardTitle}>
        <FastImage
          style={styles.cardTitleImage}
          source={require('../../assets/images/png/cardtitle.png')}
          resizeMode={FastImage.resizeMode.cover}
          priority={FastImage.priority.high}
        />
        <Text
          style={styles.cardTitleText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.primaryCategory}
        </Text>
      </View>
      <View style={styles.cardBackground}>
        <FastImage
          style={styles.cardBackgroundImage}
          source={backgroundImage}
          resizeMode={FastImage.resizeMode.cover}
          priority={FastImage.priority.high}
        />
      </View>
      <View style={styles.circleContainer}>
        <FastImage
          style={styles.image}
          source={
            appIcon
              ? { uri: appIcon, priority: FastImage.priority.high }
              : require('../../assets/images/png/book.png')
          }
          resizeMode={FastImage.resizeMode.cover} // Adjust to cover the circular area
          priority={FastImage.priority.high}
        />
      </View>
      <View style={styles.name}>
        <Text
          style={[globalStyles.text, { width: '60%' }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.name}
        </Text>
      </View>
      <Text
        style={[
          globalStyles.text,
          {
            width: '60%',
            alignSelf: 'flex-start',
            backgroundColor: '#e0f5ea',
            paddingHorizontal: 5,
            color: '#008840',
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {item?.orgDetails?.orgName}
      </Text>

      <View style={styles.downloadView}>
        <ProgressBar progress={0.3} width={100} />
        <TouchableOpacity onPress={handleDownload}>
          <Image
            style={styles.img}
            source={downloadIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 180,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    margin: 10,
  },
  cardBackground: {
    width: '100%',
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
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
    height: '100%',
    // borderWidth: 1,
    position: 'absolute',
    alignItems: 'flex-start',
    justifyContent: 'center',
    top: 20,
  },
  downloadView: {
    flexDirection: 'row',
    bottom: 15,
    // borderWidth: 1,
    alignItems: 'flex-end',
    width: '100%',
    justifyContent: 'space-between',
  },
  img: {
    width: 30,
    height: 30,
    top: 5,
  },
});

ContentCard.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.object,
  setCardWidth: PropTypes.any,
  index: PropTypes.any,
  item: PropTypes.any,
  appIcon: PropTypes.any,
};

export default ContentCard;
