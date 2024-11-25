import { View, StyleSheet, TextInput, Text } from 'react-native';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';

import GlobalText from "@components/GlobalText/GlobalText";

const CustomTextField = ({
  position = 'static',
  secureTextEntry,
  key,
  field,
  control,
  errors = {},
  keyboardType,
  autoCapitalize,
}) => {
  const { t } = useTranslation();

  return (
    <Controller
      key={key}
      control={control}
      name={field.name}
      render={({ field: { onChange, value, onBlur } }) => (
        <View style={styles.container}>
          <TextInput
            style={[
              styles.input,
              { position: position },
              { borderColor: errors[field.name] ? 'red' : '#DADADA' },
            ]}
            onBlur={onBlur}
            value={value}
            onChangeText={(text) => {
              const sanitizedText = text.replace(/\s/g, ''); // Remove all spaces
              onChange(sanitizedText);
            }}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize} // Disable auto-capitalization
            keyboardType={keyboardType} // Opens numeric keyboard by default
          />
          <View style={styles.overlap}>
            <GlobalText
              style={[
                styles.text,
                { color: errors[field.name] ? 'red' : '#4D4639' },
              ]}
            >
              {t(field.label)}
            </GlobalText>
          </View>
          {errors[field.name] && (
            <GlobalText
              style={{
                color: 'red',
                alignSelf: 'flex-start',
                marginBottom: 10,
                marginTop: -20,
                fontFamily: 'Poppins-Regular',
              }}
            >
              {errors[field.name].message}
            </GlobalText>
          )}
        </View>
      )}
    />
  );
};

CustomTextField.propTypes = {
  position: PropTypes.string,
  key: PropTypes.any,
  field: PropTypes.object,
  control: PropTypes.object,
  errors: PropTypes.object,
  secureTextEntry: PropTypes.any,
};

export default CustomTextField;
const styles = StyleSheet.create({
  container: {
    width: '100%',
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
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  overlap: {
    top: -65,
    left: 13,
    // top: -76,
    // left: -120,
    backgroundColor: 'white',
  },
  text: {
    color: '#4D4639',
    paddingLeft: 2,
    fontFamily: 'Poppins-Regular',
    paddingRight: 2,
  },
});
