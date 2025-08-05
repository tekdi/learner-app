import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Octicons';
import GlobalText from '@components/GlobalText/GlobalText';
import { useTranslation } from '../../../../context/LanguageContext';
import CustomAlert from './CustomAlert';
import useCustomAlert from '../hooks/useCustomAlert';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ImagePreviewDialog = ({
  visible,
  onClose,
  image,
  onDelete,
  showDeleteButton = true,
}) => {
  const { t } = useTranslation();
  const { alertConfig, showDeleteAlert, hideAlert } = useCustomAlert();

  const handleDelete = () => {
    showDeleteAlert({
      title: t('Remove Image'),
      message: t('Are you sure you want to remove this image?'),
      onConfirm: () => {
        onDelete(image.id);
        onClose();
      },
      onCancel: () => {
        // Do nothing, alert will close automatically
      },
      confirmText: t('delete'),
      cancelText: t('cancel'),
    });
  };

  if (!image) return null;

  return (
    <>
      <Modal
        visible={visible}
        transparent={false}
        animationType="slide"
        onRequestClose={onClose}
        statusBarTranslucent={true}
      >
        <StatusBar backgroundColor="#000000" barStyle="light-content" />
        <View style={styles.container}>
          {/* Header with controls */}
          <View style={styles.header}>
            {/* Delete button - Left side */}
            {showDeleteButton && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Icon name="trash" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            {/* Spacer to center the image */}
            <View style={styles.spacer} />

            {/* Close button - Right side */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Main image container - Full screen */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: image.uri || image.url }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Footer with image info */}
          <View style={styles.footer}>
            <GlobalText style={styles.fileName} numberOfLines={1}>
              {image.fileName || t('Image')}
            </GlobalText>
            <View style={styles.imageInfo}>
              {image.fileSize && (
                <GlobalText style={styles.imageSize}>
                  {(image.fileSize / 1024 / 1024).toFixed(1)} MB
                </GlobalText>
              )}
              {image.width && image.height && (
                <GlobalText style={styles.imageDimensions}>
                  {image.width} × {image.height}
                </GlobalText>
              )}
            </View>
          </View>
        </View>
      </Modal>

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
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 52,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  spacer: {
    flex: 1,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'android' ? 12 : 32,
  },
  fileName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  imageInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSize: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 12,
  },
  imageDimensions: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
};

ImagePreviewDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  image: PropTypes.shape({
    id: PropTypes.string.isRequired,
    uri: PropTypes.string,
    url: PropTypes.string,
    fileName: PropTypes.string,
    fileSize: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  onDelete: PropTypes.func.isRequired,
  showDeleteButton: PropTypes.bool,
};

export default ImagePreviewDialog;
