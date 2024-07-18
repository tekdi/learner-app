import { View, Image, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import Logo from '../../assets/images/png/logo-with-tagline.png';
import { Spinner } from '@ui-kitten/components';

const Loading = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image style={styles.image} source={Logo} resizeMode="contain" />
        <Spinner size="large" style={{ borderColor: '#635E57' }} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginBottom: 20,
    height: 100,
    width: '100%',
  },
});

export default Loading;
