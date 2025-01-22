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
  Modal,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service'; // GeoLocation Comment
import location from '../../assets/images/png/location.png';
import { useTranslation } from '../../context/LanguageContext';
import globalStyles from '../../utils/Helper/Style';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { reverseGeocode } from '../../utils/API/AuthService';
import { setDataInStorage } from '../../utils/JsHelper/Helper';
import Icon from 'react-native-vector-icons/FontAwesome6';

import GlobalText from '@components/GlobalText/GlobalText';

const EnableLocationModal = ({ enable, setEnable, setUpdateEnable }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  //GeoLocation Comment

  const requestLocationPermission = async () => {
    console.log('running');

    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location ' +
              'so we can show your current position.',
            buttonPositive: 'OK',
          }
        );
        console.log('granted', granted);

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          getLocation();
        } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
          console.log('Location permission denied');
          Alert.alert(
            'Permission Denied',
            'Location permission is required to use this feature. Please enable it in settings.'
          );
          setEnable(false);
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          console.log('Location permission set to never ask again');
          Alert.alert(
            'Permission Denied',
            'Location permission is permanently denied. To enable it, go to app settings.'
          );
          setEnable(false);
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
        console.log('data', data);

        await setDataInStorage('geoData', JSON.stringify(data));
        if (data) {
          setUpdateEnable(true);
          setEnable(false);
        }
      },
      (error) => {
        console.log('Error: ', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <Modal visible={enable} transparent={true} animationType="slide">
      <View style={styles.modalContainer} activeOpacity={1}>
        <View style={styles.alertBox}>
          <TouchableOpacity
            style={{
              padding: 10,
              alignItems: 'flex-end',
            }}
            onPress={() => {
              setEnable(false);
            }}
          >
            <Icon name={'xmark'} size={30} color={'#4D4639'} />
          </TouchableOpacity>
          <View
            style={{
              borderColor: '#FDBE161A',
              borderBottomWidth: 1,
              borderTopWidth: 1,
            }}
          >
            <Image
              style={{ width: '100%', height: 200 }}
              source={location}
              resizeMode="cover"
            />
            <View>
              <GlobalText
                style={[
                  globalStyles.text,
                  {
                    textAlign: 'center',
                    marginVertical: 10,
                    paddingHorizontal: 10,
                  },
                ]}
              >
                {t(
                  'enable_location_to_discover_nearby_skilling_centers_and_more_opportunities_tailored_just_for_you'
                )}
              </GlobalText>
            </View>
          </View>
          <View
            style={{
              width: 200,
              alignSelf: 'center',
              paddingVertical: 20,
            }}
          >
            <PrimaryButton
              onPress={requestLocationPermission}
              text={t('enable')}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: '#0D599E', // Black text color
    fontSize: 16,
    fontWeight: '600',
    marginTop: -30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    // alignItems: 'center',
    // padding: 10,
  },
});

export default EnableLocationModal;
