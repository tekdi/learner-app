import { View, StyleSheet, TextInput, Text} from 'react-native'
import React from 'react'


const CustomTextField= ({text=" Hello World ", position="static", onChangeText, value}) => {

  return (
    <View style={styles.container}>
        <TextInput
        onChangeText={onChangeText}
        value={value}
        style={[styles.input, {position: position}]}
        />
        <View style={styles.overlap}>
        <Text style={styles.text}> {text} </Text>
      </View>
    </View>
  );
}
export default CustomTextField
const styles =StyleSheet.create({
    container: {
        width: "100%",
        alignItems: 'flex-start',
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor:'white'
    },
    input:{
        backgroundColor: 'white',
        width: '100%',
        height: 65,
        borderRadius: 7,
        borderColor: '#DADADA',
        borderWidth: 1.4,
        color: 'black',
        paddingLeft: 20,
        fontSize: 20,
        fontFamily: 'Poppins-Regular',
    },
    overlap:{
        top: -76,
        left: 13,
        // top: -76,
        // left: -120,
        backgroundColor: 'white'
    },
    text:{
        color:"#4D4639",
     paddingLeft: 2,
     fontFamily: 'Poppins-Regular',
     paddingRight: 2  
    }
})
