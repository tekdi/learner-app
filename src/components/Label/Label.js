import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../../context/LanguageContext';
import { StyleSheet, Text } from 'react-native';

import GlobalText from "@components/GlobalText/GlobalText";

const Label = ({ text }) => {
  const { t } = useTranslation();

  return <GlobalText style={styles.text}>{t(text)}</GlobalText>;
};

Label.propTypes = {
  text: PropTypes.string,
};

const styles = StyleSheet.create({
  text: {
    color: '#969088',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});

export default Label;
