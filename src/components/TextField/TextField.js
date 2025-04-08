import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../../context/LanguageContext';
import { StyleSheet, Text } from 'react-native';

import GlobalText from '@components/GlobalText/GlobalText';
import globalStyles from '../../utils/Helper/Style';

const TextField = ({ text, style }) => {
  const { t } = useTranslation();
  const textStyle = style || globalStyles.h6;

  return <GlobalText style={textStyle}> {text ? t(text) : '-'} </GlobalText>;
};

TextField.propTypes = {
  text: PropTypes.string,
  style: PropTypes.any,
};

const styles = StyleSheet.create({
  text: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
});

export default TextField;
