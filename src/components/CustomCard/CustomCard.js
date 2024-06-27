import PropTypes from 'prop-types';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Card } from '@ui-kitten/components';

const CustomCard = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Text style={styles.text}>{text}</Text>
      </Card>
    </TouchableOpacity>
  );
};
CustomCard.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
};
const styles = StyleSheet.create({
  card: {
    padding: 0,
    textAlign: 'center',
    margin: 10,
    borderRadius: 20,
  },
  text: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
  },
});
export default CustomCard;
