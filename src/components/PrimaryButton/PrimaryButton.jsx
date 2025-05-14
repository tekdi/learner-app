import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Button } from '@ui-kitten/components';

import GlobalText from '@components/GlobalText/GlobalText';
import globalStyles from '../../utils/Helper/Style';

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
          <GlobalText {...props} style={[globalStyles.h6, styles.buttontext]}>
            {text}
          </GlobalText>
        )}
      </Button>
    </View>
  );
};
PrimaryButton.propTypes = {
  text: PropTypes.any,
  onPress: PropTypes.any,
  isDisabled: PropTypes.bool,
  color: PropTypes.string,
};
const styles = StyleSheet.create({
  buttontext: {
    textAlign: 'center',
    width: '100%',
    fontWeight: 700,
    fontFamily: 'Roboto-Black',
  },
});

export default PrimaryButton;
