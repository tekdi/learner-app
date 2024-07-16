import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import SecondaryButton from '../../components/SecondaryButton/SecondaryButton';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useTranslation } from '../../context/LanguageContext';

import Logo from '../../assets/images/png/logo.png';

const LoginSignUpScreen = () => {
  //multi language setup
  const { t } = useTranslation();

  const nav = useNavigation();

  const navigate = () => {
    nav.navigate('LanguageScreen');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backbutton} onPress={navigate}>
        <Image
          source={backIcon}
          resizeMode="contain"
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
      {/* Icon png here */}
      <View style={styles.container_image}>
        <Image style={styles.image} source={Logo} resizeMode="contain" />
        <Text style={styles.title}>{t('let_log_in')}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          text={t('i_am_new_user')}
          onPress={() => {
            nav.navigate('RegisterStart');
          }}
        />
        <View style={{ padding: 10 }}></View>
        <SecondaryButton
          onPress={() => {
            nav.navigate('LoginScreen');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: 'white',
  },
  backbutton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
  },
  buttonContainer: {
    padding: 10,
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  image: {
    height: 60,
    width: 60,
  },
  container_image: {
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    marginTop: 15,
    fontWeight: '1000',
    textAlign: 'center',
  },
});

export default LoginSignUpScreen;
