import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome6';
import GlobalText from '@components/GlobalText/GlobalText';
import Clipboard from '@react-native-clipboard/clipboard';

const CustomTextField = ({
  handleValue,
  field,
  formData,
  errors,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
  text,
  editable = true,
}) => {
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(false);

  const handleCopyLink = (zoomLink) => {
    Clipboard.setString(zoomLink); // Copy the Zoom link to the clipboard
    setShowToast(true); // Show toast message
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          { 
            borderColor: errors[field.name] ? 'red' : '#DADADA',
            backgroundColor: editable ? 'white' : '#F5F5F5',
            color: editable ? 'black' : '#A0A0A0'
          },
        ]}
        value={formData[field.name] || ''}
        onChangeText={(text) => handleValue(field.name, text.trim())}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize} // Disable auto-capitalization
        keyboardType={keyboardType} // Opens numeric keyboard by default
        editable={editable}
      />
      {text && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 0,
            marginRight: 30,
            marginTop: 15,
            alignSelf: 'center',
          }}
          onPress={() => handleCopyLink(formData[field.name])}
        >
          <Icon
            name={showToast ? 'clipboard-check' : 'copy'}
            color={showToast ? '#1A8825' : '#0D599E'}
            size={25}
          />
        </TouchableOpacity>
      )}
      <View style={styles.overlap}>
        <GlobalText
          style={[
            styles.text,
            { color: errors[field.name] ? 'red' : '#4D4639' },
          ]}
        >
          {t(field.label.toLowerCase())}
          {!field?.isRequired &&
            !['guardian_name', 'guardian_relation'].includes(field.name) &&
            `(${t('optional')})`}
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
          {errors[field.name]}
        </GlobalText>
      )}
      <View>{text}</View>
    </View>
  );
};

CustomTextField.propTypes = {
  position: PropTypes.string,
  key: PropTypes.any,
  field: PropTypes.object,
  control: PropTypes.object,
  errors: PropTypes.object,
  secureTextEntry: PropTypes.any,
  editable: PropTypes.bool,
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
    top: -62,
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
