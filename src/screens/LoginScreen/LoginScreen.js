import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Pressable,
  ScrollView,
} from 'react-native';
import { useState, React, useEffect } from 'react';
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
import Logo from '../../assets/images/png/logo.png';
import globalStyles from '../../utils/Helper/Style';

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
    <SafeAreaView style={globalStyles.container}>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView style={styles.scrollView}>
          <Image style={globalStyles.logo} source={Logo} resizeMode="contain" />

          <TouchableOpacity
            style={[globalStyles.flexrow, globalStyles.heading]}
            onPress={() => {
              navigation.navigate('LanguageScreen');
            }}
          >
            <Image
              source={backIcon}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
            />
            <Text style={[globalStyles.heading2, { color: '#4D4639' }]}>
              {t('back')}
            </Text>
          </TouchableOpacity>
          <View style={{ paddingVertical: 5 }}>
            <Text
              style={[globalStyles.heading, { marginTop: 15, color: 'black' }]}
            >
              {t('login')}
            </Text>
            <Text style={[globalStyles.subHeading, { marginVertical: 5 }]}>
              {t('login_with_the_cred')}
            </Text>
          </View>
          <View style={styles.textfieldbox}>
            <LoginTextField
              text="username"
              onChangeText={onChangeText}
              value={userName}
            />
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
          <View style={globalStyles.flexrow}>
            <CustomCheckbox value={savePassword} onChange={setSavePassword} />
            <View>
              <Text style={globalStyles.subHeading}>{t('remember_me')}</Text>
            </View>
          </View>
          <View style={[globalStyles.flexrow, { paddingTop: 10 }]}>
            <View>
              <CustomCheckbox value={acceptTerms} onChange={setAcceptTerms} />
            </View>
            <View>
              <Text style={globalStyles.subHeading}>{t('Read_T_&_C')}</Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('TermsAndCondition');
                }}
              >
                <Text style={[globalStyles.subHeading, { color: '#0D599E' }]}>
                  {t('terms_and_conditions2')}
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={{ marginTop: 50 }}>
            <PrimaryButton
              text={t('login')}
              onPress={handleLogin}
              isDisabled={isDisabled}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  textfieldbox: {
    marginTop: 20,
  },
});
export default LoginScreen;
