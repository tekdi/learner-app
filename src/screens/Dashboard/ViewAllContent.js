import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import Header from '../../components/Layout/Header';
import ScrollViewLayout from '../../components/Layout/ScrollViewLayout';
import ContentCard from '../../components/ContentCard/ContentCard';
import { useTranslation } from '../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';

const ViewAllContent = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { title, data } = route.params;
  // const data = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const handlePress = (item) => {
    navigation.navigate('ContentList', { do_id: item?.identifier });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <ContentCard
        onPress={() => handlePress(item)}
        title={item?.name}
        description={item?.contentType}
        appIcon={item?.appIcon}
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
});

ViewAllContent.propTypes = {
  route: PropTypes.object,
};

export default ViewAllContent;
