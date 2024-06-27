import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native';
import RegistrationFlow from './RegistrationFlow';
import { registrationConfig } from './RegisterScreenData/registrationConfig';


const RegisterScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
          <RegistrationFlow config={registrationConfig}/>
    </SafeAreaView>
    
  )
}
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
export default RegisterScreen