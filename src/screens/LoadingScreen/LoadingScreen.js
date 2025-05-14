import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
//GeoLocation Comment
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import Loading from './Loading';

const LoadingScreen = ({ navigation }) => {
  //GeoLocation Comment
  // const checkLocationPermissionAndGPS = async () => {
  //   try {
  //     if (Platform.OS === 'android') {
  //       // Check if location permission is granted
  //       const permissionGranted = await PermissionsAndroid.check(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //       );

  //       if (permissionGranted) {
  //         // Check if GPS is enabled
  //         const gpsEnabled = await DeviceInfo.isLocationEnabled();
  //         console.log({ gpsEnabled });

  //         if (gpsEnabled) {
  //           navigation.replace('LanguageScreen'); // Navigate to LanguageScreen if GPS and permission are granted
  //         } else {
  //           navigation.replace('EnableLocationScreen'); // Navigate to EnableLocationScreen if GPS is not enabled
  //         }
  //       } else {
  //         navigation.replace('EnableLocationScreen'); // Navigate to EnableLocationScreen if permission is not granted
  //       }
  //     } else {
  //       // For iOS, handle location permission and GPS check
  //       const status = await Geolocation.requestAuthorization('whenInUse');
  //       if (status === 'granted') {
  //         Geolocation.getCurrentPosition(
  //           (position) => {
  //             navigation.replace('LanguageScreen'); // Navigate to LanguageScreen if permission and GPS are enabled
  //           },
  //           (error) => {
  //             if (error.code === 1) {
  //               navigation.replace('EnableLocationScreen'); // GPS is disabled, navigate to EnableLocationScreen
  //             }
  //           }
  //         );
  //       } else {
  //         navigation.replace('EnableLocationScreen'); // Navigate to EnableLocationScreen if permission is not granted
  //       }
  //     }
  //   } catch (error) {
  //     console.warn(error);
  //     navigation.replace('EnableLocationScreen'); // Navigate to EnableLocationScreen if there's an error
  //   }
  // };

  useEffect(() => {
    // checkLocationPermissionAndGPS();
    navigation.replace('LanguageScreen');
  }, [navigation]);

  return <Loading />;
};

LoadingScreen.propTypes = {
  navigation: PropTypes.any,
};

export default LoadingScreen;
