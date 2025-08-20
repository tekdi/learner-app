import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from 'react-native-geolocation-service'; // GeoLocation Comment
import location from '../../assets/images/png/location.png';
import { useTranslation } from '../../context/LanguageContext';
import globalStyles from '../../utils/Helper/Style';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { reverseGeocode } from '../../utils/API/AuthService';
import { setDataInStorage } from '../../utils/JsHelper/Helper';

import GlobalText from '@components/GlobalText/GlobalText';

const EnableLocationScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  //GeoLocation Comment

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location ' +
              'so we can show your current position.',
            buttonNeutral: 'Ask Me Later',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          getLocation();
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = async () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const data = await reverseGeocode(
          position?.coords?.latitude,
          position?.coords?.longitude
        );
        await setDataInStorage('geoData', JSON.stringify(data));
        disableLocation();
      },
      (error) => {
        console.log('Error: ', error);
        disableLocation();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const disableLocation = () => navigation.navigate('RegisterScreen');

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
      <StatusBar
        barStyle="dark-content"
        // translucent={true}
        backgroundColor="transparent"
      />
      <Image style={{ width: '100%' }} source={location} resizeMode="cover" />
      <View style={{ width: '80%', marginTop: 50 }}>
        <GlobalText style={[globalStyles.h5, { textAlign: 'center' }]}>
          {t(
            'enable_location_to_discover_nearby_skilling_centers_and_more_opportunities_tailored_just_for_you'
          )}
        </GlobalText>
      </View>
      <View style={{ width: '90%', marginVertical: 30 }}>
        <PrimaryButton onPress={requestLocationPermission} text={t('enable')} />
      </View>
      <TouchableOpacity style={styles.button} onPress={disableLocation}>
        <GlobalText style={styles.buttonText}>{t('not_now')}</GlobalText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: '#0D599E', // Black text color
    fontSize: 16,
    fontWeight: '700',
    // marginTop: -30,
    fontFamily: 'Poppins-Medium',
  },
});

export default EnableLocationScreen;
