import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import globalStyles from '../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../context/LanguageContext';
import { ProgressBar } from '@ui-kitten/components';

import ProgressBarCustom from '../ProgressBarCustom/ProgressBarCustom';
import arrow_upload_progress from '../../assets/images/png/arrow_upload_progress.png';
import check_circle from '../../assets/images/png/check_circle.png';

import GlobalText from '@components/GlobalText/GlobalText';

const StatusCardCourse = ({ status, trackCompleted, viewStyle }) => {
  const { t } = useTranslation();

  if (status === 'completed') {
    return (
      <View style={[styles.view, viewStyle]}>
        <Image style={styles.img} source={check_circle} resizeMode="contain" />
        <GlobalText
          style={[
            globalStyles.text,
            { color: '#50EE42', marginLeft: 10, fontSize: 12 },
          ]}
        >
          {t('completed')}
        </GlobalText>
      </View>
    );
  } else if (status === 'inprogress') {
    return (
      <View style={[styles.view, viewStyle, { paddingVertical: 5 }]}>
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
        <GlobalText
          style={[
            globalStyles.text,
            { color: 'white', marginLeft: 10, fontSize: 12 },
          ]}
        >
          {t('Inprogress')}
        </GlobalText>
      </View>
    );
  } else {
    return (
      <View style={[styles.view, viewStyle]}>
        <Icon name="circle" style={{ color: 'black' }} />
        <GlobalText
          style={[
            globalStyles.text,
            { color: 'white', marginLeft: 10, fontSize: 12 },
          ]}
        >
          {t('not_started')}
        </GlobalText>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    width: '70%',
    alignItems: 'center',
    paddingLeft: 10,
    paddingVertical: 3,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  img: {
    width: 16,
    height: 16,
  },
});

StatusCardCourse.propTypes = {};

export default StatusCardCourse;
