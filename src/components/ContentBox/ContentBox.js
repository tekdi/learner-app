import React from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import ContentCard from '../../components/ContentCard/ContentCard';
import { useTranslation } from '../../context/LanguageContext';
import Icon from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';

const ContentBox = ({
  ContentData,
  viewAllLink,
  style,
  title,
  description,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handlePress = (item) => {
    console.log('Card pressed!', item);
    navigation.navigate('ContentList', { do_id: item?.identifier });
  };

  const renderItem = ({ item, index }) => (
    <View>
      <ContentCard
        onPress={() => handlePress(item)}
        appIcon={item?.appIcon}
        index={index}
        setCardWidth={20}
        item={item}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container]}>
      {title && (
        <Text style={[styles.title, { color: style.titlecolor }]}>
          {t(title)}
        </Text>
      )}
      <View style={styles.view}>
        <Text style={[styles.description, { color: 'black' }]}>
          {t(description)}
        </Text>
        <View style={styles.view}>
          <TouchableOpacity onPress={viewAllLink}>
            <Text style={[styles.description, { color: '#0D599E' }]}>
              {t('view_all')}
            </Text>
          </TouchableOpacity>
          <Icon
            name="arrow-right"
            style={{ marginHorizontal: 10 }}
            color={'#0D599E'}
            size={20}
          />
        </View>
      </View>
      <FlatList
        data={ContentData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true} // Enable horizontal scrolling
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator if desired
        initialNumToRender={3} // Adjust the number of items to render initially
        maxToRenderPerBatch={3} // Number of items rendered per batch
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

ContentBox.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object,
  description: PropTypes.string,
  viewAllLink: PropTypes.any,
  ContentData: PropTypes.array.isRequired,
};

export default ContentBox;
