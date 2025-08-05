import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../../../context/LanguageContext';
import GlobalText from '@components/GlobalText/GlobalText';

const { width, height } = Dimensions.get('window');

const ImageZoomDialog = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { image, images, currentIndex } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex || 0);
  const [modalVisible, setModalVisible] = useState(true);

  const handleClose = () => {
    setModalVisible(false);
    // Navigate back to the uploaded images screen
    setTimeout(() => {
      navigation.goBack();
    }, 100);
  };

  const handleDownload = async () => {
    try {
      const currentImage = images[currentImageIndex];
      const imageUrl = currentImage.url || currentImage.uri;

      if (Platform.OS === 'ios') {
        // For iOS, we can use Linking to open the image in browser for download
        await Linking.openURL(imageUrl);
      } else {
        // For Android, we can also use Linking
        await Linking.openURL(imageUrl);
      }
    } catch (error) {
      console.log('Download error:', error);
    }
  };

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const currentImage = images[currentImageIndex];

  return (
    <Modal
      visible={modalVisible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleDownload}
            style={styles.headerButton}
          >
            <Icon name="download" size={24} color="#4D4639" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
            <Icon name="x" size={24} color="#4D4639" />
          </TouchableOpacity>
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: currentImage.url || currentImage.uri }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Navigation Controls */}
        {images.length > 1 && (
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              onPress={handlePrevious}
              disabled={currentImageIndex === 0}
              style={[
                styles.navButton,
                currentImageIndex === 0 && styles.navButtonDisabled,
              ]}
            >
              <Icon
                name="chevron-left"
                size={24}
                color={currentImageIndex === 0 ? '#CCCCCC' : '#4D4639'}
              />
            </TouchableOpacity>

            <GlobalText style={styles.imageCounter}>
              {currentImageIndex + 1} / {images.length}
            </GlobalText>

            <TouchableOpacity
              onPress={handleNext}
              disabled={currentImageIndex === images.length - 1}
              style={[
                styles.navButton,
                currentImageIndex === images.length - 1 &&
                  styles.navButtonDisabled,
              ]}
            >
              <Icon
                name="chevron-right"
                size={24}
                color={
                  currentImageIndex === images.length - 1
                    ? '#CCCCCC'
                    : '#4D4639'
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  image: {
    width: width - 32,
    height: height * 0.6,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  navButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
  imageCounter: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#4D4639',
  },
});

export default ImageZoomDialog;
