import { View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native'
import React from 'react'
import CustomTextField from '../../components/CustomTextField/CustomTextField'
import { CheckBox } from '@ui-kitten/components'
import backIcon from '../../assets/images/png/arrow-back-outline.png'
import CustomButton from '../../components/CustomButton/CustomButton'
import { useNavigation } from '@react-navigation/native'


const LoginScreen = () => {

    const navigation= useNavigation()


  return (
    <View style={styles.container}>
         <TouchableOpacity style={styles.backbutton} onPress={()=> {navigation.navigate("LoginSignUpScreen")}}>
        <Image source={backIcon} resizeMode='contain' style={{ width: 30, height: 30,}}/>
        <Text>Back</Text>
      </TouchableOpacity>
      <View style={styles.textfieldbox}>
      <CustomTextField text='Username'/>
      <View style={{padding: 10}}></View>
      <CustomTextField text='Password'/>
      </View>
      <TouchableOpacity style={{paddingLeft: 20, marginBottom: 30}}>
        <Text style={{color:'#0D599E', fontFamily:'Poppins-Medium', fontSize: 15}}>Forgot Password?</Text>
      </TouchableOpacity>
      <View style={styles.rembox}>
            <CheckBox style={{paddingLeft: 10}}/>
        <View style={{paddingLeft: 10}}>
            <Text style={{color:'black',fontFamily:'Poppins-Regular', fontSize: 17}}>Remember me</Text>
        </View>
        </View>
        <View style={{ position:'absolute', bottom: 10, padding: 10, alignSelf:'center'}}>
        <CustomButton text="Login" onPress={()=> {
            navigation.navigate("LoginSignUpScreen")
        }}/>
        </View>
        </View>
  )
}
const styles = StyleSheet.create({
    backbutton: {
    
    },
    container: {
        flex: 1,
        height: "100%",
        paddingTop: 50,
        padding: 20,
        backgroundColor: 'white',
    },
    textfieldbox: {
        marginTop:40
    },
    rembox: {
        alignContent: 'center',
        flexDirection:'row'
    }
}
)
export default LoginScreen