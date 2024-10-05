import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../../context/LanguageContext';
import { StyleSheet, Text } from 'react-native';

const TextField = ({ text, style }) => {
  const { t } = useTranslation();
  const textStyle = style || styles.text;

  return (
    <Text allowFontScaling={false} style={textStyle}>
      {' '}
      {text ? t(text) : '-'}{' '}
    </Text>
  );
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
