import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { useTranslation } from '../../context/LanguageContext';

const CustomButton2 = () => {
  //multi language setup
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Pressable style={styles.button}>
        <Text style={styles.buttontext}>{t('already_login')}</Text>
      </Pressable>
    </View>
  );
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

export default CustomButton2;
