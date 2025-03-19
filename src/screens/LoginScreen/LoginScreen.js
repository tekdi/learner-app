import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Pressable,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useState, React, useEffect } from 'react';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import {
  getCohort,
  getProfileDetails,
  getProgramDetails,
  login,
  notificationSubscribe,
  setAcademicYear,
} from '../../utils/API/AuthService';
import {
  getActiveCohortData,
  getActiveCohortIds,
  getDataFromStorage,
  getDeviceId,
  getuserDetails,
  saveAccessToken,
  saveRefreshToken,
  setDataInStorage,
  storeUsername,
} from '../../utils/JsHelper/Helper';
import LoginTextField from '../../components/LoginTextField/LoginTextField';
import UserNameField from '../../components/LoginTextField/UserNameField';
import { useTranslation } from '../../context/LanguageContext';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
import Logo from '../../assets/images/png/logo.png';
import globalStyles from '../../utils/Helper/Style';
import { useInternet } from '../../context/NetworkContext';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import GlobalText from '@components/GlobalText/GlobalText';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isConnected } = useInternet();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms] = useState(false);
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
      setLoading(true);
      const payload = {
        username: userName,
        password: password,
      };
      const data = await login(payload);

      if (data?.params?.status !== 'failed' && !data?.error) {
        await saveRefreshToken(data?.refresh_token || '');
        await saveAccessToken(data?.access_token || '');
        const userDetails = await getuserDetails();
        const user_id = userDetails?.userId;
        const tenantData = userDetails?.tenantData;
        console.log('tenantData', JSON.stringify(userDetails));
        const tenantid = userDetails?.tenantData?.[0]?.tenantId;
        await setDataInStorage('tenantData', JSON.stringify(tenantData || {}));
        await setDataInStorage('userId', user_id || '');

        const academicyear = await setAcademicYear({ tenantid });
        const academicYearId = academicyear?.[0]?.id;
        await setDataInStorage('academicYearId', academicYearId || '');
        await setDataInStorage('userTenantid', tenantid || '');
        const cohort = await getCohort({ user_id, tenantid, academicYearId });
        const getActiveCohort = await getActiveCohortData(cohort?.cohortData);
        const getActiveCohortId = await getActiveCohortIds(cohort?.cohortData);
        await setDataInStorage(
          'cohortData',
          JSON.stringify(getActiveCohort?.[0]) || ''
        );
        const cohort_id = getActiveCohortId?.[0];

        const profileData = await getProfileDetails({
          userId: user_id,
        });
        await setDataInStorage('profileData', JSON.stringify(profileData));
        await setDataInStorage(
          'Username',
          profileData?.getUserDetails?.[0]?.username || ''
        );
        await storeUsername(profileData?.getUserDetails?.[0]?.username);

        await setDataInStorage(
          'cohortId',
          cohort_id || '00000000-0000-0000-0000-000000000000'
        );
        const tenantDetails = (await getProgramDetails()) || [];
        console.log('tenantDetails', JSON.stringify(tenantDetails));

        const youthnetTenantIds = tenantDetails
          ?.filter((item) => item?.name === 'YouthNet')
          ?.map((item) => item?.tenantId);

        const scp = tenantDetails
          ?.filter((item) => item.name === 'Second Chance Program')
          ?.map((item) => item.tenantId);

        const role = tenantData?.[0]?.roleName;

        if (role == 'Learner' || role == 'Student') {
          if (tenantid === scp?.[0]) {
            await setDataInStorage('userType', 'scp');
            if (cohort_id) {
              navigation.navigate('SCPUserTabScreen');
            } else {
              navigation.navigate('Dashboard');
            }
          } else {
            console.log('tentn', tenantid);
            console.log('youthnetTenantIds?.[0]?.tenantId', youthnetTenantIds);

            if (tenantid === youthnetTenantIds?.[0]) {
              await setDataInStorage('userType', 'youthnet');
              // navigation.navigate('YouthNetTabScreen');
              navigation.navigate('Dashboard');
            } else {
              await setDataInStorage('userType', 'public');
              navigation.navigate('Dashboard');
            }
          }
          const deviceId = await getDeviceId();
          const action = 'add';

          await notificationSubscribe({ deviceId, user_id, action });
        } else {
          setErrmsg('invalid_username_or_password');
        }
        setLoading(false);
      } else {
        setLoading(false);
        setErrmsg(data?.params?.errmsg.toLowerCase().replace(/ /g, '_'));
      }
    } else {
      setNetworkstatus(false);
    }
  };

  // const handleLogin = async () => {
  //   navigation.navigate('Dashboard');
  // };

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
            // translucent={true}
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
            <GlobalText
              
              style={[globalStyles.heading2, { color: '#4D4639' }]}
            >
              {t('back')}
            </GlobalText>
          </TouchableOpacity> */}
          <View style={{ paddingVertical: 5 }}>
            <GlobalText
              style={[globalStyles.heading, { marginTop: 15, color: 'black' }]}
            >
              {t('login')}
            </GlobalText>
            {/* <GlobalText
              
              style={[globalStyles.subHeading, { marginVertical: 5 }]}
            >
              {t('login_with_the_cred')}
            </GlobalText> */}
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
              <GlobalText
                style={{ color: 'red', top: -10, left: 20, width: '90%' }}
              >
                {t(errmsg || 'invalid_username_or_password')}
              </GlobalText>
            )}
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ForgotPassword', { enableLogin: true });
            }}
            style={{ paddingLeft: 20, marginBottom: 30 }}
          >
            <GlobalText
              style={{
                color: '#0D599E',
                fontFamily: 'Poppins-Medium',
                fontSize: 15,
              }}
            >
              {t('forgot_password')}?
            </GlobalText>
          </TouchableOpacity>
          {/* <View style={globalStyles.flexrow}>
            <CustomCheckbox value={savePassword} onChange={setSavePassword} />
            <View>
              <GlobalText  style={globalStyles.subHeading}>{t('remember_me')}</GlobalText>
            </View>
          </View> */}
          {/* <View style={[globalStyles.flexrow, { paddingTop: 10 }]}>
            <View>
              <CustomCheckbox value={acceptTerms} onChange={setAcceptTerms} />
            </View>
            <View>
              <GlobalText  style={globalStyles.subHeading}>
                {t('Read_T_&_C')}
              </GlobalText>
              <Pressable
                onPress={() => {
                  navigation.navigate('TermsAndCondition');
                }}
              >
                <GlobalText
                  
                  style={[globalStyles.subHeading, { color: '#0D599E' }]}
                >
                  {t('terms_and_conditions2')}
                </GlobalText>
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
            <GlobalText style={[globalStyles.text, { color: '#0D599E' }]}>
              {t('dont_have_account')}
            </GlobalText>
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
