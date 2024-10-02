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
// import Geolocation from 'react-native-geolocation-service'; //GeoLocation Comment

const RegisterScreen = () => {
  const [mainSchema, setMainSchema] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // const getLocation = async () => {
  //   Geolocation.getCurrentPosition(
  //     async (position) => {
  //       const data = await reverseGeocode(
  //         position.coords.latitude,
  //         position.coords.longitude
  //       );
  //       // console.log(data);

  //       setDataInStorage('geoData', JSON.stringify(data?.address));
  //     },
  //     (error) => {
  //       console.log('Error: ', error);
  //     },
  //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //   );
  // };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStudentForm();
      const states = await fetchstates();
      setDataInStorage('studentForm', JSON.stringify(data?.fields));
      let schema = await registerSchema(data?.fields, states);
      // getLocation(); // GetLocation Comment
      setMainSchema(schema);
      setLoading(false);
    };

    fetchData();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.container}>
      <RegistrationForm schema={mainSchema} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
export default RegisterScreen;
