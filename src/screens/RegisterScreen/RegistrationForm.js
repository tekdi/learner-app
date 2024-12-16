import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  Text,
  ScrollView,
  BackHandler,
  Modal,
  Button,
  Dimensions,
} from 'react-native';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import HeaderComponent from '../../components/CustomHeaderComponent/customheadercomponent';
import CustomCards from '../../components/CustomCard/CustomCard';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import lightning from '../../assets/images/png/lightning.png';
import InAppBrowser from 'react-native-inappbrowser-reborn';
// import Geolocation from 'react-native-geolocation-service';

//multi language
import { useTranslation } from '../../context/LanguageContext';

import InterestedCardsComponent from '../../components/InterestedComponents/InterestedComponents';
import CustomPasswordTextField from '../../components/CustomPasswordComponent/CustomPasswordComponent';
import {
  getActiveCohortData,
  getActiveCohortIds,
  getDataFromStorage,
  getDeviceId,
  getuserDetails,
  getUserId,
  logEventFunction,
  saveAccessToken,
  saveRefreshToken,
  saveToken,
  setDataInStorage,
  storeUsername,
  translateLanguage,
} from '../../utils/JsHelper/Helper';
import PlainText from '../../components/PlainText/PlainText';
import PlainTcText from '../../components/PlainText/PlainTcText';
import { transformPayload } from './TransformPayload';
import {
  getCohort,
  getGeoLocation,
  getProfileDetails,
  getProgramDetails,
  login,
  notificationSubscribe,
  registerUser,
  setAcademicYear,
  userExist,
} from '../../utils/API/AuthService';
import { getAccessToken } from '../../utils/API/ApiCalls';
import globalStyles from '../../utils/Helper/Style';
import CustomRadioCard from '../../components/CustomRadioCard/CustomRadioCard';
import DropdownSelect from '../../components/DropdownSelect/DropdownSelect';
import Config from 'react-native-config';
import FastImage from '@changwoolab/react-native-fast-image';
import { CheckBox } from '@ui-kitten/components';
import CustomCheckbox from '../../components/CustomCheckbox/CustomCheckbox';
import NetworkAlert from '../../components/NetworkError/NetworkAlert';
import { useInternet } from '../../context/NetworkContext';

import GlobalText from '@components/GlobalText/GlobalText';
import ParentText from '../../components/PlainText/ParentText';
import { registerSchema } from './RegisterSchemaUpdate';
import FullPagePdfModal from './FullPagePdfModal';
import ActiveLoading from '../LoadingScreen/ActiveLoading';

const buildYupSchema = (form, currentForm, t) => {
  const shape = {};
  form.fields.forEach((field) => {
    if (field.validation) {
      let validator;
      switch (field.type) {
        case 'text':
        case 'password':
        case 'email':
          validator = yup.string();
          if (field.validation.required) {
            validator = validator.required(
              `${t(field.name)} ${t('is_required')}`
            );
          }
          if (field.validation.minLength) {
            validator = validator.min(
              field.validation.minLength,
              `${t(field.name)} ${t('min')} ${t(
                field.validation.minLength
              )} ${t('characters')}`
            );
          }
          if (field.validation.maxLength) {
            validator = validator.max(
              field.validation.maxLength,
              `${t(field.label)} ${t('max')} ${t(
                field.validation.maxLength
              )} ${t('characters')}`
            );
          }
          if (field.validation.match) {
            validator = validator.oneOf(
              [yup.ref('password'), null],
              `${t('Password_must_match')}`
            );
          }
          if (field.validation.pattern && field.type === 'text') {
            validator = validator.matches(
              field.validation.pattern,
              `${t(field.name)} ${t('can_only_contain_letters')}`
            );
          }
          if (field.validation.pattern && field.type == 'email') {
            validator = validator.matches(
              field.validation.pattern,
              `${t(field.name)} ${t('is_invalid')}`
            );
          }
          if (field.name === 'username' && currentForm === 6) {
            validator = validator.test(
              'userExist',
              `${t('username_already_exists')}`,
              async (value) => {
                const payload = { username: value };
                const exists = await userExist(payload);
                return !exists?.data?.data;
              }
            );
          }
          break;
        case 'select_drop_down':
          validator = yup.object(); // Change from yup.number() to yup.string()
          if (field.validation.required) {
            validator = validator.required(
              `${t(field.name)} ${t('is_required')}`
            );
          }
          break;
        case 'select':
          validator = yup.lazy((value) =>
            typeof value === 'object'
              ? yup.object({
                  value: yup
                    .string()
                    .required(`${t(field.name)} ${t('is_required')}`),
                })
              : yup.string().required(`${t(field.name)} ${t('is_required')}`)
          );
          break;
        case 'radio':
          validator = yup.object(); // Change from yup.number() to yup.string()
          if (field.validation.required) {
            validator = validator.required(
              `${t(field.name)} ${t('is_required')}`
            );
          }
          break;
        case 'number':
          validator = yup.string(); // Change from yup.number() to yup.string()
          if (field.validation.required) {
            validator = validator.required(
              `${t(field.name)} ${t('is_required')}`
            );
          }
          if (field.validation.minLength) {
            validator = validator.min(
              field.validation.minLength,
              `${t(field.name)} ${t('min')} ${t(
                field.validation.minLength
              )} ${t('numbers')}`
            );
          }
          if (field.validation.maxLength) {
            validator = validator.max(
              field.validation.maxLength,
              `${t(field.label)} ${t('max')} ${t(
                field.validation.maxLength
              )} ${t('numbers')}`
            );
          }
          if (field.validation.pattern) {
            validator = validator.matches(
              field.validation.pattern,
              `${t(field.name)} ${t('is_invalid')}` // Update the error message to reflect numbers only
            );
          }
          break;
        // Add other field types as needed...
        case 'multipleCard':
        case 'checkbox':
          validator = yup.lazy((value) =>
            typeof value === 'object'
              ? yup.object({
                  value: yup
                    .array()
                    .min(
                      field.validation.minSelection,
                      `${t('Choose_at_least')} ${field.validation.minSelection}`
                    )
                    .max(
                      field.validation.maxSelection,
                      `${t('max')} ${t(field.validation.maxSelection)} ${t(
                        'can_only_contain_letters'
                      )}`
                    )
                    .required(`${t(field.name)} selection is required`),
                })
              : yup
                  .array()
                  .min(
                    field.validation.minSelection,
                    `${t('Choose_at_least')} ${field.validation.minSelection}`
                  )
                  .max(
                    field.validation.maxSelection,
                    `${t('max')} ${t(field.validation.maxSelection)} ${t(
                      'can_only_contain_letters'
                    )}`
                  )
                  .required(`${t(field.name)} selection is required`)
          );
          break;
        default:
      }
      shape[field.name] = validator;
    }
  });
  return yup.object().shape(shape);
};

const RegistrationForm = ({ schema, geoData, setGetage }) => {
  //multi language setup
  const { t, language } = useTranslation();
  //dynamic schema for json object validation

  const navigation = useNavigation();
  const [selectedIds, setSelectedIds] = useState({});
  const [isDisable, setIsDisable] = useState(true);
  const [currentForm, setCurrentForm] = useState(1);
  const [currentMySchema, setCurrentMySchema] = useState();
  const [modal, setModal] = useState(false);
  const [err, setErr] = useState();
  const [networkError, setNetworkError] = useState(false);
  const [programData, setProgramData] = useState([]);
  const [isBtnDisable, setIsBtnDisable] = useState(true);
  const [checked, setChecked] = useState(false);
  const [secondChecked, setSecondChecked] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const { isConnected } = useInternet();

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

  const stepSchema = schema?.map((form) =>
    buildYupSchema(form, currentForm, t)
  );

  const currentschema = stepSchema[currentForm - 1];

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(currentschema),
    defaultValues: {
      // first_name: '',
      // lastname: '',
      // password: '',
      // repeatpassword: '',
      // multiplecards: [],
      username: '',
      preferred_language: {
        value: translateLanguage(language),
        fieldId: '',
      },
    },
  });

  const programValue = watch('program') || null;
  const stateValue = watch('state') || null;
  const districtValue = watch('district') || null;
  const age = watch('age') || null;

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
    await setDataInStorage('cohortData', JSON.stringify(getActiveCohort?.[0]));
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

    const youthnetTenantIds = programData?.filter((item) => {
      if (item?.name === 'YouthNet') {
        return item;
      }
    });
    const scp = programData?.filter((item) => {
      if (item?.name === 'Second Chance Program') {
        return item;
      }
    });

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
    const deviceId = await getDeviceId();
    await notificationSubscribe({ deviceId, user_id });
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

  const [loading, setLoading] = useState(false);
  const onSubmit = async (data) => {
    setLoading(true);
    const payload = await transformPayload(data);

    const token = await getAccessToken();
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

  useEffect(() => {
    setGetage(age);
  }, [age]);

  function addOptionsToField(formObject, fieldName, newOptions) {
    // Find the field in the 'fields' array where the name or label matches the given fieldName
    const field = formObject.fields.find(
      (field) => field.name === fieldName || field.label === fieldName
    );

    // If the field is found, add the new options
    if (field) {
      field.options = newOptions;
    }

    // Return the updated formObject
    return formObject;
  }

  const fetchDistricts = async () => {
    const payload = {
      // limit: 10,
      offset: 0,
      fieldName: 'districts',
      controllingfieldfk: stateValue?.value || stateValue,
    };

    const data = await getGeoLocation({ payload });
    const foundDistrict = data?.values?.find(
      (item) => item?.label === geoData?.district
    );

    const district = {
      label: foundDistrict?.label,
      value: foundDistrict?.value,
    };

    // if (districtValue?.label == undefined) {
    //   setValue('district', district);
    // }
    const newSchema = addOptionsToField(
      currentSchema,
      'district',
      data?.values
    );
    currentSchema = newSchema;
  };

  const fetchBlock = async () => {
    const payload = {
      // limit: 10,
      offset: 0,
      fieldName: 'blocks',
      controllingfieldfk: districtValue?.value,
    };
    const data = await getGeoLocation({ payload });
    const newSchema = addOptionsToField(currentSchema, 'block', data?.values);
    currentSchema = newSchema;
  };

  const setcontent = () => {
    let mySchema = schema?.find((form) => form.formNumber === 5);

    const updatedschema = [
      {
        type: 'parent_text',
        label: 'label',
        name: 'label',
        coreField: 'label',
        fieldId: 'label',
      },
    ];

    const newSchema = {
      ...currentSchema,
      fields: [...currentSchema.fields, ...updatedschema],
    };

    currentSchema = newSchema;
  };

  useEffect(() => {
    setcontent();
  }, [currentForm === 4]);

  useEffect(() => {
    fetchDistricts();
  }, [stateValue]);

  useEffect(() => {
    if (districtValue?.value) {
      fetchBlock();
    }
  }, [districtValue]);

  useEffect(() => {
    if (currentForm === 4) {
      fetchDistricts();
    }
    if (districtValue?.value) {
      fetchBlock();
    }
  }, [currentForm]);

  const renderFields = (fields) => {
    return fields?.map((field) => {
      switch (field.type) {
        case 'text':
          return (
            <View key={field.name} style={styles.inputContainer}>
              <CustomTextField
                field={field}
                control={control}
                errors={errors}
              />
            </View>
          );
        case 'number':
          return (
            <View key={field.name} style={styles.inputContainer}>
              <CustomTextField
                field={field}
                control={control}
                errors={errors}
                keyboardType="numeric"
              />
            </View>
          );
        case 'email':
          return (
            <View key={field.name} style={styles.inputContainer}>
              <CustomTextField
                field={field}
                control={control}
                errors={errors}
                autoCapitalize="none"
              />
            </View>
          );
        case 'password':
          return (
            <View key={field.name} style={styles.inputContainer}>
              <CustomPasswordTextField
                field={field}
                control={control}
                secureTextEntry={true}
                errors={errors}
              />
            </View>
          );
        case 'select':
          return (
            <View key={field.name} style={styles.inputContainer}>
              <CustomCards
                field={field}
                name={field.name}
                errors={errors}
                control={control}
                secureTextEntry={true}
                setSelectedIds={setSelectedIds}
                selectedIds={selectedIds}
              />
            </View>
          );
        case 'radio':
          return (
            <View key={field.name} style={styles.inputContainer}>
              <CustomRadioCard
                field={programData}
                name={field.name}
                errors={errors}
                control={control}
                secureTextEntry={true}
                setSelectedIds={setSelectedIds}
                selectedIds={selectedIds}
              />
            </View>
          );
        case 'select_drop_down':
          return (
            <View key={field.name} style={styles.inputContainer}>
              <DropdownSelect
                field={field || districts}
                name={field.name}
                errors={errors}
                control={control}
                secureTextEntry={true}
                setSelectedIds={setSelectedIds}
                selectedIds={selectedIds}
                setValue={setValue}
              />
            </View>
          );
        case 'multipleCard':
        case 'checkbox':
          return (
            <View key={field.name} style={styles.inputContainer}>
              <InterestedCardsComponent
                field={field}
                name={field.name}
                control={control}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                errors={errors}
              />
            </View>
          );
        case 'plain_text':
          return (
            <View key={field.name} style={styles.inputContainer}>
              <PlainText
                text="terms_and_conditions"
                CustomCards
                field={field}
                name={field.name}
                errors={errors}
                control={control}
              />
            </View>
          );
        case 'tc_text':
          return (
            <View key={field.name} style={styles.inputContainer}>
              <PlainTcText
                isDisable={isDisable}
                setIsDisable={setIsDisable}
                field={field}
                name={field.name}
                control={control}
              />
            </View>
          );
        case 'parent_text':
          return (
            <View key={field.name} style={styles.inputContainer}>
              <ParentText />
            </View>
          );
        default:
          return null;
      }
    });
  };

  const nextForm = async (data) => {
    let nextFormNumber = currentForm + 1;

    // Skip a specific form, e.g., form number 4
    if (currentForm === 3 && programValue?.name === 'Public') {
      nextFormNumber = 5; // Skip form number 4 and move to form 5
    }

    if (currentForm < schema?.length) {
      setCurrentForm(nextFormNumber);
    }

    if (currentForm === 1) {
      const randomThreeDigitNumber = Math.floor(Math.random() * 900) + 100;
      const fullName = `${data.first_name}${data.last_name}${randomThreeDigitNumber}`;
      setValue('username', fullName.toLowerCase());
    }

    if (currentForm === 2) {
      const stateAPIdata = JSON.parse(await getDataFromStorage('states'));
      const foundState = stateAPIdata.find(
        (item) => item?.label === geoData?.state
      );

      const payload = {
        // limit: 10,
        offset: 0,
        fieldName: 'districts',
        controllingfieldfk: stateValue?.value || stateValue,
      };

      const data = await getGeoLocation({ payload });
      const foundDistrict = data?.values?.find(
        (item) => item?.label === geoData?.district
      );

      const district = {
        label: foundDistrict?.label,
        value: foundDistrict?.value,
      };

      const state = {
        label: foundState?.label,
        value: foundState?.value,
      };

      if (foundState?.label !== undefined) {
        setValue('state', state);
        setValue('district', district);
      }

      fetchDistricts();
    }
  };

  const prevForm = () => {
    let prevFormNumber = currentForm - 1;

    if (currentForm === 5 && programValue?.name === 'Public') {
      prevFormNumber = 3; // Skip form number 4 and move to form 5
    }

    if (currentForm > 1) {
      setCurrentForm(prevFormNumber);
      setIsDisable(true);
      return true; // Indicates that the back action has been handled
    } else {
      navigation.goBack();
      return false; // Indicates that the back action should continue (exit)
    }
  };

  const getProgramData = async () => {
    const data = await getProgramDetails();
    setProgramData(data);
  };

  useEffect(() => {
    const logRegistrationInProgress = async () => {
      const obj = {
        eventName: 'registration_in_progress',
        method: 'form-load',
        screenName: 'Registration',
      };
      await logEventFunction(obj);
    };
    getProgramData();
    logRegistrationInProgress();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      prevForm
    );

    return () => {
      backHandler.remove();
    };
  }, [currentForm]);

  let currentSchema = schema?.find((form) => form.formNumber === currentForm);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Back Button** */}
      <TouchableOpacity style={styles.backbutton} onPress={prevForm}>
        <Image
          source={backIcon}
          resizeMode="contain"
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>

      <HeaderComponent
        question={currentSchema?.question}
        questionIndex={currentForm}
        totalForms={schema?.length}
      />
      {currentForm === 4 && (
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
      <ScrollView style={{ flex: 1 }} nestedScrollEnabled>
        {schema
          ?.filter((form) => form.formNumber === currentForm)
          ?.map((form) => (
            <View key={form.formNumber}>{renderFields(form.fields)}</View>
          ))}
        {currentForm === 1 && (
          <GlobalText
            style={[globalStyles.text, { marginLeft: 20, marginTop: -20 }]}
          >
            {t('phone_des')}
          </GlobalText>
        )}

        {currentForm === 5 && (
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
            {age < 18 && (
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
              age={age}
            />
          </>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        {loading ? (
          <ActiveLoading />
        ) : (
          <RenderBtn
            currentForm={currentForm}
            schema={schema}
            handleSubmit={handleSubmit}
            nextForm={nextForm}
            onSubmit={onSubmit}
            isDisable={isDisable}
            networkError={networkError}
            isModalVisible={isModalVisible}
            secondChecked={secondChecked}
            checked={checked}
            age={age}
          />
        )}
      </View>
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
    </KeyboardAvoidingView>
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

  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
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
    padding: 10,
  },
  image: {
    margin: 20,
    height: 60,
    width: 60,
  },
});

RegistrationForm.propTypes = {
  schema: PropTypes.any,
};

export default RegistrationForm;

const RenderBtn = ({
  currentForm,
  schema,
  handleSubmit,
  nextForm,
  onSubmit,
  age,
  networkError,
  isModalVisible,
  secondChecked,
  checked,
}) => {
  const { t } = useTranslation();

  const [showMore, setShowMore] = useState(true); // State for showing more content
  const { isConnected } = useInternet();

  const renderContent = () => {
    if (currentForm !== 8 && currentForm < schema?.length) {
      return (
        <PrimaryButton text={t('continue')} onPress={handleSubmit(nextForm)} />
      );
    } else {
      return (
        <>
          <PrimaryButton
            isDisabled={age < 18 ? !(checked && secondChecked) : !checked} // Button disabled until both are checked
            text={t('create_account')}
            onPress={handleSubmit(onSubmit)}
          />

          <NetworkAlert
            onTryAgain={handleSubmit(onSubmit)}
            isConnected={!networkError}
          />
        </>
      );
    }
  };

  return <View style={styles.buttonContainer}>{renderContent()}</View>;
};

RenderBtn.propTypes = {
  schema: PropTypes.any,
  currentForm: PropTypes.number,
  handleSubmit: PropTypes.func,
  nextForm: PropTypes.func,
  onSubmit: PropTypes.func,
  isDisable: PropTypes.any,
};
