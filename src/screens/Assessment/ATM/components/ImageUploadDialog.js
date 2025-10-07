import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Octicons';
import GlobalText from '@components/GlobalText/GlobalText';
import { useTranslation } from '../../../../context/LanguageContext';
import ATMAssessmentStyles from '../styles/ATMAssessmentStyles';
import ImageUploadHelper from '../utils/ImageUploadHelper';
import ImagePreviewDialog from './ImagePreviewDialog';
import CustomAlert from './CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';

const ImageUploadDialog = ({
  visible,
  onClose,
  onCameraPress,
  onGalleryPress,
  selectedImages,
  onRemoveImage,
  onImagePress,
  onSubmit,
  isUploading,
  uploadProgress,
  isProcessingImages,
  onShowSnackbar,
}) => {
  const { t } = useTranslation();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success'); // 'success' or 'error'
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(true);
  const [instructionsAnimation] = useState(new Animated.Value(1));
  const [hasAutoCollapsed, setHasAutoCollapsed] = useState(false);
  const { alertConfig, showDeleteAlert, hideAlert } = useCustomAlert();

  // Auto-collapse instructions when images are uploaded (only once)
  useEffect(() => {
    if (
      selectedImages.length > 0 &&
      isInstructionsExpanded &&
      !hasAutoCollapsed
    ) {
      setIsInstructionsExpanded(false);
      setHasAutoCollapsed(true);
      Animated.timing(instructionsAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [
    selectedImages.length,
    isInstructionsExpanded,
    instructionsAnimation,
    hasAutoCollapsed,
  ]);

  // Reset auto-collapse flag when all images are removed
  useEffect(() => {
    if (selectedImages.length === 0) {
      setHasAutoCollapsed(false);
    }
  }, [selectedImages.length]);

  // Function to toggle instructions
  const toggleInstructions = () => {
    const newExpandedState = !isInstructionsExpanded;
    setIsInstructionsExpanded(newExpandedState);

    Animated.timing(instructionsAnimation, {
      toValue: newExpandedState ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Function to show snackbar
  const showSnackbar = useCallback((type, message) => {
    console.log('showSnackbar called with:', type, message);
    setSnackbarType(type);
    setSnackbarMessage(message);
    setSnackbarVisible(true);

    // Auto hide after 3 seconds
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 3000);
  }, []);

  // Expose showSnackbar function to parent
  useEffect(() => {
    if (onShowSnackbar) {
      console.log('Passing showSnackbar function to parent');
      onShowSnackbar(showSnackbar);
    }
  }, [onShowSnackbar, showSnackbar]);

  const handleRemoveImage = (imageId, imageName) => {
    showDeleteAlert({
      title: t('Remove Image'),
      message: t('Are you sure you want to remove this image?'),
      onConfirm: () => {
        onRemoveImage(imageId);
      },
      onCancel: () => {
        // Do nothing, alert will close automatically
      },
      confirmText: t('delete'),
      cancelText: t('cancel'),
    });
  };

  const handleImagePress = (item) => {
    setPreviewImage(item);
    setPreviewVisible(true);
  };

  const handleDeleteFromPreview = (imageId) => {
    onRemoveImage(imageId);
    setPreviewVisible(false);
    setPreviewImage(null);
  };

  const handleClosePreview = () => {
    setPreviewVisible(false);
    setPreviewImage(null);
  };

  const renderImageItem = (item, index) => (
    <View key={`${item.id}-${index}`} style={styles.selectedImageItem}>
      {/* Image preview area - larger touch target */}
      <TouchableOpacity
        style={styles.imagePreviewArea}
        onPress={() => handleImagePress(item)}
        activeOpacity={0.7}
        disabled={item.isProcessing}
      >
        <View style={styles.imageInfo}>
          {item.isProcessing ? (
            <View style={styles.imageIconContainer}>
              <ActivityIndicator size="small" color="#1F1B13" />
            </View>
          ) : (
            <Image
              source={{ uri: item.uri }}
              style={styles.imageIcon}
              resizeMode="cover"
            />
          )}
          <GlobalText
            style={[
              styles.imageFileName,
              item.isProcessing && styles.processingFileName,
            ]}
            numberOfLines={1}
          >
            {item.isProcessing
              ? `${item.fileName} (Processing...)`
              : item.fileName}
          </GlobalText>
        </View>
      </TouchableOpacity>

      {/* Delete button - separate touch target */}
      <TouchableOpacity
        style={[
          styles.deleteButtonContainer,
          item.isProcessing && styles.deleteButtonDisabled,
        ]}
        onPress={() => handleRemoveImage(item.id, item.fileName)}
        activeOpacity={0.6}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        disabled={item.isProcessing}
      >
        <View style={styles.deleteButton}>
          <Icon name="trash" size={14} color="#BA1A1A" />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.overlayTouchable} />
          </TouchableWithoutFeedback>

          <View style={styles.dialogContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <GlobalText style={styles.headerTitle}>
                  {t('Submit Answers for AI Evaluation')}
                </GlobalText>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Icon name="x" size={20} color="#4D4639" />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Content */}
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              scrollEventThrottle={16}
              bounces={true}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    (isProcessingImages || isUploading) &&
                      styles.actionButtonDisabled,
                  ]}
                  onPress={onCameraPress}
                  disabled={isProcessingImages || isUploading}
                >
                  {isProcessingImages ? (
                    <ActivityIndicator size="small" color="#1F1B13" />
                  ) : (
                    <Icon name="device-camera" size={32} color="#1C1B1F" />
                  )}
                  <GlobalText
                    style={[
                      styles.actionButtonText,
                      (isProcessingImages || isUploading) &&
                        styles.actionButtonTextDisabled,
                    ]}
                  >
                    {isProcessingImages ? t('Processing...') : t('Take Photo')}
                  </GlobalText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    (isProcessingImages || isUploading) &&
                      styles.actionButtonDisabled,
                  ]}
                  onPress={onGalleryPress}
                  disabled={isProcessingImages || isUploading}
                >
                  {isProcessingImages ? (
                    <ActivityIndicator size="small" color="#1F1B13" />
                  ) : (
                    <Icon name="image" size={32} color="#1C1B1F" />
                  )}
                  <GlobalText
                    style={[
                      styles.actionButtonText,
                      (isProcessingImages || isUploading) &&
                        styles.actionButtonTextDisabled,
                    ]}
                  >
                    {isProcessingImages
                      ? t('Processing...')
                      : t('Choose from Gallery')}
                  </GlobalText>
                </TouchableOpacity>
              </View>

              {/* Format Information */}
              <GlobalText style={styles.formatInfo}>
                {t('Format: jpg, size: 50 MB')}
                {'\n'}
                {t('Up to 20 images')}
              </GlobalText>

              {/* Expandable Instructions */}
              <View style={styles.instructionsContainer}>
                <TouchableOpacity
                  style={styles.instructionsHeader}
                  onPress={toggleInstructions}
                  activeOpacity={0.7}
                >
                  <View style={styles.instructionsHeaderContent}>
                    <GlobalText style={styles.instructionsTitle}>
                      {t('Exam Instructions')}
                    </GlobalText>
                  </View>
                  <Animated.View
                    style={[
                      styles.instructionsArrow,
                      {
                        transform: [
                          {
                            rotate: instructionsAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '180deg'],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Icon name="chevron-down" size={16} color="#1C1B1F" />
                  </Animated.View>
                </TouchableOpacity>

                <Animated.View
                  style={[
                    styles.instructionsContent,
                    {
                      maxHeight: instructionsAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 400],
                      }),
                      opacity: instructionsAnimation,
                    },
                  ]}
                >
                  <View style={styles.instructionsList}>
                    <View style={styles.instructionItem}>
                      <Icon name="check-circle" size={16} color="#4CAF50" />
                      <GlobalText style={styles.instructionText}>
                        {t('Re-verify the image after selection. Once submitted for evaluation, it cannot be resubmitted.')}
                      </GlobalText>
                    </View>
                    <View style={styles.instructionItem}>
                      <Icon name="check-circle" size={16} color="#4CAF50" />
                      <GlobalText style={styles.instructionText}>
                        {t('Take a plain white paper')}
                      </GlobalText>
                    </View>
                    <View style={styles.instructionItem}>
                      <Icon name="check-circle" size={16} color="#4CAF50" />
                      <GlobalText style={styles.instructionText}>
                        {t('Use pen with black or blue ink only')}
                      </GlobalText>
                    </View>
                    <View style={styles.instructionItem}>
                      <Icon name="check-circle" size={16} color="#4CAF50" />
                      <GlobalText style={styles.instructionText}>
                        {t(
                          'Write all the answers, including MCQs and fill-in-the-blanks, on the piece of paper'
                        )}
                      </GlobalText>
                    </View>
                    <View style={styles.instructionItem}>
                      <Icon name="check-circle" size={16} color="#4CAF50" />
                      <GlobalText style={styles.instructionText}>
                        {t(
                          'Use the same numbering system as the question paper; take extra care to write the numbers clearly'
                        )}
                      </GlobalText>
                    </View>
                    <View style={styles.instructionItem}>
                      <Icon name="check-circle" size={16} color="#4CAF50" />
                      <GlobalText style={styles.instructionText}>
                        {t(
                          'Write clearly and make sure the letters do not touch the edges of the page. If a mistake is made, strike it out neatly and write it again'
                        )}
                      </GlobalText>
                    </View>
                  </View>
                </Animated.View>
              </View>

              {/* Selected Images List */}
              {selectedImages.length > 0 && (
                <View style={styles.selectedImagesContainer}>
                  {isProcessingImages && (
                    <View style={styles.processingIndicator}>
                      <ActivityIndicator size="small" color="#1F1B13" />
                      <GlobalText style={styles.processingText}>
                        {t('Processing images...')}
                      </GlobalText>
                    </View>
                  )}
                  {selectedImages.map((item, index) =>
                    renderImageItem(item, index)
                  )}
                </View>
              )}

              {/* Warning for too many images */}
              {selectedImages.length > 20 && (
                <View style={styles.warningContainer}>
                  <GlobalText style={styles.warningText}>
                    {t('You have selected')} {selectedImages.length}{' '}
                    {t('images')}. {t('We recommend uploading up to 20 images')}.
                  </GlobalText>
                </View>
              )}
            </ScrollView>

            {/* Actions Footer */}
            <View style={styles.actions}>
              <View style={styles.actionsDivider} />
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    selectedImages.length === 0 && styles.submitButtonDisabled,
                    isUploading && styles.submitButtonDisabled,
                  ]}
                  onPress={onSubmit}
                  disabled={selectedImages.length === 0 || isUploading}
                >
                  <GlobalText style={styles.submitButtonText}>
                    {isUploading
                      ? `${t('Uploading')}... ${Math.round(uploadProgress)}%`
                      : t('Submit for Review')}
                  </GlobalText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Full-Screen Image Preview Dialog */}
      <ImagePreviewDialog
        visible={previewVisible}
        onClose={handleClosePreview}
        image={previewImage}
        onDelete={handleDeleteFromPreview}
        showDeleteButton={true}
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

      {/* Loading Overlay */}
      {isUploading && (
        <Modal visible={isUploading} transparent={true} animationType="fade">
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              {/* Divider */}
              <View style={styles.loadingDivider} />

              {/* Content */}
              <View style={styles.loadingContent}>
                {/* Logo */}
                <View style={styles.loadingLogo}>
                  <Image
                    source={require('../../../../assets/images/png/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>

                {/* Progress Activity */}
                <View style={styles.progressContainer}>
                  <ActivityIndicator size="large" color="#63605A" />
                </View>

                {/* Text */}
                <View style={styles.loadingTextContainer}>
                  <GlobalText style={styles.loadingText}>
                    {t('Uploading Files')}
                  </GlobalText>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

// Snackbar component rendered at root level
const SnackbarComponent = ({ visible, type, message }) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.snackbarOverlay}>
        <View
          style={[
            styles.snackbar,
            type === 'success' ? styles.snackbarSuccess : styles.snackbarError,
          ]}
        >
          <Icon
            name={type === 'success' ? 'check-circle' : 'alert-circle'}
            size={18}
            color="#FFFFFF"
          />
          <GlobalText style={styles.snackbarText}>{message}</GlobalText>
        </View>
      </View>
    </Modal>
  );
};

const ImageUploadDialogWithSnackbar = (props) => {
  return (
    <>
      <ImageUploadDialog {...props} />
      <SnackbarComponent
        visible={props.snackbarVisible}
        type={props.snackbarType}
        message={props.snackbarMessage}
      />
    </>
  );
};

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    flex: 1,
  },
  dialogContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 64,
  },
  headerContent: {
    flex: 1,
    paddingRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#4D4639',
    lineHeight: 24,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#D0C5B4',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  scrollContent: {
    paddingBottom: 80,
    flexGrow: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    height: 104,
    borderWidth: 1,
    borderColor: '#D0C5B4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#7C766F',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  actionButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#E0E0E0',
  },
  actionButtonTextDisabled: {
    color: '#A0A0A0',
  },
  formatInfo: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#5E5E5E',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  selectedImagesContainer: {
    marginTop: 16,
  },
  selectedImageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DBDBDB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  imagePreviewArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  imageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imageIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
  },
  imageIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFileName: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F1B13',
    textDecorationLine: 'underline',
    flex: 1,
  },
  processingFileName: {
    color: '#7C766F',
    fontStyle: 'italic',
  },
  deleteButtonContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginTop: 16,
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  actions: {
    backgroundColor: '#FFFFFF',
  },
  actionsDivider: {
    height: 1,
    backgroundColor: '#D0C5B4',
  },
  buttonsContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  submitButton: {
    backgroundColor: '#FDBE16',
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  submitButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#4D4639',
    lineHeight: 20,
  },
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  processingText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F1B13',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    width: '80%',
    maxWidth: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
  },
  loadingDivider: {
    height: 1,
    backgroundColor: '#D0C5B4',
    width: '90%',
    marginTop: 16,
    marginBottom: 16,
  },
  loadingContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingLogo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  progressContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingTextContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F1B13',
  },
  snackbar: {
    backgroundColor: '#333333',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    marginHorizontal: 20,
    minHeight: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  snackbarSuccess: {
    backgroundColor: '#006F22',
  },
  snackbarError: {
    backgroundColor: '#BA1A1A',
  },
  snackbarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginLeft: 8,
    flex: 1,
  },
  snackbarOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  instructionsContainer: {
    marginTop: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  instructionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderBottomColor: '#D0C5B4',
  },
  instructionsHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionsIcon: {
    marginRight: 8,
  },
  instructionsTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1C1B1F',
  },
  instructionsArrow: {
    transform: [{ rotate: '0deg' }],
  },
  instructionsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  instructionsList: {
    //
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  instructionText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#5E5E5E',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
};

ImageUploadDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCameraPress: PropTypes.func.isRequired,
  onGalleryPress: PropTypes.func.isRequired,
  selectedImages: PropTypes.array.isRequired,
  onRemoveImage: PropTypes.func.isRequired,
  onImagePress: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isUploading: PropTypes.bool,
  uploadProgress: PropTypes.number,
  isProcessingImages: PropTypes.bool,
  onShowSnackbar: PropTypes.func,
  snackbarVisible: PropTypes.bool,
  snackbarType: PropTypes.string,
  snackbarMessage: PropTypes.string,
};

ImageUploadDialog.defaultProps = {
  isUploading: false,
  uploadProgress: 0,
  isProcessingImages: false,
  snackbarVisible: false,
  snackbarType: 'success',
  snackbarMessage: '',
};

export default ImageUploadDialogWithSnackbar;
