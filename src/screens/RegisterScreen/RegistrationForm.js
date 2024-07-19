import React, { useState } from 'react';
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

//multi language
import { useTranslation } from '../../context/LanguageContext';

import InterestedCardsComponent from '../../components/InterestedComponents/InterestedComponents';
import CustomPasswordTextField from '../../components/CustomPasswordComponent/CustomPasswordComponent';
import { translateLanguage } from '../../utils/JsHelper/Helper';
import PlainText from '../../components/PlainText/PlainText';
import PlainTcText from '../../components/PlainText/PlainTcText';

const buildYupSchema = (form) => {
  const shape = {};
  const { t } = useTranslation();
  form.fields.forEach((field) => {
    if (field.validation) {
      let validator;
      switch (field.type) {
        case 'text':
        case 'password':
          validator = yup.string();
          if (field.validation.required) {
            validator = validator.required(
              `${t(field.name)} ${t('is_required')}`
            );
          }
          if (field.validation.minLength) {
            validator = validator.min(
              field.validation.minLength,
              `${t(field.name)} ${t('min')} ${t(field.validation.minLength)} ${t('characters')}`
            );
          }
          if (field.validation.maxLength) {
            validator = validator.max(
              field.validation.maxLength,
              `${t(field.label)} ${t('max')} ${t(field.validation.maxLength)} ${t('characters')}`
            );
          }
          if (field.validation.match) {
            validator = validator.oneOf(
              [yup.ref('password'), null],
              `${t('Password_must_match')}`
            );
          }
          if (field.validation.pattern) {
            validator = validator.matches(
              /^[A-Za-z]+$/,
              `${t(field.name)} ${t('can_only_contain_letters')}`
            );
          }
          break;
        case 'drop_down':
        case 'radio':
          validator = yup
            .string()
            .required(`${t(field.name)} ${t('is_required')}`);
          break;
        // Add other field types as needed...
        case 'multipleCard':
        case 'checkbox':
          validator = yup
            .array()
            .min(
              field.validation.minSelection,
              `${t('Choose_at_least')} ${field.validation.minSelection}`
            )
            .required(`${t(field.name)} selection is required`)
            .max(
              field.validation.maxSelection,
              `${t('max')} ${t(field.validation.maxSelection)} ${t('can_only_contain_letters')}`
            );
          break;
        default:
      }
      shape[field.name] = validator;
    }
  });
  return yup.object().shape(shape);
};

const RegistrationForm = ({ schema }) => {
  //multi language setup
  const { t, language } = useTranslation();
  //dynamic schema for json object validation

  const stepSchema = schema?.map(buildYupSchema);
  const navigation = useNavigation();
  const [selectedIds, setSelectedIds] = useState({});
  const [currentForm, setCurrentForm] = useState(1);
  const [isDisable, setIsDisable] = useState(true);
  const currentschema = stepSchema[currentForm - 1];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const data = await getDataFromStorage();
  //   };

  //   fetchData();
  // }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(currentschema),
    defaultValues: {
      // firstname: '',
      // lastname: '',
      // username: '',
      // password: '',
      // repeatpassword: '',
      // multiplecards: [],
      preferred_language: translateLanguage(language),
    },
  });

  const onSubmit = (data) => {
    Alert.alert(
      'JSON PAYLOAD',
      JSON.stringify(data),
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => navigation.navigate('LoginSignUpScreen'), // Replace 'TargetScreen' with your screen name
        },
      ],
      { cancelable: false }
    );
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
        case 'drop_down':
        case 'radio':
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
              <PlainText text="terms_and_conditions" />
            </View>
          );
        case 'tc_text':
          return (
            <View key={field.name} style={styles.inputContainer}>
              <PlainTcText isDisable={isDisable} setIsDisable={setIsDisable} />
            </View>
          );
        default:
          return null;
      }
    });
  };

  const nextForm = (data) => {
    if (currentForm < schema?.length) {
      setCurrentForm(currentForm + 1);
    }
  };

  const prevForm = () => {
    if (currentForm > 1) {
      setCurrentForm(currentForm - 1);
      setIsDisable(true);
    } else {
      navigation.goBack();
    }
  };

  const currentSchema = schema?.find((form) => form.formNumber === currentForm);

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
      {schema
        ?.filter((form) => form.formNumber === currentForm)
        ?.map((form) => (
          <View style={{ top: 20, position: 'relative' }} key={form.formNumber}>
            {renderFields(form.fields)}
          </View>
        ))}

      <View style={styles.buttonContainer}>
        {currentForm !== 7 && currentForm < schema?.length ? (
          <PrimaryButton
            text={t('continue')}
            onPress={handleSubmit(nextForm)}
          />
        ) : currentForm === 7 ? (
          <SafeAreaView
            style={{
              justifyContent: 'space-between',
              height: 150,
            }}
          >
            <PrimaryButton
              text={t('I_am_18_or_older')}
              onPress={handleSubmit(nextForm)}
              color={'#FFFFFF'}
            />
            <PrimaryButton
              text={t('I_am_under_18')}
              onPress={handleSubmit(nextForm)}
              color={'#FFFFFF'}
            />
          </SafeAreaView>
        ) : (
          <>
            <PrimaryButton
              isDisabled={isDisable}
              text={t('create_account')}
              onPress={handleSubmit(onSubmit)}
            />
            <Text style={{ color: 'black', marginVertical: 10 }}>
              {t('T&C_13')}
            </Text>
          </>
        )}
      </View>
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
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
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
  backbutton: {},
});

RegistrationForm.propTypes = {
  schema: PropTypes.any,
};

export default RegistrationForm;
