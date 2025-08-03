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

  const checkAndRequestPermissions = async () => {
    try {
      let permission;

      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          // Android 13+ (API 33+)
          permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
        } else {
          // Android 12 and below
          permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
        }
      } else {
        // iOS doesn't need special permissions for downloads
        return true;
      }

      const result = await check(permission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert(
            t('permission_unavailable'),
            t('permission_unavailable_message')
          );
          return false;
        case RESULTS.DENIED:
          const permissionResult = await request(permission);
          return permissionResult === RESULTS.GRANTED;
        case RESULTS.LIMITED:
          return true;
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          Alert.alert(
            t('permission_blocked'),
            t('permission_blocked_message'),
            [
              { text: t('cancel'), style: 'cancel' },
              {
                text: t('open_settings'),
                onPress: () => Linking.openSettings(),
              },
            ]
          );
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.log('Permission check error:', error);
      return false;
    }
  };

  const getDownloadPath = () => {
    if (Platform.OS === 'android') {
      // Use Pictures directory for better organization
      return `${RNFS.DownloadDirectoryPath}/LearnerApp`;
    } else {
      // iOS - use Documents directory
      return `${RNFS.DocumentDirectoryPath}/LearnerApp`;
    }
  };

  const downloadImage = async (imageUrl, fileName) => {
    try {
      const downloadPath = getDownloadPath();

      // Create directory if it doesn't exist
      const dirExists = await RNFS.exists(downloadPath);
      if (!dirExists) {
        await RNFS.mkdir(downloadPath);
      }

      const filePath = `${downloadPath}/${fileName}`;

      // Check if file already exists
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) {
        // Generate unique filename
        const timestamp = new Date().getTime();
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        const ext = fileName.substring(fileName.lastIndexOf('.'));
        fileName = `${nameWithoutExt}_${timestamp}${ext}`;
      }

      const finalFilePath = `${downloadPath}/${fileName}`;

      const downloadResult = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: finalFilePath,
        background: true,
        discretionary: true,
        progress: (res) => {
          const progressPercent = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Downloaded: ${progressPercent}%`);
        },
      }).promise;

      if (downloadResult.statusCode === 200) {
        // For Android, the file should be visible in gallery automatically
        // since we're saving to the Downloads directory

        Alert.alert(t('download_complete'), t('download_success_message'), [
          { text: t('OK') },
        ]);
        return true;
      } else {
        throw new Error(
          `Download failed with status: ${downloadResult.statusCode}`
        );
      }
    } catch (error) {
      console.log('Download error:', error);
      throw error;
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const currentImage = images[currentImageIndex];
      const imageUrl = currentImage.url || currentImage.uri;

      if (!imageUrl) {
        Alert.alert(t('error'), t('no_image_url'));
        return;
      }

      // Check permissions first
      const hasPermission = await checkAndRequestPermissions();
      if (!hasPermission) {
        return;
      }

      // Show download starting message
      Alert.alert(t('downloading'), t('download_starting'));

      // Generate filename from URL or use default
      let fileName = 'image.jpg';
      try {
        const urlParts = imageUrl.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        if (lastPart && lastPart.includes('.')) {
          fileName = lastPart;
        } else {
          // If no extension in URL, try to get it from content-type or use default
          fileName = `pratham_image_${Date.now()}.jpg`;
        }
      } catch (error) {
        fileName = `pratham_image_${Date.now()}.jpg`;
      }

      await downloadImage(imageUrl, fileName);
    } catch (error) {
      console.log('Download error:', error);
      Alert.alert(t('download_failed'), t('download_failed_message'), [
        { text: t('OK') },
      ]);
    } finally {
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
