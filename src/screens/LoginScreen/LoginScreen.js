import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { useState, React, useEffect } from 'react';
import { CheckBox } from '@ui-kitten/components';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { login } from '../../utils/API/AuthService';
import {
  saveAccessToken,
  saveRefreshToken,
  saveToken,
} from '../../utils/JsHelper/Helper';
import LoginTextField from '../../components/LoginTextField/LoginTextField';
import CustomCheckbox from '../../components/CustomCheckbox/CustomCheckbox';
import { useTranslation } from '../../context/LanguageContext';
import Loading from '../LoadingScreen/Loading';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [savePassword, setSavePassword] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [errmsg, setErrmsg] = useState('');
  const [loading, setLoading] = useState(false);

  const onChangeText = (e) => {
    setUserName(e.trim());
  };
  const onChangePassword = (e) => {
    setPassword(e.trim());
  };
  const rememberPassword = (value) => {
    setSavePassword(value);
  };
  const acceptTermsandCondtions = (value) => {
    setAcceptTerms(value);
  };
  const handleLogin = async () => {
    setLoading(true);
    const payload = {
      username: userName,
      password: password,
    };
    const data = await login(payload);
    console.log({ data });
    if (data?.params?.status !== 'failed') {
      if (savePassword && data?.access_token) {
        await saveToken(data?.access_token || '');
        await saveRefreshToken(data?.refresh_token || '');
        navigation.navigate('Dashboard');
      } else if (data?.access_token) {
        navigation.navigate('Dashboard');
      } else {
        setErrmsg('Network_Error_Try_Again_Later');
        setLoading(false);
      }
      await saveAccessToken(data?.access_token || '');
      setLoading(false);
    } else {
      setErrmsg(data?.params?.errmsg.toLowerCase().replace(/ /g, '_'));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userName.length > 0 && password.length > 0 && acceptTerms) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [userName, password, acceptTerms]);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <TouchableOpacity
            style={styles.backbutton}
            onPress={() => {
              navigation.navigate('LanguageScreen');
            }}
          >
            <Image
              source={backIcon}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
            />
            <Text
              style={{
                color: '#000',
                fontSize: 20,
                fontWeight: '500',
                marginLeft: 10,
              }}
            >
              {t('back')}
            </Text>
          </TouchableOpacity>
          <View style={{ paddingVertical: 15 }}>
            <Text style={[styles.text, { fontSize: 23, fontWeight: '500' }]}>
              {t('login')}
            </Text>
            <Text style={[styles.text, { fontSize: 18 }]}>
              {t('login_with_the_cred')}
            </Text>
          </View>
          <View style={styles.textfieldbox}>
            <LoginTextField
              text="username"
              onChangeText={onChangeText}
              value={userName}
            />
            <View style={{ padding: 10 }}></View>
            <LoginTextField
              text="password"
              onChangeText={onChangePassword}
              value={password}
            />
            {errmsg !== '' && (
              <Text style={{ color: 'red', top: -10, left: 20 }}>
                {t(errmsg)}
              </Text>
            )}
          </View>
          {/* <TouchableOpacity style={{ paddingLeft: 20, marginBottom: 30 }}>
            <Text
              style={{
                color: '#0D599E',
                fontFamily: 'Poppins-Medium',
                fontSize: 15,
              }}
            >
              {t('forgot_password')}
            </Text>
          </TouchableOpacity> */}
          <View style={styles.rembox}>
            <CustomCheckbox value={savePassword} onChange={setSavePassword} />
            <View style={{ paddingLeft: 10 }}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  fontSize: 17,
                }}
              >
                {t('remember_me')}
              </Text>
            </View>
          </View>
          <View style={[styles.rembox, { paddingTop: 20 }]}>
            <View style={styles.controlContainer}>
              <CustomCheckbox value={acceptTerms} onChange={setAcceptTerms} />
            </View>
            <View style={{ paddingLeft: 10 }}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  fontSize: 17,
                }}
              >
                {t('Read_T_&_C')}
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('TermsAndCondition');
                }}
              >
                <Text
                  style={{
                    color: '#0D599E',
                    fontFamily: 'Poppins-Regular',
                    fontSize: 17,
                  }}
                >
                  {t('terms_and_conditions2')}
                </Text>
              </Pressable>
            </View>
          </View>
          <View
            style={{
              top: 150,
              alignSelf: 'center',
            }}
          >
            <PrimaryButton
              text={t('login')}
              onPress={handleLogin}
              isDisabled={isDisabled}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  backbutton: { flexDirection: 'row', alignItems: 'center' },
  container: {
    flex: 1,
    height: '100%',
    paddingTop: 50,
    padding: 20,
    backgroundColor: 'white',
  },
  scrollView: {
    height: '100%',
    borderWidth: 1,
    flex: 1,
  },
  textfieldbox: {
    marginTop: 40,
  },
  rembox: {
    alignContent: 'center',
    flexDirection: 'row',
  },
  checkbox: {
    margin: 2,
    color: 'red',
    backgroundColor: 'red',
  },
  controlContainer: {
    borderRadius: 4,
    margin: 2,
    // borderWidth: 1,
    height: 25,
  },
  text: {
    marginVertical: 10,
    color: '#000',
  },
});
export default LoginScreen;
