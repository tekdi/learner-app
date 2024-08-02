import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // or another icon library
import { useTranslation } from '../../context/LanguageContext';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';

const AssessmentHeader = ({ testText, data }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <View style={styles.card}>
      <View style={styles.leftContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Octicons
            name="arrow-left"
            style={{ marginHorizontal: 10 }}
            color={'#000'}
            size={30}
          />
          {/* <Text>Back</Text> */}
        </TouchableOpacity>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.preTestText}>{t(testText)}</Text>
        {/* {!data ? (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {t('Overallscore')} <Text style={{ color: '#1A8825' }}> 88%</Text>
            </Text>
            <Text style={styles.smileyText}>😄</Text>
          </View>
        ) : (
          <View style={styles.scoreContainer}>
            <Icon name="circle-o" size={24} color="#4D4639" />

            <Text style={[styles.scoreText, { marginLeft: 10 }]}>
              {t('Inprogress')} `(0 out of {data?.length} completed)`
            </Text>
          </View>
        )} */}
      </View>
    </View>
  );
};

AssessmentHeader.propTypes = {
  testText: PropTypes.string,
  data: PropTypes.any,
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE1CF',
    paddingVertical: 15,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 4,
    marginLeft: 10,
  },
  preTestText: {
    fontSize: 22,
    color: '#4D4639',
    fontWeight: '500',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    color: '#4D4639',
  },
  scoreText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  smileyText: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default AssessmentHeader;
