import React from 'react';
import { View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Octicons';
import GlobalText from '@components/GlobalText/GlobalText';
import { useTranslation } from '../../../../context/LanguageContext';
import ATMAssessmentStyles from '../styles/ATMAssessmentStyles';

const ImageViewerScreen = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { image } = route.params;

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={ATMAssessmentStyles.fullScreenContainer}>
      <View style={ATMAssessmentStyles.fullScreenHeader}>
        <TouchableOpacity
          style={ATMAssessmentStyles.fullScreenBackButton}
          onPress={handleGoBack}
        >
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <GlobalText
          style={ATMAssessmentStyles.fullScreenTitle}
          numberOfLines={1}
        >
          {image.fileName}
        </GlobalText>
      </View>

      <View style={ATMAssessmentStyles.fullScreenImageContainer}>
        <Image
          source={{ uri: image.url || image.uri }}
          style={ATMAssessmentStyles.fullScreenImage}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};

ImageViewerScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      image: PropTypes.shape({
        url: PropTypes.string,
        uri: PropTypes.string,
        fileName: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default ImageViewerScreen;
