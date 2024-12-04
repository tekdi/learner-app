import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import globalStyles from '../../utils/Helper/Style';
import { useTranslation } from '../../context/LanguageContext';

import ProgressBarCustom from '../ProgressBarCustom/ProgressBarCustom';

const StatusCardLine = ({ status, trackCompleted, viewStyle }) => {
  const { t, language } = useTranslation();

  console.log({ status });

  if (status === 'completed') {
    return <View style={styles.complete} />;
  } else if (status === 'inprogress') {
    return (
      <View style={[styles.view, viewStyle, { paddingVertical: 5 }]}>
        <ProgressBarCustom
          progress={trackCompleted}
          language={language}
          width={100}
        />
      </View>
    );
  } else if (status === 'progress') {
    return (
      <View style={[styles.view, viewStyle]}>
        <View style={styles.inprogress} />
        <Text
          allowFontScaling={false}
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
      <View style={[styles.view]}>
        <View style={styles.not_started} />
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          allowFontScaling={false}
          style={[
            globalStyles.text,
            { color: 'white', marginLeft: 10, fontSize: 12, width: '60%' },
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
    overflow: 'hidden',
  },
  img: {
    width: 16,
    height: 16,
  },
  complete: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#FF0000',
    backgroundColor: '#FF0000',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  inprogress: {
    width: '40%',
    borderWidth: 2,
    borderColor: '#FF0000',
    backgroundColor: '#FF0000',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  not_started: {
    width: '40%',
    borderWidth: 2,
    borderColor: '#CDC5BD',
    backgroundColor: '#CDC5BD',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
});

StatusCardLine.propTypes = {};

export default StatusCardLine;
