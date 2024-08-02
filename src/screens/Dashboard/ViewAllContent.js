import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
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
    Alert.alert(
      `Content-Type : ${item?.contentType}`,
      `mimeType : ${item?.mimeType}`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {}, // Replace 'TargetScreen' with your screen name
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView>
      <Header />
      <View style={{ top: 50, padding: 10 }}>
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
        <ScrollViewLayout horizontalScroll={false}>
          {data?.map((item) => {
            return (
              <ContentCard
                key={item?.name}
                onPress={() => handlePress(item)}
                title={item?.name}
                description={item?.contentType}
                appIcon={item?.appIcon}
              />
            );
          })}
        </ScrollViewLayout>
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
