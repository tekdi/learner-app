import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';

const SecondaryButton = ({onPress}) => {
  //multi language setup
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttontext}>{t('already_login')}</Text>
      </TouchableOpacity>
    </View>
  );
};

SecondaryButton.propTypes = {
  
  onPress: PropTypes.func,
  
};

const styles = StyleSheet.create({
  buttontext: {
    textAlign: 'center',
    fontSize: 17,
    color: 'black',
    width: '100%',
    fontFamily: 'Poppins-Medium',
  },
  button: {
    borderRadius: 30,
    color: 'black',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    height: 50,
    justifyContent: 'center',
  },
});

export default SecondaryButton;
