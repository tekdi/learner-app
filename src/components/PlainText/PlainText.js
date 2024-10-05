import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';

const PlainText = ({ text }) => {
  const { t } = useTranslation();
  return (
    <Text allowFontScaling={false} style={styles.text2}>
      {t(text)}
    </Text>
  );
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
