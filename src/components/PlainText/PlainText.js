import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';

import GlobalText from "@components/GlobalText/GlobalText";

const PlainText = ({ text }) => {
  const { t } = useTranslation();
  return <GlobalText style={styles.text2}>{t(text)}</GlobalText>;
};

PlainText.propTypes = {
  text: PropTypes.string,
};

const styles = StyleSheet.create({
  text2: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    fontSize: 20,
    flexWrap: 'wrap',
  },
});

export default PlainText;
