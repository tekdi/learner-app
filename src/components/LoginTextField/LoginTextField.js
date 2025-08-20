import { View, StyleSheet, TextInput, Text } from 'react-native';
import { useState, React } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';

import GlobalText from "@components/GlobalText/GlobalText";

const LoginTextField = ({ text, position = 'static', onChangeText, value }) => {
  const [passwordView, setPasswordView] = useState(false);
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none" // Ensures keyboard stays in lowercase
        secureTextEntry={text === 'password' && !passwordView}
        onChangeText={onChangeText}
        value={value}
        style={[styles.input, { position: position }]}
      />

      <View style={styles.overlap}>
        <GlobalText style={styles.text}> {t(text)} </GlobalText>
      </View>
      {text === 'password' && (
        <TouchableWithoutFeedback
          onPress={() => {
            setPasswordView(!passwordView);
          }}
          style={styles.password}
        >
          <Icon
            name={passwordView ? 'eye' : 'eye-slash'}
            color="black"
            size={30}
          />
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

LoginTextField.propTypes = {
  text: PropTypes.string,
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  position: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
    zIndex: -1,
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
    top: -66,
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
  password: {
    // borderWidth: 1,
    textAlign: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    top: 15,
    right: 25,
  },
});

export default LoginTextField;
