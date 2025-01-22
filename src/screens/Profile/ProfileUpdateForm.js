import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
} from 'react-native';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import CustomRadioCard from '@components/CustomRadioCard/CustomRadioCard';
import CustomCards from '@components/CustomCard/CustomCard';
import { getAccessToken, registerUser } from '@src/utils/API/AuthService';
import { logEventFunction } from '@src/utils/JsHelper/Helper';
import { useTranslation } from '@context/LanguageContext';
import { useInternet } from '@context/NetworkContext';
import PropTypes from 'prop-types';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
import { transformPayload } from './TransformPayload';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';
import ProfileHeader from './ProfileHeader';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import FastImage from '@changwoolab/react-native-fast-image';
import globalStyles from '../../utils/Helper/Style';
import GlobalText from '@components/GlobalText/GlobalText';
import lightning from '../../assets/images/png/lightning.png';
import {
  createNewObject,
  getDataFromStorage,
  setDataInStorage,
} from '../../utils/JsHelper/Helper';
import { getProfileDetails, updateUser } from '../../utils/API/AuthService';
import { useNavigation } from '@react-navigation/native';

const ProfileUpdateForm = ({ fields }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [schema, setSchema] = useState(fields);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [err, setErr] = useState();
  const { isConnected } = useInternet();
  const navigation = useNavigation();

  const logProfileEditInProgress = async () => {
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

      const updatedFormData = {
        ...formData,
        ['first_name']: firstName,
        ['last_name']: lastName,
        ['email']: finalResult?.email,
        ['age']: userDetails?.AGE,
        ['mobile']: finalResult?.mobile,
        ['gender']: userDetails?.WHATS_YOUR_GENDER?.toLowerCase(),
      };
      setFormData(updatedFormData);
    };
    fetchData();
    logProfileEditInProgress();
  }, []);

  const logProfileEditComplete = async () => {
    // Log the registration completed event
    const obj = {
      eventName: 'profile_updated',
      method: 'button-click',
      screenName: 'profile_update',
    };
    await logEventFunction(obj);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = await transformPayload(data);
    const user_id = await getDataFromStorage('userId');
    console.log('data', data);
    console.log('payload', payload);

    const register = await updateUser({ payload, user_id });
    // const register = await updateUser();

    if (!isConnected) {
      setLoading(false);
    } else if (register?.params?.status === 'failed') {
      setLoading(false);
      setModal(true);
      setErr(register?.params?.err);
    } else {
      logProfileEditComplete();
      const profileData = await getProfileDetails({
        userId: user_id,
      });

      await setDataInStorage('profileData', JSON.stringify(profileData));
      navigation.navigate('MyProfile');
    }
  };

  const pages = [
    ['first_name', 'last_name', 'email', 'mobile', 'age', 'gender'],
  ];

  const handleInputChange = (name, value) => {
    const updatedFormData = { ...formData, [name]: value };

    setFormData(updatedFormData);
    setErrors({ ...errors, [name]: '' }); // Clear errors for the field
  };

  const validateFields = () => {
    const pageFields = pages;
    const newErrors = {};

    pageFields.forEach((fieldName) => {
      const field = schema?.find((f) => f.name === fieldName);

      if (field) {
        const value = formData[field.name] || '';

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
              // options={programData}
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

      default:
        return null;
    }
  };

  const renderPage = () => {
    const pageFields = pages[0];
    return schema
      .filter((field) => pageFields.includes(field.name))
      .map((field) => renderField(field));
  };

  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit(formData);
    }
  };

  if (loading) {
    return <ActiveLoading />;
  }

  return (
    <>
      <SecondaryHeader logo />

      <ProfileHeader onPress={handleSubmit} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={{ flex: 1, marginVertical: 20 }}>
          {renderPage()}
        </ScrollView>
      </KeyboardAvoidingView>
      {modal && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer} activeOpacity={1}>
            {err && (
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
            )}
          </View>
        </Modal>
      )}
    </>
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

ProfileUpdateForm.propTypes = {
  fields: PropTypes.any,
};

export default ProfileUpdateForm;
