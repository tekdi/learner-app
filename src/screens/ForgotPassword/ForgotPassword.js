import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import globalStyles from '../../utils/Helper/Style';
import CustomTextInput from '../../components/CustomTextField/CustomTextInput';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useTranslation } from '../../context/LanguageContext';
import HorizontalLine from '../../components/HorizontalLine/HorizontalLine';
import Logo from '../../assets/images/png/logo.png';
import lock_open from '../../assets/images/png/lock_open.png';

const ForgotPassword = () => {
  const [value, setvalue] = useState('');
  const [error, seterror] = useState(false);
  const { t } = useTranslation();
  handleInput = (e) => {
    console.log({ e });
    setvalue(e);
    seterror(false);
  };
  onPress = () => {
    if (value < 1) {
      seterror(true);
    }
    console.log('hi', value);
  };

  return (
    <KeyboardAvoidingView style={[globalStyles.container, { paddingTop: 50 }]}>
      <View style={styles.view}>
        <Image style={styles.image} source={Logo} resizeMode="contain" />
        <Image style={styles.image2} source={lock_open} resizeMode="contain" />

        <Text style={[globalStyles.heading, { marginBottom: 10 }]}>
          {t('trouble_with_logging_in')}
        </Text>
        <Text
          style={[globalStyles.text, { marginBottom: 20, textAlign: 'center' }]}
        >
          {t('forgot_password_desp')}
        </Text>
        <CustomTextInput
          error={error}
          field="username"
          onChange={handleInput}
          value={value}
        />
        <PrimaryButton onPress={onPress} text={t('next')}></PrimaryButton>
      </View>
      <View style={{ width: '60%', alignSelf: 'center' }}></View>
      <View
        style={{
          position: 'relative',
          top: '20%',
          alignSelf: 'center',
          width: '100%',
        }}
      >
        <HorizontalLine />
        <Text
          style={[
            globalStyles.text,
            { textAlign: 'center', padding: 30, color: '#0D599E' },
          ]}
        >
          {t('back_to_login')}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 60,
    height: 60,
    marginVertical: 30,
  },
  image2: {
    width: 40,
    height: 40,
    marginBottom: 30,
  },
});

ForgotPassword.propTypes = {};

export default ForgotPassword;
