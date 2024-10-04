import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import globalStyles from '../../utils/Helper/Style';
import Icon from 'react-native-vector-icons/Octicons';
import { useTranslation } from '../../context/LanguageContext';
import arrow_upload_progress from '../../assets/images/png/arrow_upload_progress.png';

const StatusCardIcon = ({ status }) => {
  const { t } = useTranslation();

  if (status === 'completed') {
    return (
      <Icon name="check-circle-fill" style={{ color: '#08A835' }} size={15} />
    );
  } else if (status === 'inprogress') {
    return (
      <Image
        style={styles.img}
        source={arrow_upload_progress}
        resizeMode="contain"
      />
    );
  } else {
    return <Icon name="circle" style={{ color: '#000' }} size={15} />;
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

StatusCardIcon.propTypes = {};

export default StatusCardIcon;
