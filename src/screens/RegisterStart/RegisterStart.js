import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  PermissionsAndroid,
} from 'react-native';
import SafeAreaWrapper from '../../components/SafeAreaWrapper/SafeAreaWrapper';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useTranslation } from '../../context/LanguageContext';
import FastImage from '@changwoolab/react-native-fast-image';
import { logEventFunction } from '../../utils/JsHelper/Helper';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import { useInternet } from '../../context/NetworkContext';
import DeviceInfo from 'react-native-device-info';

import GlobalText from '@components/GlobalText/GlobalText';
import globalStyles from '../../utils/Helper/Style';

const RegisterStart = () => {
  // Multi-language setup
  const { t } = useTranslation();
  const { isConnected } = useInternet();
  const navigation = useNavigation();
  // const [locationStatus, setLocationStatus] = useState(null);

  const navigate = () => {
    navigation.goBack();
  };

  const handleClick = async () => {
    if (isConnected) {
      const obj = {
        eventName: 'registration_started',
        method: 'button-click',
        screenName: 'Registration',
      };
      await logEventFunction(obj);
      // nav.navigate('EnableLocationScreen');
      checkLocationPermissionAndGPS();
    }
  };

  const checkLocationPermissionAndGPS = async () => {
    try {
      if (Platform.OS === 'android') {
        // Check if location permission is granted
        const permissionGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        console.log({ permissionGranted });

        if (permissionGranted) {
          // Check if GPS is enabled
          const gpsEnabled = await DeviceInfo.isLocationEnabled();
          console.log({ gpsEnabled });

          if (gpsEnabled) {
            navigation.replace('RegisterScreen'); // Navigate to LanguageScreen if GPS and permission are granted
          } else {
            navigation.replace('EnableLocationScreen'); // Navigate to EnableLocationScreen if GPS is not enabled
          }
        } else {
          navigation.replace('EnableLocationScreen'); // Navigate to EnableLocationScreen if permission is not granted
        }
      }
    } catch (error) {
      console.warn(error);
      navigation.replace('EnableLocationScreen'); // Navigate to EnableLocationScreen if there's an error
    }
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <View style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <TouchableOpacity style={styles.backbutton} onPress={navigate}>
            <Image
              source={backIcon}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 2 }}>
          {/* Icon png here */}
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <FastImage
              style={styles.gif_image}
              source={require('../../assets/images/gif/face.gif')}
              resizeMode={FastImage.resizeMode.contain}
              priority={FastImage.priority.high} // Set the priority here
            />
            <GlobalText style={[globalStyles.h5, { marginTop: 10 }]}>
              {t('lets_create_your_acc')}
            </GlobalText>
            <GlobalText style={[globalStyles.h5, { textAlign: 'center' }]}>
              {t('create_acc_desp')}
            </GlobalText>
          </View>
        </View>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={styles.buttonContainer}>
            <PrimaryButton text={t('continue')} onPress={handleClick} />
          </View>
        </View>
      </View>
      <NetworkAlert onTryAgain={handleClick} isConnected={isConnected} />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  backbutton: {
    position: 'absolute',
    top: 60,
    left: 0,
    zIndex: 1,
  },
  buttonContainer: {
    padding: 10,
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  gif_image: {
    height: 50,
    width: 50,
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
