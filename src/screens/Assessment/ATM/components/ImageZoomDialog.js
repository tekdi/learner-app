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
      console.log('=== Permission Check Started ===');
      console.log('Platform:', Platform.OS, 'Version:', Platform.Version);

      let permission;

      if (Platform.OS === 'android') {
        // For all Android versions, we need WRITE_EXTERNAL_STORAGE to save to Downloads folder
        permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
        console.log('Using WRITE_EXTERNAL_STORAGE for all Android versions');
      } else {
        // iOS doesn't need special permissions for downloads
        console.log('iOS - no special permissions needed');
        return true;
      }

      console.log('Checking permission:', permission);
      const result = await check(permission);
      console.log('Permission check result:', result);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('Permission unavailable');
          Alert.alert(
            t('permission_unavailable'),
            t('permission_unavailable_message')
          );
          return false;
        case RESULTS.DENIED:
          console.log('Permission denied, requesting...');
          const permissionResult = await request(permission);
          console.log('Permission request result:', permissionResult);
          return permissionResult === RESULTS.GRANTED;
        case RESULTS.LIMITED:
          console.log('Permission limited - returning true');
          return true;
        case RESULTS.GRANTED:
          console.log('Permission already granted');
          return true;
        case RESULTS.BLOCKED:
          console.log('Permission blocked - trying alternative approach');
          // For Android 13+, if permission is blocked, we'll try to use MediaStore API
          if (Platform.Version >= 33) {
            console.log(
              'Android 13+ with blocked permission - will use alternative approach'
            );
            return true; // We'll handle this in the download function
          } else {
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
          }
        default:
          console.log('Unknown permission result:', result);
          return false;
      }
    } catch (error) {
      console.log('Permission check error:', error);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
      return false;
    }
  };

  // Test function to debug download issues
  const testDownloadPath = async () => {
    try {
      console.log('=== Testing Download Path ===');
      const downloadPath = getDownloadPath();
      console.log('Download path:', downloadPath);

      const dirExists = await RNFS.exists(downloadPath);
      console.log('Directory exists:', dirExists);

      if (!dirExists) {
        console.log('Creating test directory...');
        await RNFS.mkdir(downloadPath);
        console.log('Directory created successfully');
      }

      // Test file creation
      const testFile = `${downloadPath}/test.txt`;
      await RNFS.writeFile(testFile, 'Test content', 'utf8');
      console.log('Test file created:', testFile);

      const testFileExists = await RNFS.exists(testFile);
      console.log('Test file exists:', testFileExists);

      // Clean up
      await RNFS.unlink(testFile);
      console.log('Test file cleaned up');

      return true;
    } catch (error) {
      console.log('Test download path error:', error);
      return false;
    }
  };

  const getDownloadPath = () => {
    if (Platform.OS === 'android') {
      // Use Downloads directory for all Android versions to make files visible
      return `${RNFS.DownloadDirectoryPath}/LearnerApp`;
    } else {
      // iOS - use Documents directory
      return `${RNFS.DocumentDirectoryPath}/LearnerApp`;
    }
  };

  // Function to handle Android 13+ downloads to Downloads folder
  const downloadToDownloadsAndroid13 = async (imageUrl, fileName) => {
    try {
      console.log('Using Android 13+ Downloads approach');

      // For Android 13+, we'll download to app's external files first, then copy to Downloads
      const appExternalPath = `${RNFS.ExternalDirectoryPath}/LearnerApp`;
      const downloadsPath = `${RNFS.DownloadDirectoryPath}/LearnerApp`;

      console.log('App external path:', appExternalPath);
      console.log('Downloads path:', downloadsPath);

      // Create app external directory if it doesn't exist
      const appDirExists = await RNFS.exists(appExternalPath);
      if (!appDirExists) {
        console.log('Creating app external directory...');
        await RNFS.mkdir(appExternalPath);
      }

      // Create Downloads directory if it doesn't exist
      const downloadsDirExists = await RNFS.exists(downloadsPath);
      if (!downloadsDirExists) {
        console.log('Creating Downloads directory...');
        await RNFS.mkdir(downloadsPath);
      }

      const tempFilePath = `${appExternalPath}/${fileName}`;
      const finalFilePath = `${downloadsPath}/${fileName}`;

      console.log('Temp file path:', tempFilePath);
      console.log('Final file path:', finalFilePath);

      // Check if file already exists in Downloads
      const fileExists = await RNFS.exists(finalFilePath);
      if (fileExists) {
        const timestamp = new Date().getTime();
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        const ext = fileName.substring(fileName.lastIndexOf('.'));
        fileName = `${nameWithoutExt}_${timestamp}${ext}`;
        const newTempFilePath = `${appExternalPath}/${fileName}`;
        const newFinalFilePath = `${downloadsPath}/${fileName}`;

        console.log('File exists, using new filename:', fileName);

        // Download to temp location
        const downloadResult = await RNFS.downloadFile({
          fromUrl: imageUrl,
          toFile: newTempFilePath,
          background: true,
          discretionary: true,
          progress: (res) => {
            const progressPercent =
              (res.bytesWritten / res.contentLength) * 100;
            console.log(`Downloaded: ${progressPercent.toFixed(2)}%`);
          },
        }).promise;

        console.log('Download result:', downloadResult);

        if (downloadResult.statusCode === 200) {
          // Copy from temp to Downloads
          console.log('Copying file to Downloads...');
          await RNFS.copyFile(newTempFilePath, newFinalFilePath);

          // Verify file was copied
          const fileExistsAfterCopy = await RNFS.exists(newFinalFilePath);
          if (fileExistsAfterCopy) {
            const stats = await RNFS.stat(newFinalFilePath);
            console.log('File stats:', stats);
            console.log('File saved successfully to Downloads folder');

            // Clean up temp file
            await RNFS.unlink(newTempFilePath);

            // Show success message
            Alert.alert(t('download_complete'), t('download_success_message'), [
              { text: t('OK') },
            ]);

            return true;
          } else {
            throw new Error('File was not copied to Downloads');
          }
        } else {
          throw new Error(
            `Download failed with status: ${downloadResult.statusCode}`
          );
        }
      } else {
        // Download to temp location
        const downloadResult = await RNFS.downloadFile({
          fromUrl: imageUrl,
          toFile: tempFilePath,
          background: true,
          discretionary: true,
          progress: (res) => {
            const progressPercent =
              (res.bytesWritten / res.contentLength) * 100;
            console.log(`Downloaded: ${progressPercent.toFixed(2)}%`);
          },
        }).promise;

        console.log('Download result:', downloadResult);

        if (downloadResult.statusCode === 200) {
          // Copy from temp to Downloads
          console.log('Copying file to Downloads...');
          await RNFS.copyFile(tempFilePath, finalFilePath);

          // Verify file was copied
          const fileExistsAfterCopy = await RNFS.exists(finalFilePath);
          if (fileExistsAfterCopy) {
            const stats = await RNFS.stat(finalFilePath);
            console.log('File stats:', stats);
            console.log('File saved successfully to Downloads folder');

            // Clean up temp file
            await RNFS.unlink(tempFilePath);

            // Show success message
            Alert.alert(t('download_complete'), t('download_success_message'), [
              { text: t('OK') },
            ]);

            return true;
          } else {
            throw new Error('File was not copied to Downloads');
          }
        } else {
          throw new Error(
            `Download failed with status: ${downloadResult.statusCode}`
          );
        }
      }
    } catch (error) {
      console.log('Android 13+ download error:', error);
      throw error;
    }
  };

  const downloadImage = async (imageUrl, fileName) => {
    try {
      console.log('Starting download for:', imageUrl);
      console.log('Platform:', Platform.OS, 'Version:', Platform.Version);

      // For Android 13+, use special handling
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        console.log('Using Android 13+ download approach');
        return await downloadToDownloadsAndroid13(imageUrl, fileName);
      }

      const downloadPath = getDownloadPath();
      console.log('Download path:', downloadPath);

      // Create directory if it doesn't exist
      const dirExists = await RNFS.exists(downloadPath);
      console.log('Directory exists:', dirExists);

      if (!dirExists) {
        console.log('Creating directory:', downloadPath);
        await RNFS.mkdir(downloadPath);
      }

      const filePath = `${downloadPath}/${fileName}`;
      console.log('File path:', filePath);

      // Check if file already exists
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) {
        // Generate unique filename
        const timestamp = new Date().getTime();
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        const ext = fileName.substring(fileName.lastIndexOf('.'));
        fileName = `${nameWithoutExt}_${timestamp}${ext}`;
        console.log('File exists, new filename:', fileName);
      }

      const finalFilePath = `${downloadPath}/${fileName}`;
      console.log('Final file path:', finalFilePath);

      // Validate URL
      if (!imageUrl || imageUrl.trim() === '') {
        throw new Error('Invalid image URL');
      }

      console.log('Starting RNFS download...');
      const downloadResult = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: finalFilePath,
        background: true,
        discretionary: true,
        progress: (res) => {
          const progressPercent = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Downloaded: ${progressPercent.toFixed(2)}%`);
        },
      }).promise;

      console.log('Download result:', downloadResult);

      if (downloadResult.statusCode === 200) {
        // Verify file was actually created
        const fileExistsAfterDownload = await RNFS.exists(finalFilePath);
        console.log('File exists after download:', fileExistsAfterDownload);

        if (fileExistsAfterDownload) {
          // Get file stats
          const stats = await RNFS.stat(finalFilePath);
          console.log('File stats:', stats);

          // Show appropriate success message based on platform
          let successMessage;
          if (Platform.OS === 'android') {
            successMessage = t('download_success_message'); // Downloads/LearnerApp
          } else {
            successMessage = 'Image saved to app documents';
          }

          Alert.alert(t('download_complete'), successMessage, [
            { text: t('OK') },
          ]);
          return true;
        } else {
          throw new Error('File was not created after download');
        }
      } else {
        throw new Error(
          `Download failed with status: ${downloadResult.statusCode}`
        );
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
      console.log('=== Download Started ===');
      setIsDownloading(true);

      // Test download path first
      console.log('Testing download path...');
      const pathTest = await testDownloadPath();
      console.log('Path test result:', pathTest);

      if (!pathTest) {
        Alert.alert(
          'Error',
          'Download path test failed. Check console for details.'
        );
        return;
      }

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

      // Check permissions first
      console.log('Checking permissions...');
      const hasPermission = await checkAndRequestPermissions();
      console.log('Permission result:', hasPermission);

      // For Android 13+, even if permission is blocked, we can still proceed
      if (
        !hasPermission &&
        Platform.OS === 'android' &&
        Platform.Version >= 33
      ) {
        console.log(
          'Android 13+ with blocked permission - proceeding with alternative approach'
        );
      } else if (!hasPermission) {
        console.log('Permission denied');
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

      console.log('Calling downloadImage...');
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

          {/* Temporary test button for debugging */}
          {/* <TouchableOpacity
            onPress={testDownloadPath}
            style={styles.headerButton}
          >
            <Icon name="bug" size={20} color="#FF6B6B" />
          </TouchableOpacity> */}

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
