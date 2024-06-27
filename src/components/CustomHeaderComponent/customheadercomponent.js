import { Image, StyleSheet, View, Text, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import Logo from '../../assets/images/png/form.png';

const HeaderComponent = ({question, questionIndex}) => {
  return (
    <KeyboardAvoidingView style={styles.container}>
        <View style={styles.block}>
        <Image style={styles.image} source={Logo} resizeMode="contain" />
        <Text  style={styles.text1}>{questionIndex}/6</Text>
        <Text  style={styles.text2}>{question}</Text>
        </View>
        {/* <View style={{bottom:10, position: 'relative'}}>
        {/* <CustomButton text="Continue"/> */}
        </KeyboardAvoidingView>        
  )
}
const styles= StyleSheet.create({
    image: {
        margin: 20,
        height: 90,
        width: 70
    },
    container: {
        backgroundColor: 'white',
        // borderColor: 'green',
        // borderWidth: 2,
        maxHeight: 120,
        flex: 1,
    },
    text1: {
        left: 100,
        top: 40,
        position: 'absolute',
        color: '#7C766F',
        fontFamily: 'Poppins-Regular',
        fontSize: 18
    },
    text2: {
        position: 'absolute',
        width: "100%",
        fontFamily: 'Poppins-Medium',
        color: "black",
        left: 100,
        top: 70,
        fontSize: 20
    },
    block: {
        position: 'absolute',
        width: 250,
        // borderColor:'black',
        // borderWidth: 1
    },
})
export default HeaderComponent