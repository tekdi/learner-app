import React from 'react';
import PropTypes from 'prop-types';
import SecondaryHeader from '../../../../components/Layout/SecondaryHeader';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import globalStyles from '../../../../utils/Helper/Style';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
import Accordion from '../../../../components/Accordion/Accordion';

const SubjectDetails = ({ route }) => {
  const { topic, subTopic, courseType, item } = route.params;
  const navigation = useNavigation();

  console.log({ topic, subTopic, courseType });

  return (
    <>
      <SecondaryHeader logo />
      <View style={styles.leftContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Octicons
            name="arrow-left"
            style={{ marginRight: 20 }}
            color={'#000'}
            size={30}
          />
        </TouchableOpacity>
        <Text style={[globalStyles.heading2]}>{topic}</Text>
      </View>
      <View style={{ left: 50 }}>
        {subTopic?.map((item, key) => {
          return (
            <Text key={key} style={styles.accordionDetails}>
              {item}
            </Text>
          );
        })}
      </View>
      <Accordion item={item} title={'pre_requisites_2'} />
      <Accordion item={item} title={'post_requisites_2'} postrequisites />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    left: 20,
  },
  img: {
    width: 50,
    height: 50,
  },
  accordionDetails: {
    color: '#0D599E',
    marginLeft: 10,
  },
});

SubjectDetails.propTypes = {};

export default SubjectDetails;
