import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton2 from '../../components/CustomButtonOutlined/CustomButtonOutlined';
import CustomButton from '../../components/CustomButton/CustomButton';


const LoginSignUpScreen = () => {
  const nav = useNavigation();

  const navigate = () => {
    nav.navigate("LanguageScreen");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backbutton} onPress={navigate}>
        <Image source={backIcon} resizeMode='contain' style={{ width: 30, height: 30 }} />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>

        <CustomButton text="I am a new user"  onPress={()=> {nav.navigate("RegisterScreen")}}/>
        <View style={{padding: 10}}></View>
        <CustomButton2 />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backbutton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  buttonContainer: {
    padding: 10,
    flex: 1,
    marginBottom: 100,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
});

export default LoginSignUpScreen;
