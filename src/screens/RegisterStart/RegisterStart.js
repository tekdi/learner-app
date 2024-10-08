import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useTranslation } from '../../context/LanguageContext';
import FastImage from '@changwoolab/react-native-fast-image';
import { logEventFunction } from '../../utils/JsHelper/Helper';

const RegisterStart = () => {
  //multi language setup
  const { t } = useTranslation();

  const nav = useNavigation();

  const navigate = () => {
    nav.goBack();
  };

  const handleClick = async () => {
    const obj = {
      eventName: 'registration_started',
      method: 'button-click',
      screenName: 'Registration',
    };
    await logEventFunction(obj);
    nav.navigate('RegisterScreen');
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
        <FastImage
          style={styles.gif_image}
          source={require('../../assets/images/gif/face.gif')}
          resizeMode={FastImage.resizeMode.contain}
          priority={FastImage.priority.high} // Set the priority here
        />
        <Text allowFontScaling={false} style={styles.title}>
          {t('form_start_lable')}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton
          text={t('continue')}
          onPress={() => {
            handleClick();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  backbutton: {
    position: 'absolute',
    top: 95,
    left: 20,
    zIndex: 1,
  },
  buttonContainer: {
    padding: 10,
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  gif_image: {
    height: 80,
    width: 80,
  },
  container_image: {
    marginTop: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    marginTop: 15,
    fontWeight: '1000',
    textAlign: 'center',
  },
});

export default RegisterStart;
