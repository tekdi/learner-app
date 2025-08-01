import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../../../context/LanguageContext';
import GlobalText from '@components/GlobalText/GlobalText';
import SecondaryHeader from '../../../../components/Layout/SecondaryHeader';

const { width } = Dimensions.get('window');

const UploadedImagesScreen = ({ route }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { images, title } = route.params;

  const handleImagePress = (image, index) => {
    navigation.navigate('ImageZoomDialog', {
      image,
      images,
      currentIndex: index,
    });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <SecondaryHeader logo />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#4D4639" />
        </TouchableOpacity>
        <GlobalText style={styles.headerTitle}>
          {images?.length || 0} {t('Images Uploaded')}
        </GlobalText>
      </View>

      {/* Images Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imagesGrid}>
          {images?.map((image, index) => (
            <TouchableOpacity
              key={image.id || index}
              style={styles.imageContainer}
              onPress={() => handleImagePress(image, index)}
            >
              <Image
                source={{ uri: image.url || image.uri }}
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Regular',
    color: '#4D4639',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: (width - 48) / 2, // 2 columns with padding
    height: ((width - 48) / 2) * 1.33, // 4:3 aspect ratio
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default UploadedImagesScreen;
