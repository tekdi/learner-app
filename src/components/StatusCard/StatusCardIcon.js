import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import globalStyles from '../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../context/LanguageContext';
import arrow_upload_progress from '../../assets/images/png/arrow_upload_progress.png';

import GlobalText from '@components/GlobalText/GlobalText';

const StatusCardIcon = ({ status }) => {
  const { t } = useTranslation();

  if (status === 'completed') {
    return <View style={styles.complete} />;
  } else if (status === 'inprogress') {
    return (
      <View style={[styles.view]}>
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
        <GlobalText
          allowFontScaling={false}
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[
            globalStyles.text,
            { marginLeft: 5, color: 'white', fontSize: 12, width: '60%' },
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
    borderRadius: 5,
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
    width: '38%',
    borderWidth: 2,
    borderColor: '#CDC5BD',
    backgroundColor: '#CDC5BD',
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
});

StatusCardIcon.propTypes = {};

export default StatusCardIcon;
