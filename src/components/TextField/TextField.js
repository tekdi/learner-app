import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../../context/LanguageContext';
import { StyleSheet, Text } from 'react-native';

const TextField = ({ text, style }) => {
  const { t } = useTranslation();
  const textStyle = style ? style : styles.text;

  return <Text style={textStyle}> {text ? t(text) : '-'} </Text>;
};

TextField.propTypes = {};

const styles = StyleSheet.create({
  text: {
    color: '#000',
    fontSize: 16,
  },
});

export default TextField;
