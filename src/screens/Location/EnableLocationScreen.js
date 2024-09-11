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
import Geolocation from 'react-native-geolocation-service';
import location from '../../assets/images/png/location.png';
import { useTranslation } from '../../context/LanguageContext';
import globalStyles from '../../utils/Helper/Style';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';

const EnableLocationScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

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
          navigation.navigate('LanguageScreen');

          Geolocation.getCurrentPosition(
            (position) => {
              console.log('Location: ', position);
            },
            (error) => {
              console.log('Error: ', error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const disableLocation = () => navigation.navigate('LanguageScreen');

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <Image style={{ width: '100%' }} source={location} resizeMode="cover" />
      <View style={{ width: '80%', marginTop: 50 }}>
        <Text style={[globalStyles.heading2, { textAlign: 'center' }]}>
          {t(
            'enable_location_to_discover_nearby_skilling_centers_and_more_opportunities_tailored_just_for_you'
          )}
        </Text>
      </View>
      <View style={{ margin: 50 }}>
        <PrimaryButton onPress={requestLocationPermission} text={t('enable')} />
      </View>
      <TouchableOpacity style={styles.button} onPress={disableLocation}>
        <Text style={styles.buttonText}>{t('not_now')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: '#0D599E', // Black text color
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EnableLocationScreen;
