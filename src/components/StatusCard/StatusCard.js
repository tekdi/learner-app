import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import globalStyles from '../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../context/LanguageContext';
import { ProgressBar } from '@ui-kitten/components';

import GlobalText from '@components/GlobalText/GlobalText';

import ProgressBarCustom from '../ProgressBarCustom/ProgressBarCustom';
import CircularProgressBarCustom from '../CircularProgressBarCustom.js/CircularProgressBarCustom';
import arrow_upload_progress from '../../assets/images/png/arrow_upload_progress.png';
import check_circle from '../../assets/images/png/check_circle.png';
import { translateDigits } from '@src/utils/JsHelper/Helper';

const StatusCard = ({ status, trackCompleted, viewStyle }) => {
  const { t, language } = useTranslation();

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
        {/* <ProgressBarCustom
          progress={trackCompleted}
          language={language}
          width={100}
        /> */}
        <CircularProgressBarCustom
          size={20}
          strokeWidth={5}
          progress={trackCompleted / 100}
          color="green"
          backgroundColor="#e6e6e6"
          textStyle={{ fontSize: 8, color: 'white' }}
        />
        <GlobalText
          style={{ marginLeft: 10, color: 'white' }}
        >{`${translateDigits(
          Math.round((trackCompleted / 100) * 100),
          language
        )}%`}</GlobalText>
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
        <Icon name="circle" color={'white'} />
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
    width: '100%',
    backgroundColor: '#3A3A3ACC',
    alignItems: 'center',
    paddingLeft: 10,
    paddingVertical: 3,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    overflow: 'hidden',
    height: 30,
  },
  img: {
    width: 16,
    height: 16,
  },
});

StatusCard.propTypes = {};

export default StatusCard;
