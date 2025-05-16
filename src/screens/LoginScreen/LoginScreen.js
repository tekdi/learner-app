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
  telemetryTrackingData,
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
import moment from 'moment';

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

      if (data?.access_token) {
        await saveRefreshToken(data?.refresh_token || '');
        await saveAccessToken(data?.access_token || '');
        const userDetails = await getuserDetails();

        console.log('#### userDetails', userDetails);
        const user_id = userDetails?.userId;
        const tenantData = userDetails?.tenantData;
        const tenantid = userDetails?.tenantData?.[0]?.tenantId;
        await setDataInStorage('tenantData', JSON.stringify(tenantData || {}));
        await setDataInStorage('userId', user_id || '');

        //store dynamci templateId
        const templateId = userDetails?.tenantData?.[0]?.templateId;
        await setDataInStorage('templateId', templateId || '');

        const academicyear = await setAcademicYear({ tenantid });
        const academicYearId = academicyear?.[0]?.id;
        await setDataInStorage('academicYearId', academicYearId || '');
        await setDataInStorage('userTenantid', tenantid || '');
        const cohort = await getCohort({ user_id, tenantid, academicYearId });
        let cohort_id;
        if (cohort.params?.status !== 'failed') {
          const getActiveCohort = await getActiveCohortData(cohort);
          const getActiveCohortId = await getActiveCohortIds(cohort);
          await setDataInStorage(
            'cohortData',
            JSON.stringify(getActiveCohort?.[0]) || ''
          );
          cohort_id = getActiveCohortId?.[0];
        }

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

        const MatchedTenant = tenantDetails.filter(
          (item) => item?.tenantId === tenantid
        );

        // console.log('tenantDetails===>', JSON.stringify(tenantDetails));
        // console.log(
        //   'MatchedTenant===>',
        //   JSON.stringify(MatchedTenant?.[0]?.contentFilter)
        // );

        await setDataInStorage(
          'contentFilter',
          JSON.stringify(MatchedTenant?.[0]?.contentFilter || {})
        );

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
            if (tenantid === youthnetTenantIds?.[0]) {
              await setDataInStorage('userType', 'youthnet');
              // navigation.navigate('YouthNetTabScreen');
              navigation.navigate('Dashboard');
            } else {
              await setDataInStorage('userType', 'pragyanpath');
              navigation.navigate('Dashboard');
            }
          }
          const deviceId = await getDeviceId();
          const action = 'add';

          await notificationSubscribe({ deviceId, user_id, action });
        } else {
          setErrmsg('invalid_username_or_password');
        }
        const now = moment();

        const telemetryPayloadData = {
          event: 'login',
          type: 'click',
          ets: now.unix(),
        };
        await telemetryTrackingData({
          telemetryPayloadData,
        });
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
            <GlobalText style={[globalStyles.h3, { marginTop: 15 }]}>
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
                style={[
                  globalStyles.h6,
                  {
                    color: 'red',
                    top: -10,
                    left: 20,
                    width: '90%',
                    zIndex: -1,
                  },
                ]}
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
              style={[
                globalStyles.h6,
                {
                  color: '#0D599E',
                },
              ]}
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
