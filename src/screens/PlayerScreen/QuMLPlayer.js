import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton2 from '../../components/CustomButtonOutlined/CustomButtonOutlined';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useTranslation } from '../../context/LanguageContext';

import Logo from '../../assets/images/png/logo.png';

import { WebView } from 'react-native-webview';
import { Platform } from 'react-native';

const QuMLPlayer = () => {
  const handleWebViewMessage = (event) => {
    const message = event.nativeEvent.data;
    console.log('WebView message:', message);
  };

  // Determine the correct path to the index.html file based on the platform
  const htmlFilePath = Platform.select({
    ios: './assets/assets/quml/index.html',
    android: 'file:///android_asset/quml/index.html',
  });

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={Platform.OS === 'ios' ? htmlFilePath : { uri: htmlFilePath }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleWebViewMessage}
        scalesPageToFit={true}
        startInLoadingState={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default QuMLPlayer;
