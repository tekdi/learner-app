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
import CourseCard from '../CourseCard/CourseCard';
import { useTranslation } from '../../context/LanguageContext';
import Icon from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';

import GlobalText from "@components/GlobalText/GlobalText";

const CoursesBox = ({
  ContentData,
  TrackData,
  viewAllLink,
  style,
  title,
  description,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  // console.log('########## CoursesBox');
  // console.log('ContentData', ContentData);
  // console.log('##########');
  const handlePress = (item) => {
    //console.log('Card pressed!', item);
    // console.log('identifier', item?.identifier);
    // console.log('item', item?.leafNodes);
    navigation.navigate('CourseContentList', {
      do_id: item?.identifier,
      course_id: item?.identifier,
      content_list_node: item?.leafNodes,
    });
  };

  const renderItem = ({ item, index }) => (
    <CourseCard
      onPress={() => handlePress(item)}
      appIcon={item?.appIcon}
      index={index}
      cardWidth={'44%'}
      item={item}
      TrackData={TrackData}
      navigation={navigation}
    />
  );

  return (
    <SafeAreaView style={[styles.container]}>
      {title && (
        <GlobalText style={[styles.title, { color: style.titlecolor }]}>
          {t(title)}
        </GlobalText>
      )}
      <View style={styles.view}>
        <GlobalText style={[styles.description, { color: 'black' }]}>
          {t(description)}
        </GlobalText>
        {/* <View style={styles.view}>
          <TouchableOpacity onPress={viewAllLink}>
            <GlobalText  style={[styles.description, { color: '#0D599E' }]}>
              {t('view_all')}
            </GlobalText>
          </TouchableOpacity>
          <Icon
            name="arrow-right"
            style={{ marginHorizontal: 10 }}
            color={'#0D599E'}
            size={20}
          />
        </View> */}
      </View>
      <View>
        <FlatList
          data={ContentData}
          renderItem={renderItem}
          keyExtractor={(item) => item?.identifier}
          // horizontal={true} // Enable horizontal scrolling
          initialNumToRender={10} // Adjust the number of items to render initially
          maxToRenderPerBatch={10} // Number of items rendered per batch
          numColumns={2}
          windowSize={21} // Controls the number of items rendered around the current index
          scrollEnabled={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

CoursesBox.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object,
  description: PropTypes.string,
  viewAllLink: PropTypes.any,
  ContentData: PropTypes.array.isRequired,
};

export default CoursesBox;
