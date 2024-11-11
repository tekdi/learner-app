import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import globalStyles from '../../utils/Helper/Style';
import CustomTextInput from '../../components/CustomTextField/CustomTextInput';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useTranslation } from '../../context/LanguageContext';
import HorizontalLine from '../../components/HorizontalLine/HorizontalLine';
import Logo from '../../assets/images/png/logo.png';
import lock_open from '../../assets/images/png/lock_open.png';
import { forgotPassword } from '../../utils/API/AuthService';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
  const [value, setvalue] = useState('');
  const [username, setusename] = useState('');
  const [modalError, setmodalError] = useState('');
  const [modal, setmodal] = useState(false);
  const [error, seterror] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();

  handleInput = (e) => {
    console.log({ e });
    setvalue(e.trim());
    seterror(false);
  };

  const forgotPasswordAPi = async () => {
    const payload = {
      username: value,
      redirectUrl: `pratham://learnerapp`,
    };
    const data = await forgotPassword({ payload });
    if (data?.params?.err !== undefined) {
      console.log('reached');
      setmodalError(data?.params?.err);
    } else {
      console.log('reached else');
      setmodalError();
      setusename(data?.email);
    }
    setmodal(true);
    console.log(data?.email);
    console.log(data?.params?.err);
  };

  onPress = () => {
    if (value < 1) {
      seterror(true);
    } else {
      forgotPasswordAPi();
    }
  };

  function encryptEmail(email) {
    // Split the email into username and domain
    const [emailUsername, domain] = email.split('@');

    // Check if emailUsername is valid
    if (!emailUsername || emailUsername.length < 2) {
      return email; // Return the original email if it's too short
    }

    // Replace all but the first and last character of the username with asterisks
    const encryptedUsername =
      emailUsername.charAt(0) +
      '*'.repeat(emailUsername.length - 2) + // This will now always be >= 0
      emailUsername.charAt(emailUsername.length - 1);

    // Return the encrypted email
    return `${encryptedUsername}@${domain}`;
  }

  return (
    <KeyboardAvoidingView style={[globalStyles.container, { paddingTop: 50 }]}>
      <View style={styles.view}>
        <Image style={styles.image} source={Logo} resizeMode="contain" />
        <Image style={styles.image2} source={lock_open} resizeMode="contain" />

        <Text style={[globalStyles.heading, { marginBottom: 10 }]}>
          {t('trouble_with_logging_in')}
        </Text>
        {/* <Text
          style={[globalStyles.text, { marginBottom: 20, textAlign: 'center' }]}
        >
          {t('forgot_password_desp')}
        </Text> */}
        <CustomTextInput
          error={error}
          field="username"
          onChange={handleInput}
          value={value}
          autoCapitalize="none"
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
          onPress={() => {
            navigation.navigate('LoginScreen');
          }}
        >
          {t('back_to_login')}
        </Text>
      </View>
      <Modal visible={modal} transparent={true} animationType="slide" onclo>
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
          <View style={styles.alertBox}>
            <TouchableOpacity
              activeOpacity={1} // Prevent closing the modal when clicking inside the alert box
              style={styles.alertSubBox}
            >
              {modalError ? (
                <Text
                  allowFontScaling={false}
                  style={[
                    globalStyles.subHeading,
                    { textAlign: 'center', marginVertical: 10 },
                  ]}
                >
                  {t(modalError.toLowerCase().replace(/\s+/g, '_'))}
                </Text>
              ) : (
                <>
                  <Icon
                    name={'checkmark-circle-outline'}
                    size={60}
                    color="#1A8825"
                  />
                  <Text
                    allowFontScaling={false}
                    style={[
                      globalStyles.subHeading,
                      { textAlign: 'center', marginVertical: 10 },
                    ]}
                  >
                    {t('we_sent_an_email_to')} {encryptEmail(username)}{' '}
                    {t('with_a_link_to_get_back_to_your_account')}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <View style={styles.btnbox}>
              <PrimaryButton
                onPress={() => {
                  setmodal(false);
                }}
                text={t('ok')}
              ></PrimaryButton>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertSubBox: {
    padding: 20,
    alignItems: 'center',
  },
  img: {
    marginVertical: 10,
  },
  btnbox: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#D0C5B4',
    padding: 20,
  },
  btn: {
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

ForgotPassword.propTypes = {};

export default ForgotPassword;
