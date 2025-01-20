import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ProfileUpdateSchema } from './ProfileUpdateSchema';
import ProfileUpdateForm from './ProfileUpdateForm';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import { getStudentForm } from '../../utils/API/AuthService';
import { setDataInStorage } from '../../utils/JsHelper/Helper';
import Loading from '../LoadingScreen/Loading';
// import Geolocation from 'react-native-geolocation-service'; //GeoLocation Comment

const ProfileUpdateScreen = () => {
  const [mainSchema, setMainSchema] = useState([]);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const fetchData = async () => {
    const data = await getStudentForm();
    // console.log({ data });
    if (data?.error) {
      setNetworkError(true);
    } else {
      // const states = await fetchstates();
      setDataInStorage('studentForm', JSON.stringify(data?.fields));
      let schema = await ProfileUpdateSchema();
      setMainSchema(schema);
      setNetworkError(false);
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
      <ProfileUpdateForm fields={mainSchema} />
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
export default ProfileUpdateScreen;
