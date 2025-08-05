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
  Alert,
  PermissionsAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../../../context/LanguageContext';
import GlobalText from '@components/GlobalText/GlobalText';
import RNFS from 'react-native-fs';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import CrossPlatformDownloadHelper from '../utils/CrossPlatformDownloadHelper';

const { width, height } = Dimensions.get('window');

const ImageZoomDialog = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { image, images, currentIndex } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex || 0);
  const [modalVisible, setModalVisible] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleClose = () => {
    setModalVisible(false);
    // Navigate back to the uploaded images screen
    setTimeout(() => {
      navigation.goBack();
    }, 100);
  };

  const downloadImage = async (imageUrl, fileName) => {
    try {
      console.log('Starting cross-platform download for:', imageUrl);
      console.log('Platform:', Platform.OS, 'Version:', Platform.Version);

      // Use the new cross-platform download helper
      const success = await CrossPlatformDownloadHelper.downloadToDownloads(
        imageUrl,
        fileName
      );

      if (success) {
        const successMessage = CrossPlatformDownloadHelper.getSuccessMessage();
        Alert.alert(t('download_complete'), successMessage, [
          { text: t('OK') },
        ]);
        return true;
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.log('Download error:', error);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
      throw error;
    }
  };

  const handleDownload = async () => {
    try {
      console.log('=== Cross-Platform Download Started ===');
      setIsDownloading(true);

      const currentImage = images[currentImageIndex];
      console.log('Current image:', currentImage);

      if (!currentImage) {
        console.log('No current image found');
        Alert.alert(t('error'), 'No image data available');
        return;
      }

      const imageUrl = currentImage.url || currentImage.uri;
      console.log('Image URL:', imageUrl);

      if (!imageUrl) {
        console.log('No image URL available');
        Alert.alert(t('error'), t('no_image_url'));
        return;
      }

      // Show download starting message
      console.log('Showing download starting alert');
      Alert.alert(t('downloading'), t('download_starting'));

      // Generate filename from URL or use default
      let fileName = 'image.jpg';
      try {
        const urlParts = imageUrl.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        console.log('URL parts:', urlParts);
        console.log('Last part:', lastPart);

        if (lastPart && lastPart.includes('.')) {
          fileName = lastPart;
        } else {
          // If no extension in URL, try to get it from content-type or use default
          fileName = `pratham_image_${Date.now()}.jpg`;
        }
      } catch (error) {
        console.log('Error parsing filename:', error);
        fileName = `pratham_image_${Date.now()}.jpg`;
      }

      console.log('Final filename:', fileName);

      console.log('Calling cross-platform download...');
      await downloadImage(imageUrl, fileName);
      console.log('Download completed successfully');
    } catch (error) {
      console.log('=== Download Error ===');
      console.log('Error in handleDownload:', error);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);

      Alert.alert(t('download_failed'), t('download_failed_message'), [
        { text: t('OK') },
      ]);
    } finally {
      console.log('Setting isDownloading to false');
      setIsDownloading(false);
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
            style={[
              styles.headerButton,
              isDownloading && styles.headerButtonDisabled,
            ]}
            disabled={isDownloading}
          >
            <Icon
              name={isDownloading ? 'sync' : 'download'}
              size={24}
              color={isDownloading ? '#CCCCCC' : '#4D4639'}
            />
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
  headerButtonDisabled: {
    backgroundColor: '#F0F0F0',
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
