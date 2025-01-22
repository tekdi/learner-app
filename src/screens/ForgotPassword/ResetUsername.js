import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
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
import { forgotPassword, updateUser } from '../../utils/API/AuthService';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';
import GlobalText from '@components/GlobalText/GlobalText';
import { getDataFromStorage } from '@src/utils/JsHelper/Helper';
import BackHeader from '@components/Layout/BackHeader';

const ResetUsername = () => {
  const [value, setvalue] = useState('');
  const [modalError, setmodalError] = useState('');
  const [modal, setmodal] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [error, seterror] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleInput = (e) => {
    console.log({ e });
    setvalue(e.trim());
    seterror(false);
    setIsDisabled(false);
  };

  const ChangeUserName = async () => {
    const payload = {
      userData: {
        username: value,
      },
    };

    const user_id = await getDataFromStorage('userId');
    const register = await updateUser({ payload, user_id });
    console.log('register', register);
    if (register?.params?.err) {
      setmodalError(register?.params?.err);
    }
    setmodal(true);
  };

  const onPress = () => {
    if (value < 1) {
      seterror(true);
    } else {
      ChangeUserName();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = JSON.parse(await getDataFromStorage('profileData'));
      console.log();
      setvalue(result?.getUserDetails?.[0]?.username);
    };
    fetchData();
  }, []);

  return (
    <>
      <SecondaryHeader logo />
      <KeyboardAvoidingView style={[globalStyles.container]}>
        <BackHeader title={'change_username'} />
        <View style={styles.view}>
          <CustomTextInput
            error={error}
            field="username"
            onChange={handleInput}
            value={value}
            autoCapitalize="none"
          />
          <PrimaryButton
            isDisabled={isDisabled}
            onPress={onPress}
            text={t('change_username')}
          />
        </View>
        {modal && (
          <Modal visible={modal} transparent={true} animationType="slide" onclo>
            <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
              <View style={styles.alertBox}>
                <TouchableOpacity
                  activeOpacity={1} // Prevent closing the modal when clicking inside the alert box
                  style={styles.alertSubBox}
                >
                  {modalError ? (
                    <GlobalText
                      style={[
                        globalStyles.subHeading,
                        { textAlign: 'center', marginVertical: 10 },
                      ]}
                    >
                      {t(modalError.toLowerCase().replace(/\s+/g, '_'))}
                    </GlobalText>
                  ) : (
                    <>
                      <Icon
                        name={'checkmark-circle-outline'}
                        size={60}
                        color="#1A8825"
                      />
                      <GlobalText
                        style={[
                          globalStyles.subHeading,
                          { textAlign: 'center', marginVertical: 10 },
                        ]}
                      >
                        {t('your_username_has_been_successfully_changed')}
                      </GlobalText>
                    </>
                  )}
                </TouchableOpacity>
                <View style={styles.btnbox}>
                  <PrimaryButton
                    onPress={() => {
                      navigation.goBack();
                    }}
                    text={t('ok')}
                  ></PrimaryButton>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </KeyboardAvoidingView>
    </>
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

ResetUsername.propTypes = {};

export default ResetUsername;
