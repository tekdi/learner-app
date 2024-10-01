import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import CourseCard from '../../components/CourseCard/CourseCard';
import { useTranslation } from '../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';

const ViewAllContent = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { title, data } = route.params;

  const handlePress = (item) => {
    navigation.navigate('CourseContentList', { do_id: item?.identifier });
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.cardContainer}>
      <CourseCard
        onPress={() => handlePress(item)}
        appIcon={item?.appIcon}
        index={index}
        setCardWidth={160}
        item={item}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 10, top: 60 }}>
      {/* <Header /> */}
      <View style={{ marginBottom: 120 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon
              name="arrow-left"
              style={{ marginHorizontal: 10 }}
              color={'#000'}
              size={30}
            />
          </TouchableOpacity>
          <Text style={styles.text}>{t(title)}</Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item?.identifier}
          initialNumToRender={10} // Adjust the number of items to render initially
          maxToRenderPerBatch={10} // Number of items rendered per batch
          numColumns={2}
          windowSize={21} // Controls the number of items rendered around the current index
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: '500',
    color: '#785913',
  },
  cardContainer: {
    // borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

ViewAllContent.propTypes = {
  route: PropTypes.object,
};

export default ViewAllContent;
