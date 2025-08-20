import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // or another icon library
import { useTranslation } from '../../context/LanguageContext';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../utils/Helper/Style';

import GlobalText from "@components/GlobalText/GlobalText";

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
        <GlobalText style={globalStyles.subHeading}>
          {t('Overallscore')}{' '}
          <GlobalText style={{ color: percentage > 35 ? '#1A8825' : 'red' }}>
            {percentage}%
          </GlobalText>
        </GlobalText>
        <GlobalText style={styles.smileyText}>
          {percentage > 35 && `😄`}
        </GlobalText>
      </View>
    );
  } else if (status === 'In_Progress') {
    content = (
      <View style={globalStyles.flexrow}>
        <Icon name="circle-o" size={24} color="#4D4639" />
        <GlobalText style={[globalStyles.subHeading, { marginLeft: 10 }]}>
          {t('Inprogress')} ({completedCount} {t('out_of')}{' '}
          {questionsets?.length} {t('completed')})
        </GlobalText>
      </View>
    );
  } else {
    content = (
      <View style={globalStyles.flexrow}>
        <GlobalText style={globalStyles.subHeading}>
          {t('not_started')}
        </GlobalText>
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
          {/* <GlobalText >Back</GlobalText> */}
        </TouchableOpacity>
      </View>
      <View style={styles.rightContainer}>
        <GlobalText style={globalStyles.subHeading}>{t(testText)}</GlobalText>
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
