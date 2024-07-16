import { View, StyleSheet, TextInput, Text } from 'react-native';
import { useState, React } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableWithoutFeedback } from '@ui-kitten/components/devsupport';

const LoginTextField = ({ text, position = 'static', onChangeText, value }) => {
  const [passwordView, setPasswordView] = useState(false);
  return (
    <View style={styles.container}>
      <TextInput
        secureTextEntry={text === 'Password' && !passwordView}
        onChangeText={onChangeText}
        value={value}
        style={[styles.input, { position: position }]}
      />

      <View style={styles.overlap}>
        <Text style={styles.text}> {text} </Text>
      </View>
      {text === 'Password' && (
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'flex-start',
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    height: 65,
    borderRadius: 7,
    borderColor: '#DADADA',
    borderWidth: 1.4,
    color: 'black',
    paddingLeft: 20,
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
  },
  overlap: {
    top: -76,
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
