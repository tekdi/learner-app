import { View, StyleSheet, TextInput, Text } from 'react-native';
import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';

const CustomTextInput = ({
  position = 'static',
  secureTextEntry,
  value, // Renamed from `key` to `inputKey`
  error,
  field,
  keyboardType,
  autoCapitalize,
  onChange, // Added the onChange handler
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <TextInput
        allowFontScaling={false}
        style={[
          styles.input,
          { position: position },
          { borderColor: error ? 'red' : '#DADADA' },
        ]}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
      />
      <View style={styles.overlap}>
        <Text
          allowFontScaling={false}
          style={[styles.text, { color: error ? 'red' : '#4D4639' }]}
        >
          {t(field)}
        </Text>
      </View>
      {error && (
        <Text
          allowFontScaling={false}
          style={{
            color: 'red',
            alignSelf: 'flex-start',
            marginBottom: 10,
            marginTop: -20,
            fontFamily: 'Poppins-Regular',
          }}
        >
          {field} {t('is_required')}
        </Text>
      )}
    </View>
  );
};

CustomTextInput.propTypes = {
  position: PropTypes.string,
  inputKey: PropTypes.any,
  field: PropTypes.string.isRequired, // Changed to string
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  autoCapitalize: PropTypes.string,
  onChange: PropTypes.func.isRequired, // Added required onChange prop
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // width: 280,
    alignItems: 'flex-start',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    height: 55,
    borderRadius: 7,
    borderColor: '#DADADA',
    borderWidth: 1.4,
    color: 'black',
    paddingLeft: 20,
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
  },
  overlap: {
    top: -65,
    left: 13,
    backgroundColor: 'white',
  },
  text: {
    color: '#4D4639',
    paddingLeft: 2,
    fontFamily: 'Poppins-Regular',
    paddingRight: 2,
  },
});
