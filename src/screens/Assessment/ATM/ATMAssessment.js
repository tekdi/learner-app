import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../../context/LanguageContext';
import moment from 'moment';
import { getAssessmentAnswerKey } from '../../../utils/API/AuthService';
import {
  capitalizeFirstLetter,
  getDataFromStorage,
  setDataInStorage,
} from '../../../utils/JsHelper/Helper';
import ActiveLoading from '../../LoadingScreen/ActiveLoading';
import RenderHtml from 'react-native-render-html';
import globalStyles from '../../../utils/Helper/Style';
import NetworkAlert from '../../../components/NetworkError/NetworkAlert';
import { useInternet } from '../../../context/NetworkContext';

import GlobalText from '@components/GlobalText/GlobalText';
import SecondaryHeader from '../../../components/Layout/SecondaryHeader';
import download from '../../../assets/images/png/download.png';
import pdficon from '../../../assets/images/png/pdficon.png';
import Config from 'react-native-config';
import RNFS from 'react-native-fs';

// Import new image upload components
import ImageUploadSection from './components/ImageUploadSection';
import ImageUploadDialog from './components/ImageUploadDialog';
import PermissionTestComponent from './components/PermissionTestComponent';
import CustomAlert from './components/CustomAlert';

// Import utilities
import ImageUploadHelper from './utils/ImageUploadHelper';
import ImageAPIService from './utils/ImageAPIService';
import useCustomAlert from './hooks/useCustomAlert';

const ITEMS_PER_PAGE = 10;

const ATMAssessment = ({ route }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const { isConnected } = useInternet();
  const { title, data } = route.params;
  const { height } = Dimensions.get('window');

  const [loading, setLoading] = useState(true);
  const [networkstatus, setNetworkstatus] = useState(true);
  const [downloadIcon, setDownloadIcon] = useState(download);

  // Image upload states
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasUploadedImages, setHasUploadedImages] = useState(false);

  // Custom alert hook
  const { alertConfig, showErrorAlert, showSuccessAlert, hideAlert } =
    useCustomAlert();

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [navigation])
  );

  const fetchData = async () => {
    setLoading(true);
    // const cohort_id = await getDataFromStorage('cohortId');
    // const user_id = await getDataFromStorage('userId');
    // const data = await getAssessmentAnswerKey({
    //   user_id,
    //   cohort_id,
    //   contentId,
    // });
    // handleDownload(data);
    // const OfflineassessmentAnswerKey = JSON.parse(
    //   await getDataFromStorage(`assessmentAnswerKey${contentId}`)
    // );
    // if (OfflineassessmentAnswerKey) {
    //   const finalData = getLastIndexData(OfflineassessmentAnswerKey);
    //   const unanswered = countEmptyResValues(finalData?.score_details);
    //   setUnansweredCount(unanswered);
    //   setScoreData(finalData);
    //   setNetworkstatus(true);
    // } else {
    //   setNetworkstatus(false);
    // }
    setLoading(false);
  };

  const handleDownload = async () => {
    const url = Config.PDF_GENRATE_URL + `?do_id=${data?.identifier}`;
    Linking.openURL(url);
  };

  // Image upload handlers
  const handleUploadPress = () => {
    setShowUploadDialog(true);
  };

  const handleCameraPress = async () => {
    try {
      const capturedImages = await ImageUploadHelper.capturePhoto();
      if (capturedImages.length > 0) {
        const validImages = capturedImages.filter((img) =>
          ImageUploadHelper.validateImage(img)
        );
        if (validImages.length > 0) {
          setSelectedImages((prev) => [...prev, ...validImages]);
          ImageUploadHelper.showImageCountWarning(
            selectedImages.length + validImages.length
          );
        }
      }
    } catch (error) {
      console.error('Camera capture error:', error);
      showErrorAlert({
        title: t('Error'),
        message: t('Failed to capture photo. Please try again.'),
        onOk: () => {},
      });
    }
  };

  const handleGalleryPress = async () => {
    try {
      const selectedImagesFromGallery = await ImageUploadHelper.selectImages();
      if (selectedImagesFromGallery.length > 0) {
        const validImages = selectedImagesFromGallery.filter((img) =>
          ImageUploadHelper.validateImage(img)
        );
        if (validImages.length > 0) {
          setSelectedImages((prev) => [...prev, ...validImages]);
          ImageUploadHelper.showImageCountWarning(
            selectedImages.length + validImages.length
          );
        }
      }
    } catch (error) {
      console.error('Gallery selection error:', error);
      showErrorAlert({
        title: t('Error'),
        message: t('Failed to select images. Please try again.'),
        onOk: () => {},
      });
    }
  };

  const handleRemoveImage = (imageId) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleImagePress = (image) => {
    // Image preview is now handled within the ImageUploadDialog component
    // No additional action needed here
  };

  const handleUploadedImagePress = (image) => {
    navigation.navigate('ImageViewer', { image });
  };

  const handleSubmitImages = async () => {
    if (selectedImages.length === 0) {
      showErrorAlert({
        title: t('No Images'),
        message: t('Please select images to upload.'),
        onOk: () => {},
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await ImageAPIService.uploadImages(
        selectedImages,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      if (ImageAPIService.validateResponse(response)) {
        const uploadedImageData = ImageAPIService.parseUploadedImages(response);
        setUploadedImages(uploadedImageData);
        setSelectedImages([]);
        setHasUploadedImages(true);
        setShowUploadDialog(false); // Close the dialog after successful upload

        showSuccessAlert({
          title: t('Success'),
          message: t('Images uploaded successfully!'),
          onOk: () => {},
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showErrorAlert({
        title: t('Upload Failed'),
        message: t('Failed to upload images. Please try again.'),
        onOk: () => {},
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SecondaryHeader logo />
      {loading ? (
        <ActiveLoading />
      ) : (
        <SafeAreaView style={globalStyles.container}>
          <View style={globalStyles.flexrow}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon
                name="arrow-left"
                style={{ marginHorizontal: 10 }}
                color={'#4D4639'}
                size={30}
              />
            </TouchableOpacity>
            <View>
              <GlobalText style={globalStyles.heading}>
                {t(capitalizeFirstLetter(title))}
              </GlobalText>
              <GlobalText
                style={{
                  fontSize: 14,
                  color: '#7C766F',
                  marginTop: -5,
                }}
              >
                {t('published_on')}
                {': '}
                {moment(data?.lastUpdatedOn).format('DD MMM, YYYY')}
              </GlobalText>
            </View>
          </View>
          {isConnected && (
            <View
              style={{
                backgroundColor: '#ECE6F0',
                borderRadius: 4,
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                borderWidth: 1,
                borderColor: '#D0C5B4',
              }}
            >
              <Image style={styles.img} source={pdficon} resizeMode="contain" />
              <GlobalText
                style={[
                  globalStyles.subHeading,
                  { color: '#000', flexShrink: 1 },
                ]}
                numberOfLines={1}
              >
                {title.replace(/ /g, '_')}.pdf
              </GlobalText>
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={handleDownload}>
                <Image
                  style={styles.img}
                  source={downloadIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Permission Test Component - Remove this after testing */}
          {/* <PermissionTestComponent /> */}

          {/* Image Upload Section */}
          <ImageUploadSection
            onUploadPress={handleUploadPress}
            selectedImagesCount={selectedImages.length}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />

          {/* Submit Button */}
          {selectedImages.length > 0 && (
            <TouchableOpacity
              style={[
                styles.submitButton,
                isUploading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitImages}
              disabled={isUploading}
            >
              <GlobalText style={styles.submitButtonText}>
                {isUploading ? t('Uploading...') : t('Submit Images')}
              </GlobalText>
            </TouchableOpacity>
          )}

          {/* Uploaded Images Grid */}
          {hasUploadedImages && (
            <View style={styles.uploadedImagesContainer}>
              <GlobalText style={styles.uploadedImagesTitle}>
                {t('Uploaded Images')} ({uploadedImages.length})
              </GlobalText>
              <View style={styles.uploadedImagesGrid}>
                {uploadedImages.map((image, index) => (
                  <TouchableOpacity
                    key={image.id || index}
                    style={styles.uploadedImageItem}
                    onPress={() => handleUploadedImagePress(image)}
                  >
                    <Image
                      source={{ uri: image.url || image.uri }}
                      style={styles.uploadedImageThumbnail}
                      resizeMode="cover"
                    />
                    <GlobalText
                      style={styles.uploadedImageName}
                      numberOfLines={1}
                    >
                      {image.fileName}
                    </GlobalText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Upload Dialog */}
          <ImageUploadDialog
            visible={showUploadDialog}
            onClose={() => setShowUploadDialog(false)}
            onCameraPress={handleCameraPress}
            onGalleryPress={handleGalleryPress}
            selectedImages={selectedImages}
            onRemoveImage={handleRemoveImage}
            onImagePress={handleImagePress}
            onSubmit={handleSubmitImages}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />

          {/* Custom Alert Dialog */}
          <CustomAlert
            visible={alertConfig.visible}
            title={alertConfig.title}
            message={alertConfig.message}
            buttons={alertConfig.buttons}
            onDismiss={hideAlert}
            icon={alertConfig.icon}
            iconColor={alertConfig.iconColor}
            showCloseButton={alertConfig.showCloseButton}
          />
        </SafeAreaView>
      )}
      <NetworkAlert
        onTryAgain={fetchData}
        isConnected={networkstatus}
        closeModal={() => {
          setNetworkstatus(!networkstatus);
        }}
      />
    </SafeAreaView>
  );
};

ATMAssessment.propTypes = {
  route: PropTypes.any,
};

const baseStyle = {
  color: '#000',
  fontSize: 14,
  fontFamily: 'Poppins-Regular',
  width: '89%',
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#D0C5B4',
    borderRadius: 10,
    flex: 0.9,
  },
  questionContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  questionText: {
    fontSize: 14,
    color: 'black',
    marginVertical: 5,
    marginRight: 10,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
  },
  img: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
  submitButton: {
    backgroundColor: '#4D4639',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  uploadedImagesContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  uploadedImagesTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  uploadedImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  uploadedImageItem: {
    width: '30%', // Adjust as needed for grid layout
    marginVertical: 5,
    alignItems: 'center',
  },
  uploadedImageThumbnail: {
    width: '100%',
    height: 80,
    borderRadius: 5,
    marginBottom: 5,
  },
  uploadedImageName: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    width: '100%',
  },
});

export default ATMAssessment;
