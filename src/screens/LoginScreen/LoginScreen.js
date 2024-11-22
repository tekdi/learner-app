import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Pressable,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useState, React, useEffect } from 'react';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import {
  getCohort,
  getProfileDetails,
  login,
  setAcademicYear,
} from '../../utils/API/AuthService';
import {
  getAcademicYearId,
  getDataFromStorage,
  getuserDetails,
  getUserId,
  saveAccessToken,
  saveRefreshToken,
  setDataInStorage,
  storeUsername,
} from '../../utils/JsHelper/Helper';
import LoginTextField from '../../components/LoginTextField/LoginTextField';
import UserNameField from '../../components/LoginTextField/UserNameField';
import CustomCheckbox from '../../components/CustomCheckbox/CustomCheckbox';
import { useTranslation } from '../../context/LanguageContext';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
import Logo from '../../assets/images/png/logo.png';
import globalStyles from '../../utils/Helper/Style';
import { useInternet } from '../../context/NetworkContext';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isConnected } = useInternet();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [errmsg, setErrmsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [networkstatus, setNetworkstatus] = useState(true);
  const [usernames, setUsernames] = useState([]);

  const onChangeText = (e) => {
    setUserName(e.trim());
  };
  const onChangePassword = (e) => {
    setPassword(e.trim());
  };

  const handleLogin = async () => {
    if (isConnected) {
      setNetworkstatus(true);
      // setLoading(true);
      const payload = {
        username: userName,
        password: password,
      };
      const data = await login(payload);

      if (data?.params?.status !== 'failed' && !data?.error) {
        await saveRefreshToken(data?.refresh_token || '');
        await saveAccessToken(data?.access_token || '');
        const userDetails = await getuserDetails();
        console.log(
          '################### userDetails',
          JSON.stringify({ userDetails })
        );

        const user_id = userDetails?.userId;
        const tenantData = userDetails?.tenantData;
        const tenantid = userDetails?.tenantData?.[0]?.tenantId;
        await setDataInStorage('tenantData', JSON.stringify(tenantData || {}));
        await setDataInStorage('userId', user_id);

        const academicyear = await setAcademicYear({ tenantid });
        console.log({ tenantData, user_id, tenantid });
        const academicYearId = academicyear?.[0]?.id;
        await setDataInStorage('academicYearId', academicYearId || '');
        const cohort = await getCohort({ user_id, tenantid, academicYearId });
        console.log('################### cohort', JSON.stringify({ cohort }));
        await setDataInStorage('cohortData', JSON.stringify(cohort));
        const cohort_id = cohort?.cohortData?.[0]?.cohortId;
        console.log({ cohort_id });

        const profileData = await getProfileDetails({
          userId: user_id,
        });
        await setDataInStorage('profileData', JSON.stringify(profileData));
        await setDataInStorage(
          'Username',
          profileData?.getUserDetails?.[0]?.username
        );
        await storeUsername(profileData?.getUserDetails?.[0]?.username);

        await setDataInStorage(
          'cohortId',
          cohort_id || '00000000-0000-0000-0000-000000000000'
        );
        if (cohort_id) {
          navigation.navigate('SCPUserTabScreen');
        } else {
          navigation.navigate('Dashboard');
        }
      } else {
        setLoading(false);
        setErrmsg(data?.params?.errmsg.toLowerCase().replace(/ /g, '_'));
      }
    } else {
      setNetworkstatus(false);
    }
  };

  useEffect(() => {
    if (userName.length > 0 && password.length > 0 && acceptTerms) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [userName, password, acceptTerms]);

  useEffect(() => {
    const fetchData = async () => {
      const data = JSON.parse(await getDataFromStorage('usernames')) || [];
      const filteredSuggestions = data.filter((item) => item != null);

      setUsernames(filteredSuggestions);
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={globalStyles.container}>
      {loading ? (
        <ActiveLoading />
      ) : (
        <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
          <StatusBar
            barStyle="dark-content"
            translucent={true}
            backgroundColor="transparent"
          />
          <Image style={globalStyles.logo} source={Logo} resizeMode="contain" />

          {/* <TouchableOpacity
            style={[globalStyles.flexrow, globalStyles.heading]}
            onPress={() => {
              navigation.navigate('LoginSignUpScreen');
            }}
          >
            <Image
              source={backIcon}
              resizeMode="contain"
              style={{ width: 30, height: 30 }}
            />
            <Text
              allowFontScaling={false}
              style={[globalStyles.heading2, { color: '#4D4639' }]}
            >
              {t('back')}
            </Text>
          </TouchableOpacity> */}
          <View style={{ paddingVertical: 5 }}>
            <Text
              allowFontScaling={false}
              style={[globalStyles.heading, { marginTop: 15, color: 'black' }]}
            >
              {t('login')}
            </Text>
            {/* <Text
              allowFontScaling={false}
              style={[globalStyles.subHeading, { marginVertical: 5 }]}
            >
              {t('login_with_the_cred')}
            </Text> */}
          </View>
          <View style={styles.textfieldbox}>
            <UserNameField
              text="username"
              onChangeText={onChangeText}
              value={userName}
              suggestions={usernames}
            />
            <View style={{ marginTop: 25 }}>
              <LoginTextField
                text="password"
                onChangeText={onChangePassword}
                value={password}
              />
            </View>

            {errmsg !== '' && (
              <Text
                allowFontScaling={false}
                style={{ color: 'red', top: -10, left: 20 }}
              >
                {t(errmsg || 'invalid_username_or_password')}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ForgotPassword');
            }}
            style={{ paddingLeft: 20, marginBottom: 30 }}
          >
            <Text
              allowFontScaling={false}
              style={{
                color: '#0D599E',
                fontFamily: 'Poppins-Medium',
                fontSize: 15,
              }}
            >
              {t('forgot_password')}
            </Text>
          </TouchableOpacity>
          {/* <View style={globalStyles.flexrow}>
            <CustomCheckbox value={savePassword} onChange={setSavePassword} />
            <View>
              <Text allowFontScaling={false} style={globalStyles.subHeading}>{t('remember_me')}</Text>
            </View>
          </View> */}
          {/* <View style={[globalStyles.flexrow, { paddingTop: 10 }]}>
            <View>
              <CustomCheckbox value={acceptTerms} onChange={setAcceptTerms} />
            </View>
            <View>
              <Text allowFontScaling={false} style={globalStyles.subHeading}>
                {t('Read_T_&_C')}
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('TermsAndCondition');
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={[globalStyles.subHeading, { color: '#0D599E' }]}
                >
                  {t('terms_and_conditions2')}
                </Text>
              </Pressable>
            </View>
          </View> */}
          <View style={{ marginTop: 0 }}>
            <PrimaryButton
              text={t('login')}
              onPress={handleLogin}
              isDisabled={!isDisabled}
            />
          </View>
          <Pressable
            onPress={() => {
              navigation.navigate('RegisterStart');
            }}
            style={{ alignItems: 'center', padding: 20 }}
          >
            <Text
              allowFontScaling={false}
              style={[globalStyles.text, { color: '#0D599E' }]}
            >
              {t('dont_have_account')}
            </Text>
          </Pressable>
        </ScrollView>
      )}

      <NetworkAlert
        onTryAgain={handleLogin}
        isConnected={networkstatus}
        closeModal={() => {
          setNetworkstatus(!networkstatus);
        }}
      />
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
