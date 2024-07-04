import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import HeaderComponent from '../../components/CustomHeaderComponent/customheadercomponent';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomCards from '../../components/CustomCard/CustomCard';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import { useNavigation } from '@react-navigation/native';

//multi language
import { useTranslation } from '../../context/LanguageContext';

import InterestedCardsComponent from '../../components/InterestedComponents/InterestedComponents';
import CustomPasswordTextField from '../../components/CustomPasswordComponent/CustomPasswordComponent';

const buildYupSchema = (form) => {
  const shape = {};
  form.fields.forEach((field) => {
    if (field.validation) {
      let validator;
      switch (field.type) {
        case 'text':
        case 'password':
          validator = yup.string();
          if (field.validation.required) {
            validator = validator.required(`${field.label} is required`);
          }
          if (field.validation.minLength) {
            validator = validator.min(
              field.validation.minLength,
              `${field.label} must be at least ${field.validation.minLength} characters`
            );
          }
          if (field.validation.maxLength) {
            validator = validator.max(
              field.validation.maxLength,
              `${field.label} must be at most ${field.validation.maxLength} characters`
            );
          }
          if (field.validation.match) {
            validator = validator.oneOf(
              [yup.ref('password'), null],
              'Passwords must match'
            );
          }
          if (field.validation.pattern) {
            validator = validator.matches(
              /^[A-Za-z]+$/,
              `${field.label} can only contain letters`
            );
          }
          break;
        case 'singleCard':
          validator = yup
            .string()
            .required(`At least one selection is required`);
          break;
        // Add other field types as needed...
        case 'multipleCard':
          validator = yup
            .array()
            .min(
              field.validation.minSelection,
              `At least ${field.validation.minSelection} cards must be selected`
            )
            .required(`${field.label} selection is required`);
          break;
        default:
      }
      shape[field.name] = validator;
    }
  });
  return yup.object().shape(shape);
};

const RegistrationFlow = ({ schema }) => {
  //multi language setup
  const { t } = useTranslation();
  //dynamic schema for json object validation

  const stepSchema = schema.map(buildYupSchema);
  const navigation = useNavigation();
  const [selectedIds, setSelectedIds] = useState({});
  const [currentForm, setCurrentForm] = useState(1);
  const currentschema = stepSchema[currentForm - 1];

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(currentschema),
    defaultValues: {
      firstname: '',
      lastname: '',
      username: '',
      password: '',
      repeatpassword: '',
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };
  const renderFields = (fields) => {
    return fields.map((field, index) => {
      switch (field.type) {
        case 'text':
          return (
            <View key={index} style={styles.inputContainer}>
              <CustomTextField
                field={field}
                control={control}
                errors={errors}
              />
            </View>
          );
        case 'password':
          return (
            <View key={index} style={styles.inputContainer}>
              <CustomPasswordTextField
                field={field}
                control={control}
                secureTextEntry={true}
                errors={errors}
              />
            </View>
          );
        case 'singleCard':
          return (
            <View style={styles.inputContainer} key={field.name}>
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
          return (
            <View style={styles.inputContainer} key={field.name}>
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
        default:
          return null;
      }
    });
  };

  const nextForm = (data) => {
    console.log(data);
    if (currentForm < schema.length) {
      setCurrentForm(currentForm + 1);
    }
  };

  const prevForm = () => {
    if (currentForm > 1) {
      setCurrentForm(currentForm - 1);
    } else {
      navigation.goBack();
    }
  };

  const currentSchema = schema.find((form) => form.formNumber === currentForm);

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
        question={currentSchema.question}
        questionIndex={currentForm}
        totalForms={schema.length}
      />
      <View style={{ margin: 10 }}></View>
      {schema
        .filter((form) => form.formNumber === currentForm)
        .map((form, index) => (
          <View key={index}>{renderFields(form.fields)}</View>
        ))}
      <View style={styles.buttonContainer}>
        {currentForm < schema.length ? (
          <CustomButton text={t('continue')} onPress={handleSubmit(nextForm)} />
        ) : (
          <CustomButton text={t('finish')} onPress={handleSubmit(onSubmit)} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
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
export default RegistrationFlow;
