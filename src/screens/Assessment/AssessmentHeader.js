import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // or another icon library
import { useTranslation } from '../../context/LanguageContext';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../utils/Helper/Style';

const AssessmentHeader = ({
  testText,
  questionsets,
  status,
  percentage,
  completedCount,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  let content;

  if (status === 'Completed') {
    content = (
      <View style={globalStyles.flexrow}>
        <Text allowFontScaling={false} style={globalStyles.subHeading}>
          {t('Overallscore')}{' '}
          <Text
            allowFontScaling={false}
            style={{ color: percentage > 35 ? '#1A8825' : 'red' }}
          >
            {percentage}%
          </Text>
        </Text>
        <Text allowFontScaling={false} style={styles.smileyText}>
          {percentage > 35 && `😄`}
        </Text>
      </View>
    );
  } else if (status === 'In_Progress') {
    content = (
      <View style={globalStyles.flexrow}>
        <Icon name="circle-o" size={24} color="#4D4639" />
        <Text
          allowFontScaling={false}
          style={[globalStyles.subHeading, { marginLeft: 10 }]}
        >
          {t('Inprogress')} ({completedCount} {t('out_of')}{' '}
          {questionsets?.length} {t('completed')})
        </Text>
      </View>
    );
  } else {
    content = (
      <View style={globalStyles.flexrow}>
        <Text allowFontScaling={false} style={globalStyles.subHeading}>
          {t('not_started')}
        </Text>
      </View>
    );
  }

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
          {/* <Text allowFontScaling={false}>Back</Text> */}
        </TouchableOpacity>
      </View>
      <View style={styles.rightContainer}>
        <Text allowFontScaling={false} style={globalStyles.subHeading}>
          {t(testText)}
        </Text>
        {content}
      </View>
    </View>
  );
};

AssessmentHeader.propTypes = {
  testText: PropTypes.string,
  questionsets: PropTypes.any,
  status: PropTypes.string,
  percentage: PropTypes.any,
  completedCount: PropTypes.any,
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE1CF',
    paddingVertical: 10,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 4,
  },
  smileyText: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default AssessmentHeader;
