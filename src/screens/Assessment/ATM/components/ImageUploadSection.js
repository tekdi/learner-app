import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlobalText from '@components/GlobalText/GlobalText';
import { useTranslation } from '../../../../context/LanguageContext';
import ATMAssessmentStyles from '../styles/ATMAssessmentStyles';

const ImageUploadSection = ({
  onUploadPress,
  selectedImagesCount,
  isUploading,
  uploadProgress,
}) => {
  const { t } = useTranslation();

  const getUploadButtonText = () => {
    if (isUploading) {
      return `${t('Uploading')}... ${Math.round(uploadProgress)}%`;
    }
    return selectedImagesCount > 0
      ? t('Add More Images')
      : t('No images uploaded');
  };

  return (
    <View style={ATMAssessmentStyles.imageUploadSection}>
      <TouchableOpacity
        style={[
          ATMAssessmentStyles.uploadButton,
          isUploading && ATMAssessmentStyles.submitButtonDisabled,
        ]}
        onPress={onUploadPress}
        disabled={isUploading}
      >
        <GlobalText style={ATMAssessmentStyles.uploadButtonText}>
          {getUploadButtonText()}
        </GlobalText>
        <Icon
          name={isUploading ? 'refresh' : 'file-upload'}
          size={18}
          color="#1F1B13"
        />
      </TouchableOpacity>

      {selectedImagesCount > 0 && (
        <GlobalText style={ATMAssessmentStyles.imageCountText}>
          {t('Images Selected')}: {selectedImagesCount}
          {selectedImagesCount > 4 && (
            <Text style={{ color: '#FF6B35' }}> ({t('Recommended')}: 4)</Text>
          )}
        </GlobalText>
      )}

      {isUploading && (
        <View style={ATMAssessmentStyles.progressBar}>
          <View
            style={[
              ATMAssessmentStyles.progressFill,
              { width: `${uploadProgress}%` },
            ]}
          />
        </View>
      )}
    </View>
  );
};

ImageUploadSection.propTypes = {
  onUploadPress: PropTypes.func.isRequired,
  selectedImagesCount: PropTypes.number,
  isUploading: PropTypes.bool,
  uploadProgress: PropTypes.number,
};

ImageUploadSection.defaultProps = {
  selectedImagesCount: 0,
  isUploading: false,
  uploadProgress: 0,
};

export default ImageUploadSection;
