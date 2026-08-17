import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ProfileUpdateForm from './ProfileUpdateForm';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import {
  getDataFromStorage,
  getMergedProfileSchema,
} from '../../utils/JsHelper/Helper';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
// import Geolocation from 'react-native-geolocation-service'; //GeoLocation Comment

const ProfileUpdateScreen = () => {
  const [mainSchema, setMainSchema] = useState([]);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const updateOrder = (data) => {
    return data.map((item) => {
      // Make father_name, mother_name, and spouse_name required if they exist in the schema
      if (['father_name', 'mother_name', 'spouse_name'].includes(item.name)) {
        return { ...item, order: '1', isRequired: true };
      }
      return { ...item, order: '1' };
    });
  };
  const fetchData = async () => {
    const tenantData = JSON.parse(await getDataFromStorage('tenantData'));
    const tenantId = tenantData?.[0]?.tenantId;

    try {
      const filteredSchema = await getMergedProfileSchema(tenantId);
      const updatedSchema = updateOrder(filteredSchema);
      console.log("updatedSchema",updatedSchema);
      setMainSchema(updatedSchema);
      setNetworkError(false);
    } catch {
      setNetworkError(true);
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
