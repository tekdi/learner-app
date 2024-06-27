import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomCard = ({ title, style, bold }) => {
  return (
    <View style={[styles.card, style]}>
      <Text style={[styles.title, {fontFamily: bold==="bold" ? 'Poppins-Medium' : 'Poppins-Regular'}]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingLeft: 20,
    flex: 1,
    height: 60,
    justifyContent: 'center', // Center vertically
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0C5B4',
    margin: 10,
  },
  title: {
    paddingTop:10,
    fontSize: 20,
    color:'black',
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
});

export default CustomCard;
