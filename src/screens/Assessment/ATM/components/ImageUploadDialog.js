import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
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
}) => {
  const { t } = useTranslation();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const { alertConfig, showDeleteAlert, hideAlert } = useCustomAlert();

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
      confirmText: t('Remove'),
      cancelText: t('Cancel'),
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

  const renderImageItem = (item) => (
    <View key={item.id} style={styles.selectedImageItem}>
      {/* Image preview area - larger touch target */}
      <TouchableOpacity
        style={styles.imagePreviewArea}
        onPress={() => handleImagePress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.imageInfo}>
          <Image
            source={{ uri: item.uri }}
            style={styles.imageIcon}
            resizeMode="cover"
          />
          <GlobalText style={styles.imageFileName} numberOfLines={1}>
            {item.fileName}
          </GlobalText>
        </View>
      </TouchableOpacity>

      {/* Delete button - separate touch target */}
      <TouchableOpacity
        style={styles.deleteButtonContainer}
        onPress={() => handleRemoveImage(item.id, item.fileName)}
        activeOpacity={0.6}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.dialogContainer}>
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.headerContent}>
                    <GlobalText style={styles.headerTitle}>
                      {t('Submit Answers for AI Evaluation')}
                    </GlobalText>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                  >
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
                >
                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={onCameraPress}
                    >
                      <Icon name="device-camera" size={32} color="#1C1B1F" />
                      <GlobalText style={styles.actionButtonText}>
                        {t('Take Photo')}
                      </GlobalText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={onGalleryPress}
                    >
                      <Icon name="image" size={32} color="#1C1B1F" />
                      <GlobalText style={styles.actionButtonText}>
                        {t('Choose from Gallery')}
                      </GlobalText>
                    </TouchableOpacity>
                  </View>

                  {/* Format Information */}
                  <GlobalText style={styles.formatInfo}>
                    {t('Format: jpg, size: 50 MB')}
                    {'\n'}
                    {t('Up to 4 images')}
                  </GlobalText>

                  {/* Selected Images List */}
                  {selectedImages.length > 0 && (
                    <View style={styles.selectedImagesContainer}>
                      {selectedImages.map(renderImageItem)}
                    </View>
                  )}

                  {/* Warning for too many images */}
                  {selectedImages.length > 4 && (
                    <View style={styles.warningContainer}>
                      <GlobalText style={styles.warningText}>
                        {t('You have selected')} {selectedImages.length}{' '}
                        {t('images')}.{' '}
                        {t(
                          'For better performance, we recommend uploading up to 4 images at a time'
                        )}
                        .
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
                        selectedImages.length === 0 &&
                          styles.submitButtonDisabled,
                        isUploading && styles.submitButtonDisabled,
                      ]}
                      onPress={onSubmit}
                      disabled={selectedImages.length === 0 || isUploading}
                    >
                      <GlobalText style={styles.submitButtonText}>
                        {isUploading
                          ? `${t('Uploading')}... ${Math.round(
                              uploadProgress
                            )}%`
                          : t('Submit for Review')}
                      </GlobalText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
    paddingBottom: 80, // Add bottom margin to prevent selected images from going behind the static footer
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
  imageFileName: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F1B13',
    textDecorationLine: 'underline',
    flex: 1,
  },
  deleteButtonContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
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
};

ImageUploadDialog.defaultProps = {
  isUploading: false,
  uploadProgress: 0,
};

export default ImageUploadDialog;
