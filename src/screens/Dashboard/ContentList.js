import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Layout/Header';
import TextField from '../../components/TextField/TextField';
import { courseDetails } from '../../utils/API/ApiCalls';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ContentList = ({ route }) => {
  const { do_id } = route.params;
  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const content_do_id = do_id;
      const data = await courseDetails(content_do_id);
      console.log();
      setCourses(data?.result?.content?.children?.[0]?.children);
    };

    fetchData();
  }, []);

  const handlePress = (data) => {
    navigation.navigate('StandAlonePlayer', {
      content_do_id: data?.identifier,
      content_mime_type: data?.mimeType,
      isOffline: false,
    });
  };

  function checkArchiveType(mimeType) {
    console.log({ mimeType });

    if (
      mimeType.includes('ecml-archive') ||
      mimeType.includes('html-archive')
    ) {
      return 'touch-app';
    } else if (mimeType.includes('pdf') || mimeType.includes('epub')) {
      return 'file-copy';
    } else if (mimeType.includes('Webm') || mimeType.includes('mp4')) {
      return 'play-circle';
    }

    return null; // or any default value you want to return if no conditions are met
  }
  return (
    <SafeAreaView style={{ flex: 1, top: 50 }}>
      {/* <Header /> */}
      <View style={{ padding: 20 }}>
        <TextField style={styles.text} text={'course_details'} />
      </View>
      {courses?.map((item, index) => {
        return (
          <TouchableOpacity
            onPress={() => {
              handlePress(item);
            }}
          >
            <View style={styles.view}>
              <MaterialIcons
                name={checkArchiveType(item?.mimeType)}
                size={32}
                color="#9cb9ff"
              />
              <View style={{ marginLeft: 20 }}>
                <Text style={styles.text}>
                  <TextField text={item?.name} />(
                  <TextField text={item?.mimeType} />)
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
};

styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  view: {
    borderWidth: 1,
    padding: 20,
    margin: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#D0C5B4',
  },
});

ContentList.propTypes = {};

export default ContentList;
