import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import globalStyles from '../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../context/LanguageContext';
import { ProgressBar } from '@ui-kitten/components';

import ProgressBarCustom from '../ProgressBarCustom/ProgressBarCustom';

const StatusCard = ({ status, trackCompleted }) => {
  const { t } = useTranslation();

  if (status === 'completed') {
    return (
      <View style={styles.view}>
        <Icon name="check-circle" style={{ color: '#50EE42' }} />
        <Text style={[globalStyles.text, { color: '#50EE42', marginLeft: 10 }]}>
          {t('completed')}
        </Text>
      </View>
    );
  } else if (status === 'inprogress') {
    return (
      <View style={[styles.view, { paddingVertical: 10 }]}>
        <ProgressBarCustom progress={trackCompleted} width={100} />
      </View>
    );
  } else {
    return (
      <View style={styles.view}>
        <Icon name="circle" />
        <Text style={[globalStyles.text, { color: 'white', marginLeft: 10 }]}>
          {t('not_started')}
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#3A3A3ACC',
    alignItems: 'center',
    paddingLeft: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },
});

StatusCard.propTypes = {};

export default StatusCard;
