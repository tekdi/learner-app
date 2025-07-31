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
  ScrollView,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../../context/LanguageContext';
import moment from 'moment';
import { getAssessmentAnswerKey } from '../../../utils/API/AuthService';
import {
  capitalizeFirstLetter,
  getDataFromStorage,
  getTentantId,
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
  const { title, data, aiQuestionSetStatus } = route.params;
  const { height } = Dimensions.get('window');

  console.log('#########atm aiQuestionSetStatus', aiQuestionSetStatus);

  const [aiQuestionSetNew, setAiQuestionSetNew] = useState(aiQuestionSetStatus);

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
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
      setIsProcessingImages(true);
      const capturedImages = await ImageUploadHelper.capturePhoto();
      if (capturedImages.length > 0) {
        const validImages = capturedImages.filter((img) =>
          ImageUploadHelper.validateImage(img)
        );
        if (validImages.length > 0) {
          // Add processing state to images
          const imagesWithProcessing = validImages.map((img) => ({
            ...img,
            isProcessing: true,
          }));

          setSelectedImages((prev) => [...prev, ...imagesWithProcessing]);

          // Simulate processing completion after a short delay
          setTimeout(() => {
            setSelectedImages((prev) =>
              prev.map((img) =>
                validImages.some((validImg) => validImg.id === img.id)
                  ? { ...img, isProcessing: false }
                  : img
              )
            );
            setIsProcessingImages(false);
          }, 1000);

          ImageUploadHelper.showImageCountWarning(
            selectedImages.length + validImages.length
          );
        } else {
          setIsProcessingImages(false);
        }
      } else {
        setIsProcessingImages(false);
      }
    } catch (error) {
      console.log('Camera capture error:', error);
      setIsProcessingImages(false);
      showErrorAlert({
        title: t('Error'),
        message: t('Failed to capture photo. Please try again.'),
        onOk: () => {},
      });
    }
  };

  const handleGalleryPress = async () => {
    try {
      setIsProcessingImages(true);
      const selectedImagesFromGallery = await ImageUploadHelper.selectImages();
      if (selectedImagesFromGallery.length > 0) {
        const validImages = selectedImagesFromGallery.filter((img) =>
          ImageUploadHelper.validateImage(img)
        );
        if (validImages.length > 0) {
          // Add processing state to images
          const imagesWithProcessing = validImages.map((img) => ({
            ...img,
            isProcessing: true,
          }));

          setSelectedImages((prev) => [...prev, ...imagesWithProcessing]);

          // Simulate processing completion after a short delay
          setTimeout(() => {
            setSelectedImages((prev) =>
              prev.map((img) =>
                validImages.some((validImg) => validImg.id === img.id)
                  ? { ...img, isProcessing: false }
                  : img
              )
            );
            setIsProcessingImages(false);
          }, 1000);

          ImageUploadHelper.showImageCountWarning(
            selectedImages.length + validImages.length
          );
        } else {
          setIsProcessingImages(false);
        }
      } else {
        setIsProcessingImages(false);
      }
    } catch (error) {
      console.log('Gallery selection error:', error);
      setIsProcessingImages(false);
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
      // Step 1: Upload all images to get URLs
      const uploadedUrls = await uploadAllImages(selectedImages);

      if (uploadedUrls.length === 0) {
        throw new Error('Failed to upload images');
      }

      console.log('#########atm uploadedUrls', uploadedUrls);

      // Step 2: Submit for review with uploaded URLs
      const submitResponse = await submitForReview(uploadedUrls);

      console.log('#########atm submitResponse', submitResponse);

      if (submitResponse.success) {
        setSelectedImages([]);
        setHasUploadedImages(true);
        setShowUploadDialog(false);

        // Show success snackbar
        setSnackbarType('success');
        setSnackbarMessage(t('Images are successfully uploaded'));
        setSnackbarVisible(true);

        // Auto hide after 3 seconds
        setTimeout(() => {
          setSnackbarVisible(false);
        }, 3000);
      } else {
        throw new Error('Failed to submit for review');
      }
    } catch (error) {
      console.log('Upload error:', error);

      // Show error snackbar
      setSnackbarType('error');
      setSnackbarMessage(t('Failed to upload images. Please try again.'));
      setSnackbarVisible(true);

      // Auto hide after 3 seconds
      setTimeout(() => {
        setSnackbarVisible(false);
      }, 3000);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      //navigate to the assessment screen
      await setDataInStorage(`isloadassesments`, 'yes');
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    }
  };

  // Function to upload all images and return URLs
  const uploadAllImages = async (images) => {
    const uploadedUrls = [];
    const totalImages = images.length;

    for (let i = 0; i < totalImages; i++) {
      const image = images[i];
      try {
        // Update progress
        const progress = Math.round(((i + 1) / totalImages) * 100);
        setUploadProgress(progress);

        const uploadedUrl = await uploadSingleImage(image);
        if (uploadedUrl) {
          uploadedUrls.push(uploadedUrl);
        }
      } catch (error) {
        console.log(`Failed to upload image ${i + 1}:`, error);
      }
    }

    return uploadedUrls;
  };

  // Function to upload a single image
  const uploadSingleImage = async (image) => {
    try {
      const extension = image.fileName.split('.').pop()?.toLowerCase();
      const fileName = image.fileName.split('.')[0];

      // Step 1: Get Presigned URL
      const middlewareUrl = Config.API_URL;
      const presignedResponse = await fetch(
        `${middlewareUrl}/interface/v1/user/presigned-url?filename=${fileName}&foldername=aiassessments&fileType=.${extension}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!presignedResponse.ok) {
        throw new Error('Failed to get presigned URL');
      }

      const presignedData = await presignedResponse.json();
      const { url, fields } = presignedData.result;

      // Step 2: Prepare form data
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Convert image to file object
      const imageFile = {
        uri: image.uri,
        type: `image/${extension}`,
        name: image.fileName,
      };
      formData.append('file', imageFile);

      // Step 3: Upload to S3
      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('S3 upload failed');
      }

      // Step 4: Construct the uploaded file URL
      const uploadedUrl = `${url}${fields.key}`;
      return uploadedUrl;
    } catch (error) {
      console.log('Single image upload failed:', error);
      throw error;
    }
  };

  // Function to submit for review
  const submitForReview = async (fileUrls) => {
    try {
      const userId = await getDataFromStorage('userId');
      const token = await getDataFromStorage('Accesstoken');
      let tenantId = await getTentantId();

      const submitData = {
        userId: userId,
        questionSetId: data?.identifier,
        // identifier: data?.identifier,
        fileUrls: fileUrls,
      };

      const middlewareUrl = Config.API_URL;

      // Console CURL for debugging
      const curlCommand = `curl -X POST '${middlewareUrl}/interface/v1/tracking/answer-sheet-submissions/create' \\
  -H 'Accept: application/json, text/plain, */*' \\
  -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \\
  -H 'Authorization: Bearer ${token}' \\
  -H 'Content-Type: application/json' \\
  -H 'tenantid: ${tenantId}' \\
  --data-raw '${JSON.stringify(submitData)}'`;

      // console.log('#########atm CURL Command:', curlCommand);

      const response = await fetch(
        middlewareUrl +
          '/interface/v1/tracking/answer-sheet-submissions/create',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            tenantid: tenantId,
          },
          body: JSON.stringify(submitData),
        }
      );

      console.log('#########atm response', JSON.stringify(response));
      if (!response.ok) {
        throw new Error('Submit for review failed');
      }
      const result = await response.json();
      console.log('#########atm result', JSON.stringify(result));
      return { success: true, data: result };
    } catch (error) {
      console.log('#########atm Submit for review failed:', error);
      return { success: false, error };
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
            <View style={{ flex: 1, marginRight: 10 }}>
              <GlobalText
                style={[globalStyles.heading, { flexShrink: 1 }]}
                numberOfLines={2}
              >
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

          {/* Status-based rendering based on aiQuestionSetStatus */}
          {(aiQuestionSetStatus?.status === 'AI Pending' ||
            aiQuestionSetStatus?.status === 'AI Processed') && (
            <ScrollView
              style={styles.successContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.successContentContainer}
            >
              {/* Uploaded Images Info - Only show if record_file exists */}
              {aiQuestionSetStatus?.fileUrls && (
                <TouchableOpacity
                  style={styles.uploadedInfoContainer}
                  onPress={() => {
                    // Navigate to uploaded images view
                    const uploadedImages = Array.isArray(
                      aiQuestionSetStatus.fileUrls
                    )
                      ? aiQuestionSetStatus.fileUrls.map((url, index) => ({
                          id: index,
                          url: url,
                          uri: url,
                          fileName: `Image_${index + 1}.jpg`,
                        }))
                      : [
                          {
                            id: 0,
                            url: aiQuestionSetStatus.fileUrls,
                            uri: aiQuestionSetStatus.fileUrls,
                            fileName: 'Image_1.jpg',
                          },
                        ];

                    navigation.navigate('UploadedImagesScreen', {
                      images: uploadedImages,
                      title: title,
                    });
                  }}
                >
                  <View style={styles.uploadedInfoContent}>
                    <GlobalText style={styles.uploadedCountText}>
                      {Array.isArray(aiQuestionSetStatus.fileUrls)
                        ? `${aiQuestionSetStatus.fileUrls.length} images uploaded`
                        : '1 image uploaded'}
                    </GlobalText>
                    <GlobalText style={styles.uploadedDateText}>
                      {aiQuestionSetStatus?.createdAt
                        ? moment(aiQuestionSetStatus.createdAt).format(
                            'DD MMM, YYYY'
                          )
                        : moment().format('DD MMM, YYYY')}
                    </GlobalText>
                  </View>
                  <Icon name="chevron-right" size={18} color="#1F1B13" />
                </TouchableOpacity>
              )}

              {/* Success Icon */}
              <View style={styles.successIconContainer}>
                <Icon name="check-circle" size={40} color="#1A881F" />
              </View>

              {/* Main Confirmation Text */}
              <GlobalText style={styles.successMainText}>
                {t(
                  'Your answers have been successfully submitted for evaluation'
                )}
              </GlobalText>

              {/* Secondary Information Text */}
              <GlobalText style={styles.successSecondaryText}>
                {t("You'll be notified as soon as the evaluation is complete.")}
              </GlobalText>

              {/* Instructional Text */}
              <GlobalText style={styles.successInstructionText}>
                {t(
                  "In the meantime, make sure you've submitted all required answers correctly. If you face any issues, please reach out to your facilitator."
                )}
              </GlobalText>
            </ScrollView>
          )}

          {aiQuestionSetStatus?.status === 'Approved' && (
            <View style={styles.statusContainer}>
              <View style={styles.statusRow}>
                <Icon name="check-circle" size={18} color="#1F1B13" />
                <GlobalText
                  style={[
                    styles.statusText,
                    { fontFamily: 'Poppins-SemiBold' },
                  ]}
                >
                  Marks:{' '}
                </GlobalText>
                <GlobalText style={styles.statusText}>
                  <GlobalText style={styles.percentageText}>
                    ({data?.totalScore || 0}/{data?.totalMaxScore || 0}){' '}
                    {data?.totalScore && data?.totalMaxScore
                      ? Math.round((data.totalScore / data.totalMaxScore) * 100)
                      : 0}
                    %
                  </GlobalText>
                </GlobalText>
              </View>

              {/* Answer Sheet Component - Direct Display */}
              {aiQuestionSetStatus?.record_answer && (
                <View style={styles.answerSheetContainer}>
                  <View style={styles.answerSheetHeader}>
                    <GlobalText style={styles.answerSheetTitle}>
                      {t('Answer Sheet')}
                    </GlobalText>
                    <View style={styles.answerSheetScore}>
                      <GlobalText style={styles.scoreText}>
                        Score:{' '}
                        {aiQuestionSetStatus.record_answer.totalScore || 0}/
                        {aiQuestionSetStatus.record_answer.totalMaxScore || 0}
                      </GlobalText>
                      <GlobalText style={styles.percentageText}>
                        {aiQuestionSetStatus.record_answer.totalScore &&
                        aiQuestionSetStatus.record_answer.totalMaxScore
                          ? Math.round(
                              (aiQuestionSetStatus.record_answer.totalScore /
                                aiQuestionSetStatus.record_answer
                                  .totalMaxScore) *
                                100
                            )
                          : 0}
                        %
                      </GlobalText>
                    </View>
                  </View>

                  <ScrollView
                    style={styles.answerSheetContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {aiQuestionSetStatus.record_answer.assessmentSummary?.map(
                      (section, sectionIndex) => (
                        <View
                          key={sectionIndex}
                          style={styles.sectionContainer}
                        >
                          <GlobalText style={styles.sectionTitle}>
                            {section.sectionName}
                          </GlobalText>

                          {section.data?.map((question, questionIndex) => (
                            <View
                              key={questionIndex}
                              style={styles.questionContainer}
                            >
                              <View style={styles.questionHeader}>
                                <GlobalText style={styles.questionNumber}>
                                  Q{question.index || questionIndex + 1}
                                </GlobalText>
                                <View style={styles.questionScore}>
                                  <GlobalText style={styles.scoreLabel}>
                                    Score: {question.score}/{question.maxscore}
                                  </GlobalText>
                                  <View
                                    style={[
                                      styles.passIndicator,
                                      {
                                        backgroundColor:
                                          question.pass === 'Yes'
                                            ? '#1A881F'
                                            : '#FF4444',
                                      },
                                    ]}
                                  >
                                    <GlobalText style={styles.passText}>
                                      {question.pass === 'Yes'
                                        ? 'Pass'
                                        : 'Fail'}
                                    </GlobalText>
                                  </View>
                                </View>
                              </View>

                              <GlobalText style={styles.questionTitle}>
                                {question.item?.title?.replace(
                                  /<[^>]*>/g,
                                  ''
                                ) || 'Question'}
                              </GlobalText>

                              {/* MCQ Options */}
                              {question.item?.type === 'MCQ' &&
                                question.item?.params && (
                                  <View style={styles.optionsContainer}>
                                    {question.item.params.map(
                                      (option, optionIndex) => (
                                        <View
                                          key={optionIndex}
                                          style={styles.optionContainer}
                                        >
                                          <View
                                            style={[
                                              styles.optionCircle,
                                              {
                                                backgroundColor:
                                                  question.resvalues?.[0]
                                                    ?.value === option.value
                                                    ? question.pass === 'Yes'
                                                      ? '#1A881F'
                                                      : '#FF4444'
                                                    : '#E5E5E5',
                                              },
                                            ]}
                                          >
                                            <GlobalText
                                              style={styles.optionText}
                                            >
                                              {String.fromCharCode(
                                                65 + optionIndex
                                              )}
                                            </GlobalText>
                                          </View>
                                          <GlobalText
                                            style={styles.optionLabel}
                                          >
                                            {option.value?.body?.replace(
                                              /<[^>]*>/g,
                                              ''
                                            ) || option.value}
                                          </GlobalText>
                                        </View>
                                      )
                                    )}
                                  </View>
                                )}

                              {/* User Answer */}
                              <View style={styles.answerContainer}>
                                <GlobalText style={styles.answerLabel}>
                                  Your Answer:
                                </GlobalText>
                                <GlobalText style={styles.userAnswer}>
                                  {question.resvalues?.[0]?.value ||
                                    question.resvalues?.[0]?.label ||
                                    'No answer provided'}
                                </GlobalText>
                              </View>

                              {/* AI Suggestion */}
                              {question.resvalues?.[0]?.AI_suggestion && (
                                <View style={styles.aiSuggestionContainer}>
                                  <GlobalText style={styles.aiSuggestionLabel}>
                                    AI Suggestion:
                                  </GlobalText>
                                  <GlobalText style={styles.aiSuggestionText}>
                                    {question.resvalues[0].AI_suggestion}
                                  </GlobalText>
                                </View>
                              )}
                            </View>
                          ))}
                        </View>
                      )
                    )}
                  </ScrollView>
                </View>
              )}

              {/* Uploaded Images Info */}
              {aiQuestionSetStatus?.record_file?.fileUrls && (
                <TouchableOpacity
                  style={styles.uploadedInfoContainer}
                  onPress={() => {
                    // Navigate to uploaded images view
                    const uploadedImages = Array.isArray(
                      aiQuestionSetStatus.record_file.fileUrls
                    )
                      ? aiQuestionSetStatus.record_file.fileUrls.map(
                          (url, index) => ({
                            id: index,
                            url: url,
                            uri: url,
                            fileName: `Image_${index + 1}.jpg`,
                          })
                        )
                      : [
                          {
                            id: 0,
                            url: aiQuestionSetStatus.record_file.fileUrls,
                            uri: aiQuestionSetStatus.record_file.fileUrls,
                            fileName: 'Image_1.jpg',
                          },
                        ];

                    navigation.navigate('UploadedImagesScreen', {
                      images: uploadedImages,
                      title: title,
                    });
                  }}
                >
                  <View style={styles.uploadedInfoContent}>
                    <GlobalText style={styles.uploadedCountText}>
                      {Array.isArray(aiQuestionSetStatus.record_file.fileUrls)
                        ? `${aiQuestionSetStatus.record_file.fileUrls.length} images uploaded`
                        : '1 image uploaded'}
                    </GlobalText>
                    <GlobalText style={styles.uploadedDateText}>
                      {aiQuestionSetStatus?.createdAt
                        ? moment(aiQuestionSetStatus.createdAt).format(
                            'DD MMM, YYYY'
                          )
                        : moment().format('DD MMM, YYYY')}
                    </GlobalText>
                  </View>
                  <Icon name="chevron-right" size={18} color="#1F1B13" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {(!aiQuestionSetStatus || !aiQuestionSetStatus.status) && (
            <View style={styles.statusContainer}>
              <View style={styles.statusRow}>
                <Icon name="dash" size={18} color="#1F1B13" />
                <GlobalText style={styles.statusText}>
                  {t('Not Submitted')}
                </GlobalText>
              </View>
            </View>
          )}

          {/* Image Upload Section - Only show when status is undefined or not submitted */}
          {(!aiQuestionSetStatus || !aiQuestionSetStatus.status) && (
            <ImageUploadSection
              onUploadPress={handleUploadPress}
              selectedImagesCount={selectedImages.length}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          )}

          {/* Submit Button */}
          {/* {selectedImages.length > 0 && (
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
          )} */}

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
            isProcessingImages={isProcessingImages}
            onShowSnackbar={setShowSnackbar}
            snackbarVisible={snackbarVisible}
            snackbarType={snackbarType}
            snackbarMessage={snackbarMessage}
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
  statusContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4D4639',
    marginLeft: 8,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  percentageText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1A881F',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  uploadedInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 52,
    marginTop: 8,
  },
  uploadedInfoContent: {
    flex: 1,
  },
  uploadedCountText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F1B13',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  uploadedDateText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#7C766F',
    letterSpacing: 0.5,
    lineHeight: 16,
    marginTop: 2,
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  successContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  successIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 0,
    borderColor: '#1A881F',
    alignSelf: 'center',
    marginTop: 20,
  },
  successMainText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#1F1B13',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  successSecondaryText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1F1B13',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  successInstructionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1F1B13',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.5,
    marginBottom: 30,
  },
  successEvaluationContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  successEvaluationContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  successEvaluationIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#1A881F',
  },
  successEvaluationMainText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#1F1B13',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  marksContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  marksText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F1B13',
    marginRight: 10,
  },
  successEvaluationSecondaryText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#1F1B13',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.5,
    marginBottom: 30,
  },
  answerSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxHeight: 400,
  },
  answerSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  answerSheetTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F1B13',
  },
  answerSheetScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F1B13',
    marginRight: 5,
  },
  answerSheetContent: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F1B13',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  questionContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F1B13',
    marginRight: 10,
  },
  questionScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#7C766F',
    marginRight: 8,
  },
  passIndicator: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  passText: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
  questionTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#1F1B13',
    marginBottom: 8,
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  optionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#1F1B13',
    flex: 1,
  },
  answerContainer: {
    marginTop: 10,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
  },
  answerLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#1F1B13',
    marginBottom: 4,
  },
  userAnswer: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#1F1B13',
    lineHeight: 20,
  },
  aiSuggestionContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#E8F5E8',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#1A881F',
  },
  aiSuggestionLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#1F1B13',
    marginBottom: 4,
  },
  aiSuggestionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#1F1B13',
    lineHeight: 20,
  },
});

export default ATMAssessment;
