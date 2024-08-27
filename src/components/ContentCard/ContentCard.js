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

const ContentCard = ({ onPress, style, title, description, appIcon }) => {
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 60) / 2; // Adjust width based on screen size and desired spacing
  const [downloadIcon, setDownloadIcon] = useState(download);

  const handleDownload = () => {
    setDownloadIcon(download_inprogress);
    setTimeout(() => {
      setDownloadIcon(download_complete);
    }, 1000);
  };

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        style,
        { width: cardWidth, backgroundColor: 'transparent' },
      ]}
    >
      <Text style={styles.title}>
        <Text style={{ fontWeight: '500' }}>Name:</Text> {title}
      </Text>
      <Text style={styles.description}>
        <Text style={{ fontWeight: '500' }}>mime-Type:</Text> {description}
      </Text>

      <View style={styles.view}>
        <TouchableOpacity onPress={handleDownload}>
          <Image
            style={styles.img}
            source={downloadIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <FastImage
          style={styles.image}
          source={
            appIcon
              ? { uri: appIcon, priority: FastImage.priority.high }
              : require('../../assets/images/png/book.png')
          }
          resizeMode={FastImage.resizeMode.cover}
          priority={FastImage.priority.high} // Set the priority here
        />
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
    justifyContent: 'center',
    borderWidth: 1,
    margin: 10,
  },
  title: {
    fontSize: 14,
    // fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
    width: '100%',
  },
  description: {
    fontSize: 12,
    // textAlign: 'center',
    color: '#000',
    // borderWidth: 1,
    width: '100%',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  img: {
    width: 25,
    height: 25,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    top: 20,
  },
});

ContentCard.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  style: PropTypes.object,
  description: PropTypes.string,
};

export default ContentCard;
