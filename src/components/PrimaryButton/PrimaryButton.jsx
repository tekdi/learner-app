import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Button } from '@ui-kitten/components';

import GlobalText from "@components/GlobalText/GlobalText";

const PrimaryButton = ({ text, onPress, isDisabled, color }) => {
  return (
    <View>
      <Button
        onPress={onPress}
        status="primary"
        style={{
          borderRadius: 30,
          zIndex: 4,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          ...(color && { backgroundColor: color }),
        }}
        disabled={isDisabled}
      >
        {(props) => (
          <GlobalText {...props} style={styles.buttontext}>
            {text}
          </GlobalText>
        )}
      </Button>
    </View>
  );
};
PrimaryButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
  isDisabled: PropTypes.bool,
  color: PropTypes.string,
};
const styles = StyleSheet.create({
  buttontext: {
    textAlign: 'center',
    fontSize: 14.5,
    color: 'black',
    width: '100%',
    fontFamily: 'Poppins-Medium',
  },
});

export default PrimaryButton;
