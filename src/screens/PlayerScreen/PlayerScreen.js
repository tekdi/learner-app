import {
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useTranslation } from '../../context/LanguageContext';

import Logo from '../../assets/images/png/logo.png';

import { WebView } from 'react-native-webview';

import Orientation from 'react-native-orientation-locker';

const PlayerScreen = () => {
  useEffect(() => {
    // Lock the screen to landscape mode
    Orientation.lockToPortrait();

    // Unlock orientation when component is unmounted
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

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
        <Text style={styles.title}>Content Players</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container_scroll}>
        <View style={{ padding: 10 }}></View>
        <PrimaryButton
          text={'QuML Player: Online'}
          onPress={() => {
            nav.navigate('QuMLPlayer');
          }}
        />
        <View style={{ padding: 10 }}></View>
        <PrimaryButton
          text={'Pdf Player: Online'}
          onPress={() => {
            nav.navigate('PdfPlayer');
          }}
        />
        <View style={{ padding: 10 }}></View>
        <PrimaryButton
          text={'Pdf Player: Offline'}
          onPress={() => {
            nav.navigate('PdfPlayerOffline');
          }}
        />
        <View style={{ padding: 10 }}></View>
        <PrimaryButton
          text={'Video Player: Online'}
          onPress={() => {
            nav.navigate('VideoPlayer');
          }}
        />
        <View style={{ padding: 10 }}></View>
        <PrimaryButton
          text={'Video Player: Offline'}
          onPress={() => {
            nav.navigate('VideoPlayerOffline');
          }}
        />
        <View style={{ padding: 10 }}></View>
        <PrimaryButton
          text={'Epub Player: Online'}
          onPress={() => {
            nav.navigate('EpubPlayer');
          }}
        />
        <View style={{ padding: 10 }}></View>
        <PrimaryButton
          text={'Epub Player: Offline'}
          onPress={() => {
            nav.navigate('EpubPlayerOffline');
          }}
        />
        <View style={{ padding: 10 }}></View>
        <PrimaryButton
          text={'ECML Player: Online'}
          onPress={() => {
            nav.navigate('ECMLPlayer');
          }}
        />
        <View style={{ padding: 10 }}></View>
        <PrimaryButton
          text={'ECML Player: Offline'}
          onPress={() => {
            nav.navigate('ECMLPlayerOffline');
          }}
        />
        <View style={{ padding: 10 }}></View>
        <PrimaryButton
          text={'H5P Player: Online'}
          onPress={() => {
            nav.navigate('H5PPlayer');
          }}
        />
        <View style={{ padding: 10 }}></View>
        <PrimaryButton
          text={'H5P Player: Offline'}
          onPress={() => {
            nav.navigate('H5PPlayerOffline');
          }}
        />
        <View style={{ padding: 10 }}></View>
        <PrimaryButton
          text={'HTML Player: Online'}
          onPress={() => {
            nav.navigate('HTMLPlayer');
          }}
        />
        <View style={{ padding: 10 }}></View>
        <PrimaryButton
          text={'HTML Player: Offline'}
          onPress={() => {
            nav.navigate('HTMLPlayerOffline');
          }}
        />
        <View style={{ padding: 10 }}></View>
        <PrimaryButton
          text={'Youtube Player: Online'}
          onPress={() => {
            nav.navigate('YoutubePlayer');
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container_scroll: { padding: 10 },
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
