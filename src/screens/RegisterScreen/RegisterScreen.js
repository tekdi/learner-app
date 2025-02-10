import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import {
  getGeoLocation,
  getStudentForm,
  reverseGeocode,
} from '../../utils/API/AuthService';
import Loading from '../LoadingScreen/Loading';
import {
  getDataFromStorage,
  setDataInStorage,
} from '../../utils/JsHelper/Helper';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import RegistrationForm from './RegistrationForm';
import Geolocation from 'react-native-geolocation-service'; // GeoLocation Comment

const RegisterScreen = () => {
  const [mainSchema, setMainSchema] = useState([]);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [geoData, setgeoData] = useState();

  const fetchstates = async () => {
    const payload = {
      limit: 10,
      offset: 0,
      fieldName: 'states',
    };
    const data = await getGeoLocation({ payload });
    setDataInStorage('states', JSON.stringify(data?.values || []));
    return data?.values;
  };

  // GetLocation Comment

  const getLocationFromGoogle = async () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const data = await reverseGeocode(
          position?.coords?.latitude,
          position?.coords?.longitude
        );
        await setDataInStorage('geoData', JSON.stringify(data));
      },
      (error) => {
        console.log('Error: ', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const getLocation = async () => {
    await getLocationFromGoogle();
    const data = JSON.parse(await getDataFromStorage('geoData'));
    setgeoData(data);
  };

  const fetchData = async () => {
    const data = await getStudentForm();
    if (data?.error) {
      setNetworkError(true);
    } else {
      await fetchstates();
      setDataInStorage('studentForm', JSON.stringify(data?.fields));
      let schema = data?.fields;
      setMainSchema(schema);
      getLocation(); // GetLocation Comment
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container}>
      <RegistrationForm geoData={geoData} fields={mainSchema} />
      <NetworkAlert onTryAgain={fetchData} isConnected={!networkError} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
export default RegisterScreen;
