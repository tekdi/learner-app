import React from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import GlobalText from '@components/GlobalText/GlobalText';
import { useTranslation } from '../../../../context/LanguageContext';
import ATMAssessmentStyles from '../styles/ATMAssessmentStyles';

const UploadedImagesGrid = ({ images, onImagePress, numColumns = 2 }) => {
  const { t } = useTranslation();

  const renderImageItem = ({ item }) => (
    <TouchableOpacity
      style={ATMAssessmentStyles.gridItem}
      onPress={() => onImagePress(item)}
    >
      <Image
        source={{ uri: item.url || item.uri }}
        style={ATMAssessmentStyles.gridImage}
        resizeMode="cover"
      />

      <View style={ATMAssessmentStyles.gridImageOverlay}>
        <GlobalText style={ATMAssessmentStyles.gridImageName} numberOfLines={1}>
          {item.fileName}
        </GlobalText>
      </View>
    </TouchableOpacity>
  );

  if (!images || images.length === 0) {
    return (
      <View style={ATMAssessmentStyles.gridContainer}>
        <GlobalText style={ATMAssessmentStyles.gridTitle}>
          {t('No Images Uploaded')}
        </GlobalText>
      </View>
    );
  }

  return (
    <View style={ATMAssessmentStyles.gridContainer}>
      <GlobalText style={ATMAssessmentStyles.gridTitle}>
        {t('Uploaded Images')} ({images.length})
      </GlobalText>

      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.id || item.url}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={
          numColumns > 1 ? { justifyContent: 'space-between' } : null
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

UploadedImagesGrid.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string,
      uri: PropTypes.string,
      fileName: PropTypes.string.isRequired,
    })
  ).isRequired,
  onImagePress: PropTypes.func.isRequired,
  numColumns: PropTypes.number,
};

export default UploadedImagesGrid;
