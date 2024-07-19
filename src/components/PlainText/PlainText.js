import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from '../../context/LanguageContext';

const PlainText = ({ text }) => {
  const { t } = useTranslation();
  return <Text style={styles.text2}>{t(text)}</Text>;
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
