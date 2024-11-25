import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';

import GlobalText from "@components/GlobalText/GlobalText";

const SecondaryButton = ({ onPress, text, style }) => {
  //multi language setup
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <GlobalText style={[styles.buttontext, style]}>{t(text)}</GlobalText>
      </TouchableOpacity>
    </View>
  );
};

SecondaryButton.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
  style: PropTypes.any,
};

const styles = StyleSheet.create({
  buttontext: {
    textAlign: 'center',
    fontSize: 16,
    width: '100%',
    color: 'black',
    padding: 10,
    paddingHorizontal: 20,
    fontFamily: 'Poppins-Medium',
  },
  button: {
    borderRadius: 30,
    color: 'black',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
  },
});

export default SecondaryButton;
