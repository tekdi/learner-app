import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Layout/Header';
import TextField from '../../components/TextField/TextField';
import { courseDetails } from '../../utils/API/ApiCalls';
import { useNavigation } from '@react-navigation/native';

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
    console.log('pressed', data);
    navigation.navigate('StandAlonePlayer', {
      content_do_id: data?.identifier,
      content_mime_type: data?.mimeType,
      isOffline: false,
    });
  };

  return (
    <SafeAreaView>
      <Header />
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
              <TextField text={item?.name} />
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
  },
});

ContentList.propTypes = {};

export default ContentList;
