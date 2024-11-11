import React, { useEffect, useState } from 'react';
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
  Button,
} from 'react-native';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import HeaderComponent from '../../components/CustomHeaderComponent/customheadercomponent';
import CustomCards from '../../components/CustomCard/CustomCard';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
// import Geolocation from 'react-native-geolocation-service';

//multi language
import { useTranslation } from '../../context/LanguageContext';

import InterestedCardsComponent from '../../components/InterestedComponents/InterestedComponents';
import CustomPasswordTextField from '../../components/CustomPasswordComponent/CustomPasswordComponent';
import {
  getDataFromStorage,
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
  login,
  registerUser,
  updateUser,
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
import SecondaryHeader from '../../components/Layout/SecondaryHeader';
import ProfileHeader from './ProfileHeader';

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

const ProfileUpdateForm = ({ schema }) => {
  //multi language setup
  const { t, language } = useTranslation();
  //dynamic schema for json object validation

  const navigation = useNavigation();
  const [selectedIds, setSelectedIds] = useState({});
  const [isDisable, setIsDisable] = useState(true);
  const [currentForm, setCurrentForm] = useState(1);

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
      // first_name: "",
      // lastname: '',
      // mobile: "",
      // email:"",
      // age: '',
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

  const logRegistrationComplete = async () => {
    // Log the registration completed event
    const obj = {
      eventName: 'profile_updated',
      method: 'button-click',
      screenName: 'profile_update',
    };
    await logEventFunction(obj);

    // Handle your registration logic here
  };

  const createNewObject = (customFields, labels) => {
    const result = {};
    customFields?.forEach((field) => {
      const cleanedFieldLabel = field?.label?.replace(/[^a-zA-Z0-9_ ]/g, '');

      if (labels.includes(cleanedFieldLabel)) {
        result[cleanedFieldLabel] = field.value || '';
      }
    });

    return result;
  };

  const onSubmit = async (data) => {
    const payload = await transformPayload(data);
    const user_id = await getDataFromStorage('userId');

    // await saveToken(token);
    const register = await updateUser({ payload, user_id });
    console.log({ register });

    if (register?.params?.status === 'failed') {
      console.log('hi');
    } else {
      console.log('hello');
      logRegistrationComplete();
      const profileData = await getProfileDetails({
        userId: user_id,
      });

      console.log(JSON.stringify(profileData));

      await setDataInStorage('profileData', JSON.stringify(profileData));
      navigation.navigate('MyProfile');
    }
  };

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
        default:
          return null;
      }
    });
  };

  const logRegistrationInProgress = async () => {
    const obj = {
      eventName: 'profile_update_view',
      method: 'on-click',
      screenName: 'profileUpdate',
    };
    await logEventFunction(obj);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = JSON.parse(await getDataFromStorage('profileData'));
      const finalResult = result?.getUserDetails?.[0];
      const [firstName, lastName] = finalResult?.name?.split(' ') || [];

      const requiredLabels = [
        'WHATS_YOUR_GENDER',
        'CLASS_OR_LAST_PASSED_GRADE',
        'STATES',
        'DISTRICTS',
        'BLOCKS',
        'AGE',
        'EMAIL',
      ];
      const customFields = finalResult?.customFields;
      const userDetails = createNewObject(customFields, requiredLabels);

      setValue('first_name', firstName);
      setValue('last_name', lastName);
      setValue('email', finalResult?.email);
      setValue('mobile', finalResult?.mobile);
      setValue('age', userDetails?.AGE);
      setValue('gender', {
        value: userDetails?.WHATS_YOUR_GENDER?.toLowerCase(),
      });
    };
    fetchData();
    logRegistrationInProgress();
  }, []);

  let currentSchema = schema?.find((form) => form.formNumber === currentForm);

  return (
    <>
      <SecondaryHeader logo />

      <ProfileHeader onPress={handleSubmit(onSubmit)} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={{ flex: 1 }} nestedScrollEnabled>
          {schema
            ?.filter((form) => form.formNumber === currentForm)
            ?.map((form) => (
              <View key={form.formNumber}>{renderFields(form.fields)}</View>
            ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 10,
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

ProfileUpdateForm.propTypes = {
  schema: PropTypes.any,
};

export default ProfileUpdateForm;

// const RenderBtn = ({
//   currentForm,
//   schema,
//   handleSubmit,
//   nextForm,
//   onSubmit,
//   isDisable,
//   networkError,
// }) => {
//   const { t } = useTranslation();
//   const [isBtnDisable, setIsBtnDisable] = useState(true);
//   const [checked, setChecked] = useState(false);
//   const [showMore, setShowMore] = useState(true); // State for showing more content

//   const renderContent = () => {
//     if (currentForm !== 8 && currentForm < schema?.length) {
//       return (
//         <PrimaryButton text={t('continue')} onPress={handleSubmit(nextForm)} />
//       );
//     }else {
//       return (
//         <>
//           {/* <PrimaryButton
//             isDisabled={isBtnDisable}
//             text={t('create_account')}
//             onPress={handleSubmit(onSubmit)}
//           /> */}
//           <NetworkAlert
//             onTryAgain={handleSubmit(onSubmit)}
//             isConnected={!networkError}
//           />
//         </>
//       );
//     }
//   };

//   return <View style={styles.buttonContainer}>{renderContent()}</View>;
// };
