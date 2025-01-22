import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { IconRegistry, Icon } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';

import GlobalText from '@components/GlobalText/GlobalText';

const EyeIcon = ({ setHidden, hidden }) => (
  <TouchableOpacity
    onPress={() => {
      setHidden(!hidden);
    }}
  >
    <Icon name={hidden ? 'eye-off-outline' : 'eye-outline'} />
  </TouchableOpacity>
);

const CustomPasswordTextField = ({ handleValue, field, formData, errors }) => {
  const [hidden, setHidden] = useState(true);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <IconRegistry icons={EvaIconsPack} />
      <TextInput
        style={[
          styles.input,
          { borderColor: errors[field.name] ? 'red' : '#DADADA' },
        ]}
        value={formData[field.name] || ''}
        onChangeText={(text) => handleValue(field.name, text)}
        secureTextEntry={hidden}
        autoCapitalize="none" // Disable auto-capitalization
      />
      <View style={styles.overlap}>
        <GlobalText
          style={[
            styles.text,
            { color: errors[field.name] ? 'red' : '#4D4639' },
          ]}
        >
          {t(field.name)}
        </GlobalText>
      </View>
      <View style={styles.overlap2}>
        <EyeIcon setHidden={setHidden} hidden={hidden} />
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
    </View>
  );
};

CustomPasswordTextField.propTypes = {
  position: PropTypes.string,
  key: PropTypes.any,
  field: PropTypes.object,
  control: PropTypes.object,
  errors: PropTypes.object,
};

EyeIcon.propTypes = {
  setHidden: PropTypes.func,
  hidden: PropTypes.bool,
};

export default CustomPasswordTextField;
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
  overlap2: {
    width: 32,
    height: 32,
    // borderColor:'black',
    // borderWidth:2,
    top: 15,
    left: '88%',
    position: 'absolute',
    // top: -76,
    // left: -120,
    backgroundColor: 'white',
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
