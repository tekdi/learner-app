import { View, StyleSheet, TextInput, Text } from 'react-native';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from '../../context/LanguageContext';

const CustomTextField = ({
  position = 'static',
  secureTextEntry,
  key,
  field,
  control,
  errors = {},
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
            onChangeText={onChange}
            secureTextEntry={secureTextEntry}
          />
          <View style={styles.overlap}>
            <Text
              style={[
                styles.text,
                { color: errors[field.name] ? 'red' : '#4D4639' },
              ]}
            >
              {t(field.label)}
            </Text>
          </View>
          {errors[field.name] && (
            <Text
              style={{
                color: 'red',
                alignSelf: 'flex-start',
                marginBottom: 10,
                marginTop: -20,
                fontFamily: 'Poppins-Regular',
              }}
            >
              {errors[field.name].message}
            </Text>
          )}
        </View>
      )}
    />
  );
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
    fontSize: 20,
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
