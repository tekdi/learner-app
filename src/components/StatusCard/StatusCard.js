import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import globalStyles from '../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../context/LanguageContext';
import { ProgressBar } from '@ui-kitten/components';

import ProgressBarCustom from '../ProgressBarCustom/ProgressBarCustom';
import arrow_upload_progress from '../../assets/images/png/arrow_upload_progress.png';

const StatusCard = ({ status, trackCompleted, viewStyle }) => {
  const { t } = useTranslation();

  console.log(viewStyle);

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
      <View style={[styles.view, viewStyle]}>
        <ProgressBarCustom progress={trackCompleted} width={100} />
      </View>
    );
  } else if (status === 'progress') {
    return (
      <View style={[styles.view, viewStyle]}>
        <Image
          style={styles.img}
          source={arrow_upload_progress}
          resizeMode="contain"
        />
        <Text
          style={[
            globalStyles.text,
            { color: 'white', marginLeft: 10, fontSize: 12 },
          ]}
        >
          {t('Inprogress')}
        </Text>
      </View>
    );
  } else {
    return (
      <View style={[styles.view, viewStyle]}>
        <Icon name="circle" />
        <Text
          style={[
            globalStyles.text,
            { color: 'white', marginLeft: 10, fontSize: 12 },
          ]}
        >
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
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});

StatusCard.propTypes = {};

export default StatusCard;
