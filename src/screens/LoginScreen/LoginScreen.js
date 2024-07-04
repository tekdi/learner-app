import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import { CheckBox } from '@ui-kitten/components';
import backIcon from '../../assets/images/png/arrow-back-outline.png';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../context/LanguageContext';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomPasswordTextField from '../../components/CustomPasswordComponent/CustomPasswordComponent';

const LoginScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const Loginschema = [
    {
      fields: [
        {
          type: 'text',
          label: t('lb_first_name'),
          name: 'firstname',
          validation: {
            required: true,
            minLength: 3,
            maxLength: 30,
            pattern: /^[a-zA-Z]+$/,
          },
        },
        {
          type: 'password',
          label: t('lb_pass'),
          name: 'password',
          placeholder: 'Enter your password',
          validation: {
            required: true,
            minLength: 8,
          },
        },
      ],
    },
  ];

  const validationSchema = yup.object().shape({
    firstname: yup
      .string()
      .required('Please enter your first name')
      .min(3, 'First name should be at least 3 characters')
      .max(30)
      .matches(/^[a-zA-Z]+$/, 'First name should be alphabets only'),
    password: yup
      .string()
      .required('Please enter your password')
      .min(8, 'Password should be at least 8 characters'),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstname: '',
      password: '',
    },
  });

  const renderForm = () => {
    return Loginschema[0].fields.map((field, index) => {
      switch (field.type) {
        case 'text':
          return (
            <CustomTextField
              key={index}
              field={field}
              control={control}
              errors={errors}
            />
          );
        case 'password':
          return (
            <CustomPasswordTextField
              key={index}
              field={field}
              control={control}
              errors={errors}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backbutton}
        onPress={() => {
          navigation.navigate('LoginSignUpScreen');
        }}
      >
        <Image
          source={backIcon}
          resizeMode="contain"
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
      <View style={styles.textfieldbox}>{renderForm()}</View>
      <TouchableOpacity style={{ paddingLeft: 20, marginBottom: 30 }}>
        <Text
          style={{
            color: '#0D599E',
            fontFamily: 'Poppins-Medium',
            fontSize: 15,
          }}
        >
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <View style={styles.rembox}>
        <CheckBox style={{ paddingLeft: 10 }} />
        <View style={{ paddingLeft: 10 }}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Poppins-Regular',
              fontSize: 17,
            }}
          >
            Remember me
          </Text>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          padding: 10,
          alignSelf: 'center',
        }}
      >
        <CustomButton
          text={t('login')}
          onPress={handleSubmit((data) => {
            console.log(data);
            navigation.navigate('LoginSignUpScreen');
          })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backbutton: {},
  container: {
    flex: 1,
    height: '100%',
    paddingTop: 50,
    padding: 20,
    backgroundColor: 'white',
  },
  textfieldbox: {
    marginTop: 40,
  },
  rembox: {
    alignContent: 'center',
    flexDirection: 'row',
  },
});

export default LoginScreen;
