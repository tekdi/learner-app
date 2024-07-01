import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { fields } from '../../screens/RegisterScreen/RegisterScreenData/interestedfields'

const InterestedCardsComponent = () => {

    const [selectedId,setIds]= useState([]);
    const [formData]=useState({})


    const Pressed=(item)=> {
        if(selectedId.includes(item.id)){
            setIds((prevIds) => prevIds.filter((id) => id !== item.id));   
            }
        else {
            console.log(formData) 
            setIds((prevIds) => [...prevIds, item.id])
            }
    }

  return (
    <View style={styles.container}>
        <Text style={{color:'black', fontFamily:'Poppins-Regular', paddingLeft: 10}}>Choose at least 3</Text>
        <ScrollView>
            <View style={{flexWrap: 'wrap', flexDirection:'row', marginTop:10}}>
                {fields.map((item)=> (
                    <TouchableOpacity key={item.id} onPress={()=> {Pressed(item)}} style={{marginTop: 3}}>
                    <View  style={{ backgroundColor: selectedId.includes(item.id)? '#FEEDA1': 'white' ,margin: 5, padding:7, borderRadius: 10, height: 40, borderWidth:1, borderColor:'#DADADA'}}><Text style={{color:'black', fontSize: 16, fontFamily:'Poppins-Medium'}}>{item.title}</Text></View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    </View>
  )
}
const styles =StyleSheet.create({
    container: {
        marginTop: 30,
    },
 
})
export default InterestedCardsComponent