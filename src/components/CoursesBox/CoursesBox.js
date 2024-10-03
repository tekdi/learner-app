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
    console.log('identifier', item?.identifier);
    console.log('item', item?.leafNodes);
    navigation.navigate('CourseContentList', {
      do_id: item?.identifier,
      course_id: item?.identifier,
      content_list_node: item?.leafNodes,
      TrackData: TrackData,
    });
  };

  const renderItem = ({ item, index }) => (
    <View>
      <CourseCard
        onPress={() => handlePress(item)}
        appIcon={item?.appIcon}
        index={index}
        setCardWidth={160}
        item={item}
        TrackData={TrackData}
        navigation={navigation}
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
        {/* <View style={styles.view}>
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
        </View> */}
      </View>
      <FlatList
        data={ContentData}
        renderItem={renderItem}
        keyExtractor={(item) => item?.identifier}
        // horizontal={true} // Enable horizontal scrolling
        initialNumToRender={10} // Adjust the number of items to render initially
        maxToRenderPerBatch={10} // Number of items rendered per batch
        numColumns={2}
        windowSize={21} // Controls the number of items rendered around the current index
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '85%',
    // borderWidth: 1,
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

CoursesBox.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object,
  description: PropTypes.string,
  viewAllLink: PropTypes.any,
  ContentData: PropTypes.array.isRequired,
};

export default CoursesBox;
