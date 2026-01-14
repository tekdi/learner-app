import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ProfileUpdateForm from './ProfileUpdateForm';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import { getStudentForm } from '../../utils/API/AuthService';
import {
  getDataFromStorage,
  setDataInStorage,
} from '../../utils/JsHelper/Helper';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
// import Geolocation from 'react-native-geolocation-service'; //GeoLocation Comment

const ProfileUpdateScreen = () => {
  const [mainSchema, setMainSchema] = useState([]);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const updateOrder = (data) => {
    return data.map((item) => ({ ...item, order: '1' }));
  };
  const fetchData = async () => {
    const data = await getStudentForm();
    const tenantData = JSON.parse(await getDataFromStorage('tenantData'));
    const tenantId = tenantData?.[0]?.tenantId;
    const programForm = await getStudentForm(tenantId);
    setDataInStorage('studentProgramForm', JSON.stringify(programForm?.fields));
    const newSchema = [...data.fields, ...programForm.fields];
    const filteredSchema = newSchema.filter(
      (field) => field.name !== 'center' && field.name !== 'batch'
    );
    const updatedSchema = updateOrder(filteredSchema);
    console.log("updatedSchema",updatedSchema);
    if (data?.error) {
      setNetworkError(true);
    } else {
      // const states = await fetchstates();
      setDataInStorage('studentForm', JSON.stringify(data?.fields));
      setMainSchema(updatedSchema);
      setNetworkError(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return loading ? (
    <ActiveLoading />
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
