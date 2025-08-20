import React from 'react';
import { View, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Octicons';
import GlobalText from '@components/GlobalText/GlobalText';
import { useTranslation } from '../../../../context/LanguageContext';
import ATMAssessmentStyles from '../styles/ATMAssessmentStyles';
import ImageUploadHelper from '../utils/ImageUploadHelper';

const ImageListView = ({
  images,
  onRemoveImage,
  onImagePress,
  showWarning = false,
}) => {
  const { t } = useTranslation();

  const handleRemoveImage = (imageId, imageName) => {
    Alert.alert(
      t('Remove Image'),
      t('Are you sure you want to remove this image?'),
      [
        { text: t('Cancel'), style: 'cancel' },
        {
          text: t('Remove'),
          style: 'destructive',
          onPress: () => onRemoveImage(imageId),
        },
      ]
    );
  };

  const renderImageItem = ({ item }) => (
    <TouchableOpacity
      style={ATMAssessmentStyles.imageItem}
      onPress={() => onImagePress(item)}
    >
      <Image
        source={{ uri: item.uri }}
        style={ATMAssessmentStyles.imageItemThumbnail}
        resizeMode="cover"
      />

      <View style={ATMAssessmentStyles.imageItemInfo}>
        <GlobalText style={ATMAssessmentStyles.imageItemName}>
          {item.fileName}
        </GlobalText>
        <GlobalText style={ATMAssessmentStyles.imageItemSize}>
          {ImageUploadHelper.formatFileSize(item.fileSize)}
        </GlobalText>
      </View>

      <TouchableOpacity
        style={ATMAssessmentStyles.removeButton}
        onPress={() => handleRemoveImage(item.id, item.fileName)}
      >
        <Icon name="trash" size={14} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <View style={ATMAssessmentStyles.imageListContainer}>
      <GlobalText style={ATMAssessmentStyles.imageListTitle}>
        {t('Selected Images')} ({images.length})
      </GlobalText>

      {showWarning && images.length > 4 && (
        <View style={ATMAssessmentStyles.warningContainer}>
          <GlobalText style={ATMAssessmentStyles.warningText}>
            {t('You have selected')} {images.length} {t('images')}.
            {t(
              'For better performance, we recommend uploading up to 4 images at a time'
            )}
            .
          </GlobalText>
        </View>
      )}

      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        maxHeight={300}
      />
    </View>
  );
};

ImageListView.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      uri: PropTypes.string.isRequired,
      fileName: PropTypes.string.isRequired,
      fileSize: PropTypes.number,
    })
  ).isRequired,
  onRemoveImage: PropTypes.func.isRequired,
  onImagePress: PropTypes.func.isRequired,
  showWarning: PropTypes.bool,
};

export default ImageListView;
