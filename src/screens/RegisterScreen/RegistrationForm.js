import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  BackHandler,
} from 'react-native';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import CustomRadioCard from '@components/CustomRadioCard/CustomRadioCard';
import CustomCards from '@components/CustomCard/CustomCard';
import {
  getAccessToken,
  getCohort,
  getGeoLocation,
  getProfileDetails,
  getProgramDetails,
  login,
  registerUser,
  setAcademicYear,
} from '@src/utils/API/AuthService';
import HeaderComponent from '@components/CustomHeaderComponent/customheadercomponent';
import DropdownSelect from '@components/DropdownSelect/DropdownSelect';
import {
  getActiveCohortData,
  getActiveCohortIds,
  getDataFromStorage,
  getuserDetails,
  getUserId,
  logEventFunction,
  saveAccessToken,
  saveRefreshToken,
  setDataInStorage,
  storeUsername,
} from '@src/utils/JsHelper/Helper';
import PrimaryButton from '@components/PrimaryButton/PrimaryButton';
import { useTranslation } from '@context/LanguageContext';
import CustomPasswordTextField from '@components/CustomPasswordComponent/CustomPasswordComponent';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import Exclamation from '../../assets/images/png/Exclamation.png';
import GlobalText from '@components/GlobalText/GlobalText';
import globalStyles from '@src/utils/Helper/Style';
import FullPagePdfModal from './FullPagePdfModal';
import CustomCheckbox from '@components/CustomCheckbox/CustomCheckbox';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { OtpInput } from 'react-native-otp-entry';
import EnableLocationModal from '../Location/EnableLocationModal';
import NetworkAlert from '@components/NetworkError/NetworkAlert';
import FastImage from '@changwoolab/react-native-fast-image';
import lightning from '../../assets/images/png/lightning.png';
import { useInternet } from '@context/NetworkContext';
import PropTypes from 'prop-types';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
import { transformPayload } from './TransformPayload';

const RegistrationForm = ({ fields }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [formData, setFormData] = useState({});
  const [schema, setSchema] = useState(fields);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [isUserModalVisible, setUserModalVisible] = useState(false);
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const [programData, setProgramData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [blockData, setBlockData] = useState([]);
  const [checked, setChecked] = useState(false);
  const [secondChecked, setSecondChecked] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentGeoData, setCurrentGeoData] = useState(false);
  const [enable, setEnable] = useState(false);
  const [updateEnable, setUpdateEnable] = useState(false);
  const [count, setCount] = useState();
  const [intervalId, setIntervalId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const [networkError, setNetworkError] = useState(false);
  const [modal, setModal] = useState(false);
  const { isConnected } = useInternet();

  const RegisterLogin = async (loginData) => {
    const payload = {
      username: loginData?.username,
      password: loginData?.password,
    };

    const data = await login(payload);
    await saveRefreshToken(data?.refresh_token || '');
    await saveAccessToken(data?.access_token || '');
    const user_id = await getUserId();
    const userDetails = await getuserDetails();

    const tenantData = userDetails?.tenantData;
    const tenantid = userDetails?.tenantData?.[0]?.tenantId;
    await setDataInStorage('tenantData', JSON.stringify(tenantData || {}));

    await setDataInStorage('userId', user_id);
    const academicyear = await setAcademicYear({ tenantid });
    const academicYearId = academicyear?.[0]?.id;
    const cohort = await getCohort({ user_id, tenantid, academicYearId });
    const getActiveCohort = await getActiveCohortData(cohort?.cohortData);
    const getActiveCohortId = await getActiveCohortIds(cohort?.cohortData);
    await setDataInStorage(
      'academicYearId',
      JSON.stringify(academicYearId || '')
    );
    await setDataInStorage(
      'cohortData',
      JSON.stringify(getActiveCohort?.[0] || '')
    );
    const cohort_id = getActiveCohortId?.[0];
    await setDataInStorage(
      'cohortId',
      cohort_id || '00000000-0000-0000-0000-000000000000'
    );
    const profileData = await getProfileDetails({
      userId: user_id,
    });
    await setDataInStorage('profileData', JSON.stringify(profileData));
    await setDataInStorage(
      'Username',
      profileData?.getUserDetails?.[0]?.username
    );

    await storeUsername(profileData?.getUserDetails?.[0]?.username);

    const youthnetTenantIds = programData?.filter(
      (item) => item.name === 'YouthNet'
    );
    const scp = programData?.filter(
      (item) => item.name === 'Second Chance Program'
    );

    if (tenantid === scp?.[0]?.tenantId) {
      await setDataInStorage('userType', 'scp');
      if (cohort_id) {
        navigation.navigate('SCPUserTabScreen');
      } else {
        navigation.navigate('Dashboard');
      }
    } else {
      if (tenantid === youthnetTenantIds?.[0]?.tenantId) {
        await setDataInStorage('userType', 'youthnet');
      } else {
        await setDataInStorage('userType', 'public');
      }
      navigation.navigate('Dashboard');
    }
    setModal(false);
    const obj = {
      eventName: 'logged_in',
      method: 'button-click',
      screenName: 'Registration',
    };
    await logEventFunction(obj);
    // const deviceId = await getDeviceId();
    // await notificationSubscribe({ deviceId, user_id });
  };

  const logRegistrationComplete = async () => {
    // Log the registration completed event
    const obj = {
      eventName: 'registration_completed',
      method: 'button-click',
      screenName: 'Registration',
    };
    await logEventFunction(obj);

    // Handle your registration logic here
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = await transformPayload(data);
    await getAccessToken();
    const register = await registerUser(payload);

    if (!isConnected) {
      setNetworkError(true);
      setLoading(false);
    } else if (register?.params?.status === 'failed') {
      setLoading(false);
      setModal(true);
      setErr(register?.params?.err);
    } else {
      logRegistrationComplete();
      await RegisterLogin(data);
      setLoading(false);
    }
  };

  const openInAppBrowser = async () => {
    try {
      const url = 'https://pratham.org/privacy-guidelines/';
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // Optional customization
          toolbarColor: '#6200EE',
          showTitle: true,
          enableUrlBarHiding: true,
          enableDefaultShare: true,
        });
      } else {
        console.log('In-App Browser not available');
      }
    } catch (error) {
      console.error('Error opening browser:', error);
    }
  };

  const fetchDistricts = async (state) => {
    const payload = {
      // limit: 10,
      offset: 0,
      fieldName: 'districts',
      controllingfieldfk: state || formData['states']?.value,
    };

    const data = await getGeoLocation({ payload });
    setDistrictData(data?.values);
    return data?.values;
  };
  const fetchBlocks = async (district) => {
    const payload = {
      // limit: 10,
      offset: 0,
      fieldName: 'blocks',
      controllingfieldfk: district || formData['districts']?.value,
    };

    const data = await getGeoLocation({ payload });
    setBlockData(data?.values);
    return data?.values;
  };

  const fetchStates = async () => {
    const stateAPIdata = JSON.parse(await getDataFromStorage('states'));
    const geoData = JSON.parse(await getDataFromStorage('geoData'));
    setCurrentGeoData(geoData);
    setStateData(stateAPIdata);
    const foundState = stateAPIdata.find(
      (item) => item?.label === geoData?.state
    );
    const districtAll = await fetchDistricts(foundState?.value);

    const foundDistrict = districtAll.find(
      (item) => item?.label === geoData?.district
    );

    const updatedFormData = {
      ...formData,
      ['states']: { value: foundState?.value, label: foundState?.label },
      ['districts']: {
        value: foundDistrict?.value,
        label: foundDistrict?.label,
      },
    };
    setFormData(updatedFormData);
    if (formData['states']?.label !== undefined) {
      setEnable(false);
      setUpdateEnable(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
    fetchBlocks();
  }, [formData['states'], formData['districts']]);

  useEffect(() => {
    const getProgramData = async () => {
      const data = await getProgramDetails();
      setProgramData(data);
    };
    getProgramData();
    fetchStates();
  }, []);

  useEffect(() => {
    fetchStates();
  }, [updateEnable]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (currentPage > 0) {
          handlePrevious();
          return true; // Prevent default behavior (exit app)
        } else {
          // Optional: Show a confirmation dialog
          navigation.goBack();
          return true; // Prevent default behavior (exit app)
        }
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => {
        backHandler.remove(); // Clean up event listener on unmount
      };
    }, [currentPage]) // Dependencies to trigger the effect
  );

  const pages = [
    ['first_name', 'last_name', 'email', 'mobile'],
    ['age', 'gender'],
    ['program'],
    ['states', 'districts', 'blocks'],
    [
      'username',
      'password',
      'confirm_password',
      'parent_name',
      'parent_phone',
      'parent_phone_belong',
    ],
  ];

  const handleInputChange = (name, value) => {
    const updatedFormData = { ...formData, [name]: value };

    // Reset dependent fields
    if (name === 'states') {
      updatedFormData['districts'] = '';
      updatedFormData['blocks'] = '';
    } else if (name === 'districts') {
      updatedFormData['blocks'] = '';
    }

    setFormData(updatedFormData);
    setErrors({ ...errors, [name]: '' }); // Clear errors for the field
  };

  const validateFields = () => {
    const pageFields = pages[currentPage];
    const newErrors = {};

    pageFields.forEach((fieldName) => {
      const field = schema?.find((f) => f.name === fieldName);

      if (field) {
        const value = formData[field.name] || '';

        if (['confirm_password'].includes(field.name)) {
          if (formData.password !== formData.confirm_password) {
            newErrors[field.name] = `${t('Password_must_match')}`;
          }
        }

        if (
          ['parent_phone_belong', 'parent_phone', 'parent_name'].includes(
            field.name
          ) &&
          formData.age &&
          parseInt(formData.age, 10) >= 18
        ) {
          return; // Skip validation for these fields
        }

        if (field.isRequired && !value) {
          newErrors[field.name] = `${t(field.name)} ${t('is_required')}`;
        } else if (field.minLength && value.length < field.minLength && value) {
          newErrors[field.name] =
            `${t('min_validation').replace('{field}', t(field.name)).replace('{length}', field.minLength)}`;
        } else if (field.maxLength && value.length > field.maxLength && value) {
          newErrors[field.name] =
            `${t('max_validation').replace('{field}', t(field.name)).replace('{length}', field.maxLength)}`;
        } else if (
          field.pattern &&
          value &&
          !new RegExp(field.pattern).test(value)
        ) {
          newErrors[field.name] = `${t(field.name)} ${t('is_invalid')}.`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderField = (field) => {
    if (
      (field.name === 'parent_phone_belong' ||
        field.name === 'parent_phone' ||
        field.name === 'parent_name') &&
      formData.age &&
      parseInt(formData.age, 10) >= 18
    ) {
      return null;
    }

    switch (field.type) {
      case 'text':
        return (
          <View key={field.name} style={styles.inputContainer}>
            <CustomTextField
              field={field}
              formData={formData}
              handleValue={handleInputChange}
              errors={errors}
            />
          </View>
        );
      case 'email':
        return (
          <View key={field.name} style={styles.inputContainer}>
            <CustomTextField
              field={field}
              formData={formData}
              handleValue={handleInputChange}
              errors={errors}
              autoCapitalize={false}
            />
          </View>
        );
      case 'numeric':
        return (
          <View key={field.name} style={styles.inputContainer}>
            <CustomTextField
              field={field}
              formData={formData}
              handleValue={handleInputChange}
              errors={errors}
              keyboardType="numeric"
            />
          </View>
        );
      case 'radio':
        return (
          <View key={field.name} style={styles.inputContainer}>
            <CustomRadioCard
              field={field}
              options={programData}
              errors={errors}
              formData={formData}
              handleValue={handleInputChange}
            />
          </View>
        );
      case 'select':
        return (
          <View key={field.name} style={styles.inputContainer}>
            <CustomCards
              field={field}
              errors={errors}
              formData={formData}
              handleValue={handleInputChange}
            />
          </View>
        );
      case 'drop_down':
        return (
          <View key={field.name} style={styles.inputContainer}>
            <DropdownSelect
              field={field}
              options={
                field.name === 'states'
                  ? stateData
                  : field.name === 'districts'
                    ? districtData
                    : field.name === 'blocks'
                      ? blockData
                      : field?.options
              }
              errors={errors}
              formData={formData}
              handleValue={handleInputChange}
            />
          </View>
        );
      case 'password':
        return (
          <View key={field.name} style={styles.inputContainer}>
            <CustomPasswordTextField
              field={field}
              errors={errors}
              formData={formData}
              handleValue={handleInputChange}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const renderPage = () => {
    const pageFields = pages[currentPage];
    return schema
      .filter((field) => pageFields.includes(field.name))
      .map((field) => renderField(field));
  };

  const handleNext = async () => {
    if (validateFields()) {
      if (currentPage === 0) {
        const userExists = true;
        if (userExists) {
          setUserModalVisible(true);
        } else {
          setOtpModalVisible(true);
        }
      } else {
        setCurrentPage(currentPage + 1);
      }
    }
    if (currentPage === 2 && !currentGeoData) {
      setEnable(true);
    }
    if (currentPage === 2) {
      const fullName = `${formData.first_name}${formData.last_name}`;
      const updatedFormData = {
        ...formData,
        ['username']: fullName.toLowerCase(),
      };
      setFormData(updatedFormData);
    }
  };
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit(formData);
    }
  };

  const handleOtpVerification = async () => {
    const isValidOtp = true;
    if (isValidOtp) {
      setOtpModalVisible(false);
      setUserModalVisible(false);
      setCurrentPage(currentPage + 1);
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  useEffect(() => {
    if (isOtpModalVisible) {
      startOtpTimer();
    } else {
      stopOtpTimer();
    }

    return () => stopOtpTimer(); // Clean up interval when component unmounts
  }, [isOtpModalVisible]);

  const startOtpTimer = () => {
    setCount(60); // Reset counter
    const id = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(id);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const stopOtpTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const handleResendOTP = () => {
    stopOtpTimer(); // Clear any existing timer
    startOtpTimer(); // Start a new timer
  };

  if (loading) {
    return <ActiveLoading />;
  }

  return (
    <View style={{ padding: 20, flex: 1 }}>
      {currentPage > 0 && (
        <TouchableOpacity style={styles.backbutton} onPress={handlePrevious}>
          <Image
            source={backIcon}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      )}
      <HeaderComponent
        currentPage={currentPage + 1}
        questionIndex={currentPage + 1}
        totalForms={pages?.length}
      />
      {currentPage === 3 && (
        <>
          <GlobalText style={[globalStyles.text, { marginLeft: 20 }]}>
            {t('location_des')}
          </GlobalText>
          <View
            style={{
              padding: 15,
              borderRadius: 20,
              backgroundColor: '#EDE1CF',
              marginTop: 10,
            }}
          >
            <GlobalText style={[globalStyles.text]}>
              {t('location_des2')}
            </GlobalText>
          </View>
        </>
      )}
      <ScrollView style={{ flex: 1 }}>
        {renderPage()}

        {currentPage === 0 && (
          <GlobalText style={[globalStyles.text, { top: -20, left: 10 }]}>
            {t('an_otp_will_be_sent_for_verification')}
          </GlobalText>
        )}
        {currentPage === 4 && (
          <>
            <View
              style={[
                globalStyles.flexrow,
                { marginVertical: 15, width: '85%' },
              ]}
            >
              <CustomCheckbox
                value={checked}
                onChange={(nextChecked) => {
                  setChecked(nextChecked);
                }}
              />

              <GlobalText
                numberOfLines={5}
                ellipsizeMode="tail"
                style={[globalStyles.text, { textAlign: 'justify' }]}
              >
                {t('Read_T_&_C')}{' '}
                <GlobalText
                  onPress={openInAppBrowser}
                  style={[
                    globalStyles.text,
                    {
                      color: '#0000cd',
                      textDecorationLine: 'underline', // This adds the underline
                    },
                  ]}
                >
                  {t('privacy_guidelines')}{' '}
                </GlobalText>
                {t(
                  'and_i_consent_to_the_collection_and_use_of_my_personal_data_as_described_in_the'
                )}{' '}
                <GlobalText
                  onPress={() => {
                    setModalVisible(true);
                  }}
                  style={[
                    globalStyles.text,
                    {
                      color: '#0000cd',
                      textDecorationLine: 'underline', // This adds the underline
                    },
                  ]}
                >
                  {t('consent_form')}
                </GlobalText>
              </GlobalText>
            </View>
            {formData['age'] < 18 && (
              <View
                style={[
                  globalStyles.flexrow,
                  { marginVertical: 15, width: '85%' },
                ]}
              >
                <CustomCheckbox
                  value={secondChecked}
                  onChange={(nextChecked) => {
                    setSecondChecked(nextChecked);
                  }}
                />

                <GlobalText style={globalStyles.text}>
                  {t('create_account_desp2')}
                </GlobalText>
              </View>
            )}
            <FullPagePdfModal
              // pdfPath={pdfPath}
              isModalVisible={isModalVisible}
              setModalVisible={setModalVisible}
              age={formData['age']}
            />
          </>
        )}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        {currentPage < pages.length - 1 ? (
          <PrimaryButton text={t('continue')} onPress={handleNext} />
        ) : (
          <PrimaryButton
            isDisabled={
              formData.age < 18 ? !(checked && secondChecked) : !checked
            } // Button disabled until both are checked
            text={t('create_account')}
            onPress={handleSubmit}
          />
        )}
      </View>
      {enable && (
        <EnableLocationModal
          enable={enable}
          setEnable={setEnable}
          setUpdateEnable={setUpdateEnable}
        />
      )}

      <Modal
        visible={isUserModalVisible}
        transparent={true}
        animationType="slide"
        onclo
      >
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
          <View style={styles.alertBox}>
            <View
              style={{
                padding: 15,
              }}
            >
              <GlobalText style={globalStyles.text}>
                {t('account_already_exists')}
              </GlobalText>
            </View>
            <View
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderTopWidth: 1,
                borderColor: '#D0C5B4',
              }}
            >
              <View style={{ padding: 10, alignItems: 'center' }}>
                <Image
                  source={Exclamation}
                  resizeMode="contain"
                  style={{ width: 50, height: 50 }}
                />
              </View>
              <View>
                <GlobalText
                  style={[
                    globalStyles.subHeading,
                    { textAlign: 'center', paddingHorizontal: 10 },
                  ]}
                >
                  {t(
                    'one_or_more_accounts_with_this_name_email_and_phone_number_already_exist'
                  )}
                </GlobalText>
              </View>
              <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <TouchableOpacity>
                  <GlobalText
                    style={[globalStyles.subHeading, { fontWeight: '800' }]}
                  >
                    random name
                  </GlobalText>
                </TouchableOpacity>
              </View>
              <View>
                <GlobalText
                  style={[globalStyles.text, { textAlign: 'center' }]}
                >
                  {t('are_you_sure_you_want_to_create_another_account')}
                </GlobalText>
              </View>
            </View>
            <View style={styles.btnbox}>
              <TouchableOpacity
                onPress={() => {
                  setUserModalVisible(false);
                  setOtpModalVisible(true);
                }}
              >
                <GlobalText
                  style={[
                    globalStyles.subHeading,
                    { color: '#0D599E', fontWeight: '700', marginBottom: 20 },
                  ]}
                >
                  {t('yes_create_another_account')}
                </GlobalText>
              </TouchableOpacity>
              <PrimaryButton
                text={t('No_log_in_to_existing_account')}
                onPress={() => {
                  navigation.navigate('LoginScreen');
                  setUserModalVisible(false);
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        visible={isOtpModalVisible}
        transparent={true}
        animationType="slide"
        onclo
      >
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
          <View style={styles.alertBox}>
            <View
              style={{
                padding: 15,
              }}
            >
              <GlobalText style={globalStyles.text}>
                {t('verify_phone_number')}
              </GlobalText>
            </View>
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderBottomWidth: 1,
                borderTopWidth: 1,
                borderColor: '#D0C5B4',
              }}
            >
              <View>
                <GlobalText style={[globalStyles.subHeading]}>
                  {t('we_sent_an_otp_to_verify_your_number')} :{' '}
                  {formData?.mobile}
                </GlobalText>
              </View>

              <GlobalText style={[globalStyles.text, { marginVertical: 5 }]}>
                {t('enter_otp')}
              </GlobalText>

              <View style={styles.otpInputContainer}>
                <OtpInput
                  numberOfDigits={6}
                  focusColor="green"
                  autoFocus={false}
                  hideStick={true}
                  placeholder="******"
                  blurOnFilled={true}
                  disabled={false}
                  type="numeric"
                  secureTextEntry={false}
                  focusStickBlinkingDuration={500}
                  onTextChange={(text) => console.log(text)}
                  textInputProps={{
                    accessibilityLabel: 'One-Time Password',
                  }}
                  theme={{
                    containerStyle: styles.pinContainer,
                    pinCodeContainerStyle: styles.pinCodeContainer,
                    pinCodeTextStyle: styles.pinCodeText,
                    focusStickStyle: styles.focusStick,
                    focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                    placeholderTextStyle: styles.placeholderText,
                    filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                    disabledPinCodeContainerStyle:
                      styles.disabledPinCodeContainer,
                  }}
                />
              </View>
              <TouchableOpacity
                disabled={count > 0} // Disable the button if countdown is active
                onPress={handleResendOTP}
              >
                <GlobalText
                  style={[
                    globalStyles.text,
                    {
                      marginTop: 20,
                      marginBottom: 10,
                      textAlign: 'center',
                      color: count > 0 ? '#DADADA' : '#0D599E80',
                    },
                  ]}
                >
                  {t('resend_otp_in').replace(`{count}`, count)}
                </GlobalText>
              </TouchableOpacity>
            </View>
            <View style={styles.btnbox}>
              <PrimaryButton
                text={t('verify_otp')}
                onPress={handleOtpVerification}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <NetworkAlert onTryAgain={handleSubmit} isConnected={!networkError} />
      {modal && (
        <Modal transparent={true} animationType="slide">
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
            {err ? (
              <View style={styles.alertBox}>
                <Image source={lightning} resizeMode="contain" />

                <GlobalText
                  style={[globalStyles.subHeading, { marginVertical: 10 }]}
                >
                  Error: {err}
                </GlobalText>
                <PrimaryButton
                  text={t('continue')}
                  onPress={() => {
                    setModal(false);
                  }}
                />
              </View>
            ) : (
              <View style={styles.alertBox}>
                <FastImage
                  style={styles.image}
                  // eslint-disable-next-line no-undef
                  source={require('../../assets/images/gif/party.gif')}
                  resizeMode={FastImage.resizeMode.contain}
                  priority={FastImage.priority.high} // Set the priority here
                />
                <GlobalText
                  style={[
                    globalStyles.heading2,
                    { marginVertical: 10, textAlign: 'center' },
                  ]}
                >
                  {t('congratulations')}
                </GlobalText>
              </View>
            )}
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    marginTop: 0,
    backgroundColor: 'white',
  },
  inputContainer: {
    marginTop: 5,
    Bottom: 16,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 10,
  },

  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%', // Adjust the width as per your design
    alignSelf: 'center',
  },
  pinCodeText: {
    color: '#000',
  },
  pinCodeContainer: {
    // marginHorizontal: 5,
  },
  pinContainer: {
    width: '100%',
  },
  btnbox: {
    marginVertical: 10,
    alignItems: 'center',
  },
});

RegistrationForm.propTypes = {
  fields: PropTypes.any,
};

export default RegistrationForm;
