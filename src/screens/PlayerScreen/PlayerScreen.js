import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton2 from '../../components/CustomButtonOutlined/CustomButtonOutlined';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useTranslation } from '../../context/LanguageContext';

import Logo from '../../assets/images/png/logo.png';

import { WebView } from 'react-native-webview';

const PlayerScreen = () => {
  //multi language setup
  const { t } = useTranslation();

  const nav = useNavigation();

  const navigate = () => {
    nav.goBack();
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
        <Text style={styles.title}>Players</Text>
      </View>
      <View style={{ padding: 10 }}></View>
      <CustomButton
        text={'QuML Player: Online'}
        onPress={() => {
          nav.navigate('QuMLPlayer');
        }}
      />
      <View style={{ padding: 10 }}></View>
      <CustomButton
        text={'Pdf Player: Online'}
        onPress={() => {
          nav.navigate('PdfPlayer');
        }}
      />
      <View style={{ padding: 10 }}></View>
      <CustomButton
        text={'Pdf Player: Offline'}
        onPress={() => {
          nav.navigate('PdfPlayerOffline');
        }}
      />
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
    marginBottom: 100,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  image: {
    height: 60,
    width: 60,
  },
  container_image: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    marginTop: 15,
    fontWeight: '1000',
    textAlign: 'center',
  },
});

export default PlayerScreen;
