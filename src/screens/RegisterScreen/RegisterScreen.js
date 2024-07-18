import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import RegistrationForm from './RegistrationForm';
// import { schema } from './RegistrationSchema';
import { useNavigation } from '@react-navigation/native';
import { getStudentForm } from '../../utils/API/AuthService';
import Loading from '../LoadingScreen/Loading';
import { registerSchema } from './RegisterSchema';

const RegisterScreen = () => {
  const nav = useNavigation();

  const [mainSchema, setMainSchema] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getStudentForm();
      let schema = await registerSchema(data?.fields);
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
