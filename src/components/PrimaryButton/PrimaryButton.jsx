import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Button } from '@ui-kitten/components';

const PrimaryButton = ({ text, onPress,isDisabled,color }) => {
  console.log({isDisabled});
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
          ...(color && {backgroundColor:color}) 
        }}
        disabled={isDisabled}
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
PrimaryButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  isDisabled:PropTypes.bool
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

export default PrimaryButton;
