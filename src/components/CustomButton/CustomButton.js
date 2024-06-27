import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Button } from '@ui-kitten/components';

const CustomButton = ({ text, onPress }) => {
  return (
    <View>
      <Button
        onPress={onPress}
        status="primary"
        style={{
          borderRadius: 30,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {(props) => (
          <Text {...props} style={styles.buttontext}>
            {text}
          </Text>
        )}
      </Button>
    </View>
  );
};
CustomButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
};
const styles = StyleSheet.create({
  buttontext: {
    textAlign: 'center',
    fontSize: 17,
    color: 'black',
    width: '100%',
    fontFamily: 'Poppins-Medium',
  },
});

export default CustomButton;
