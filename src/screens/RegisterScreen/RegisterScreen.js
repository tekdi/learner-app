import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import RegistrationForm from './RegistrationForm';
import {
  getGeoLocation,
  getStudentForm,
  reverseGeocode,
} from '../../utils/API/AuthService';
import Loading from '../LoadingScreen/Loading';
import { registerSchema } from './RegisterSchema';
import { setDataInStorage } from '../../utils/JsHelper/Helper';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import Geolocation from 'react-native-geolocation-service';

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
    setDataInStorage('states', JSON.stringify(data?.values));
    return data?.values;
  };

  // GetLocation Comment

  const getLocation = async () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const data = await reverseGeocode(
          position?.coords?.latitude,
          position?.coords?.longitude
        );
        setgeoData(data);
        setDataInStorage('geoData', JSON.stringify(data));
      },
      (error) => {
        console.log('Error: ', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchData = async () => {
    const data = await getStudentForm();
    if (data?.error) {
      setNetworkError(true);
    } else {
      const states = await fetchstates();
      setDataInStorage('studentForm', JSON.stringify(data?.fields));
      let schema = await registerSchema(data?.fields, states);
      getLocation(); // GetLocation Comment
      setMainSchema(schema);
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
      <RegistrationForm schema={mainSchema} geoData={geoData} />
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
