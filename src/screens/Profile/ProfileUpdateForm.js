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
import CustomCards from '@components/CustomCard/CustomCard';
import { logEventFunction } from '@src/utils/JsHelper/Helper';
import { useTranslation } from '@context/LanguageContext';
import { useInternet } from '@context/NetworkContext';
import PropTypes from 'prop-types';
import ActiveLoading from '../LoadingScreen/ActiveLoading';
import { transformPayload } from './TransformPayload';
import SecondaryHeader from '../../components/Layout/SecondaryHeader';
import ProfileHeader from './ProfileHeader';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import globalStyles from '../../utils/Helper/Style';
import GlobalText from '@components/GlobalText/GlobalText';
import lightning from '../../assets/images/png/lightning.png';
import {
  calculateAge,
  createNewObject,
  getDataFromStorage,
  setDataInStorage,
} from '../../utils/JsHelper/Helper';
import {
  getGeoLocation,
  getProfileDetails,
  updateUser,
} from '../../utils/API/AuthService';
import { useNavigation } from '@react-navigation/native';
import RadioButton from '@components/CustomRadioCard/RadioButton';
import DropdownSelect from '@components/DropdownSelect/DropdownSelect';
import CustomPasswordTextField from '@components/CustomPasswordComponent/CustomPasswordComponent';
import DateTimePicker from '@components/DateTimePicker/DateTimePicker';

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
  const [currentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [blockData, setBlockData] = useState([]);
  const [villageData, setVillageData] = useState([]);
  const [updateFormData, setUpdateFormData] = useState([]);

  const logProfileEditInProgress = async () => {
    const obj = {
      eventName: 'profile_update_view',
      method: 'on-click',
      screenName: 'profileUpdate',
    };
    await logEventFunction(obj);
  };

  const fetchDistricts = async (state) => {
    setLoading(true);
    const payload = {
      // limit: 10,
      offset: 0,
      fieldName: 'districts',
      controllingfieldfk: state || formData['states']?.value,
    };

    const data = await getGeoLocation({ payload });
    setDistrictData(data?.values);
    setLoading(false);
    return data?.values;
  };
  const fetchvillages = async (block) => {
    setLoading(true);
    const payload = {
      // limit: 10,
      offset: 0,
      fieldName: 'villages',
      controllingfieldfk: block || formData['blocks']?.value,
    };

    const data = await getGeoLocation({ payload });

    setVillageData(data?.values);
    setLoading(false);
    return data?.values;
  };
  const fetchBlocks = async (district) => {
    setLoading(true);
    const payload = {
      // limit: 10,
      offset: 0,
      fieldName: 'blocks',
      controllingfieldfk: district || formData['districts']?.value,
    };

    const data = await getGeoLocation({ payload });
    setBlockData(data?.values);
    setLoading(false);
    return data?.values;
  };

  const fetchStates = async (data) => {
    setLoading(true);
    const stateAPIdata = JSON.parse(await getDataFromStorage('states'));

    const geoData = JSON.parse(await getDataFromStorage('geoData'));
    setStateData(stateAPIdata);
    const foundState = stateAPIdata?.find(
      (item) => item?.label === geoData?.state
    );
    const districtAll = await fetchDistricts(foundState?.value);

    const foundDistrict = districtAll?.find(
      (item) => item?.label === geoData?.district
    );

    const updatedFormData = {
      ...data,
      ['states']: { value: foundState?.value, label: foundState?.label },
      ['districts']: {
        value: foundDistrict?.value,
        label: foundDistrict?.label,
      },
    };
    setFormData(updatedFormData);

    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = JSON.parse(await getDataFromStorage('profileData'));
      const finalResult = result?.getUserDetails?.[0];
      const keysToRemove = [
        'customFields',
        'total_count',
        'status',
        'updatedAt',
        'createdAt',
        'updatedBy',
        'createdBy',
        'username',
      ];

      const filteredResult = Object.keys(finalResult)
        .filter((key) => !keysToRemove.includes(key))
        .reduce((obj, key) => {
          obj[key] = finalResult[key];
          return obj;
        }, {});
      const requiredLabels = schema?.map((item) => {
        return { label: item?.label, name: item?.name };
      });
      const customFields = finalResult?.customFields;
      const userDetails = createNewObject(customFields, requiredLabels);
      console.log('userDetails', JSON.stringify(userDetails));
      // console.log('customFields', JSON.stringify(customFields));

      const newUpdatedObj = { ...userDetails, ...filteredResult };

      const updatedFormData = {
        ...formData,
        ...newUpdatedObj,
      };
      fetchStates(updatedFormData);
    };

    const defaultPages = groupFieldsByOrder(schema);
    setPages(defaultPages);
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

  const groupFieldsByOrder = (schema) => {
    const grouped = schema.reduce((acc, item) => {
      const order = parseInt(item.order);
      if (!acc[order]) {
        acc[order] = [];
      }
      acc[order].push(item.name);
      return acc;
    }, {});

    // Convert the grouped object into an ordered array of arrays
    const orderedPages = Object.keys(grouped)
      .sort((a, b) => a - b)
      .map((order) => grouped[order]);

    return orderedPages;
  };

  useEffect(() => {
    setLoading(true);
    if (formData?.states) {
      fetchDistricts();
    }
    if (formData?.districts) {
      fetchBlocks();
    }
    if (formData?.blocks) {
      fetchvillages();
    }
    setLoading(false);
  }, [formData['states'], formData['districts'], formData['blocks']]);

  useEffect(() => {}, []);

  const handleInputChange = (name, value) => {
    const updatedFormData = { ...formData, [name]: value };

    setFormData(updatedFormData);
    setUpdateFormData({ ...updateFormData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear errors for the field
  };

  const validateFields = () => {
    const pageFields = pages[currentPage];
    const newErrors = {};

    pageFields.forEach((fieldName) => {
      const field = schema?.find((f) => f.name === fieldName);
      const age = calculateAge(formData?.dob || '');

      if (field) {
        const value = formData[field.name] || '';
        if (
          ['confirm_password', 'password', 'program', 'username'].includes(
            field.name
          )
        ) {
          return; // Skip validation for these fields
        }
        if (
          ['guardian_name', 'guardian_relation', 'parent_phone'].includes(
            field.name
          ) &&
          age &&
          parseInt(age, 10) >= 18
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
          !new RegExp(field.pattern.replace(/^\/|\/$/g, '')).test(value)
        ) {
          newErrors[field.name] = `${t(field.name)} ${t('is_invalid')}.`;
        }
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const renderField = (field) => {
    const age = calculateAge(formData?.dob || '');
    if (
      (field.name === 'guardian_relation' ||
        field.name === 'guardian_name' ||
        field.name === 'parent_phone') &&
      age &&
      parseInt(age, 10) >= 18
    ) {
      return null;
    }
    // if (field.name && !field?.isEditable) {
    //   return null;
    // }
    if (
      [
        'username',
        'password',
        'confirm_password',
        'states',
        'districts',
        'blocks',
        'villages',
      ].includes(field.name)
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
              autoCapitalize={'none'}
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
            <RadioButton
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
                      : field.name === 'villages'
                        ? villageData
                        : field?.options
              }
              errors={errors}
              formData={formData}
              handleValue={handleInputChange}
            />
          </View>
        );
      case 'password':
      case 'confirm_password':
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
      case 'date':
        return (
          <View key={field.name} style={styles.inputContainer}>
            <DateTimePicker
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
      .filter((field) => pageFields?.includes(field.name))
      .map((field) => renderField(field));
  };
  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit(updateFormData);
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
