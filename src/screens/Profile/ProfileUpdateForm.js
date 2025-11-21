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

  const fetchstate = async () => {
    const payload = {
      // limit: 10,
      offset: 0,
      fieldName: 'state',
    };
    const data = await getGeoLocation({ payload });
    setDataInStorage('states', JSON.stringify(data?.values || []));
    return data?.values;
  };

  const fetchDistricts = async (state) => {
    setLoading(true);
    const payload = {
      // limit: 10,
      offset: 0,
      fieldName: 'district',
      controllingfieldfk: [state || formData['state']?.value],
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
      fieldName: 'village',
      controllingfieldfk: [block || formData['block']?.value],
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
      fieldName: 'block',
      controllingfieldfk: [district || formData['district']?.value],
    };

    const data = await getGeoLocation({ payload });
    setBlockData(data?.values);
    setLoading(false);
    return data?.values;
  };

  const transformData = (data) => {
    return Object.keys(data).reduce((acc, key) => {
      if (Array.isArray(data[key]) && data[key].length > 0) {
        acc[key] = {
          label: data[key].map((item) => item.label).join(', '),
          value: data[key].map((item) => item.value).join(', '),
        };
      } else {
        acc[key] = data[key];
      }
      return acc;
    }, {});
  };

  const fetchStates = async (data) => {
    setLoading(true);
    const stateData = await fetchstate();
    const stateAPIdata = stateData;
    // console.log('stateAPIdata', JSON.stringify(stateAPIdata));

    const geoData = JSON.parse(await getDataFromStorage('geoData'));
    setStateData(stateAPIdata);
    const foundState = stateAPIdata?.find(
      (item) => item?.label.toLowerCase() === geoData?.state.toLowerCase()
    );
    const districtAll = await fetchDistricts(foundState?.value);

    const foundDistrict = districtAll?.find(
      (item) => item?.label.toLowerCase() === geoData?.district.toLowerCase()
    );

    console.log('foundState==>', foundState);
    console.log('data==>', data);

    const updatedFormData = {
      ...data,
      ['state']: {
        value: foundState?.value || data?.state?.value,
        label: foundState?.label || data?.state?.label,
      },
      ['district']: {
        value: foundDistrict?.value || data?.district?.value,
        label: foundDistrict?.label || data?.district?.label,
      },
    };
    const newData = transformData(updatedFormData);

    setFormData(newData);

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
      // console.log('userDetails', JSON.stringify(userDetails));
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
    // console.log('data', JSON.stringify(data));

    // Filter and set empty values for unwanted family member name fields based on family_member_details
    const filteredData = { ...data };
    const familyType = data?.family_member_details?.value || data?.family_member_details;
    
    // Set empty values for unwanted family member fields based on selection
    if (!familyType) {
      // If no family_member_details selected, set all family name fields to empty
      filteredData.father_name = "";
      filteredData.mother_name = "";
      filteredData.spouse_name = "";
    } else if (familyType === 'mother') {
      // If mother selected, keep mother_name and set others to empty
      filteredData.father_name = "";
      filteredData.spouse_name = "";
      // mother_name keeps its value
    } else if (familyType === 'father') {
      // If father selected, keep father_name and set others to empty
      filteredData.mother_name = "";
      filteredData.spouse_name = "";
      // father_name keeps its value
    } else if (familyType === 'spouse') {
      // If spouse selected, keep spouse_name and set others to empty
      filteredData.father_name = "";
      filteredData.mother_name = "";
      // spouse_name keeps its value
    }

    console.log('Original data:', data);
    console.log('Filtered data for updateUser:', filteredData);

    const payload = await transformPayload(filteredData);
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
    if (formData?.state) {
      fetchDistricts();
    }
    if (formData?.district) {
      fetchBlocks();
    }
    if (formData?.block) {
      fetchvillages();
    }
    setLoading(false);
  }, [formData['state'], formData['district'], formData['block']]);

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
          [
            'confirm_password',
            'password',
            'program',
            'username',
            'is_volunteer',
          ].includes(field.name)
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
          newErrors[field.name] = `${t('min_validation')
            .replace('{field}', t(field.name))
            .replace('{length}', field.minLength)}`;
        } else if (field.maxLength && value.length > field.maxLength && value) {
          newErrors[field.name] = `${t('max_validation')
            .replace('{field}', t(field.name))
            .replace('{length}', field.maxLength)}`;
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
    
    // Family member details conditional logic
    const familyType = formData?.family_member_details?.value || formData?.family_member_details;
    console.log('familyType:', familyType, 'field.name:', field.name, 'formData.family_member_details:', formData?.family_member_details);
    
    // If no family_member_details is selected, hide all family name fields
    if (
      !familyType &&
      ['father_name', 'mother_name', 'spouse_name'].includes(field.name)
    ) {
      console.log('Hiding field (no familyType):', field.name);
      return null;
    }
    
    // If spouse is selected, hide father_name and mother_name
    if (familyType === 'spouse' && (field.name === 'father_name' || field.name === 'mother_name')) {
      console.log('Hiding field (spouse selected):', field.name);
      return null;
    }
    
    // If father is selected, hide spouse_name and mother_name
    if (familyType === 'father' && (field.name === 'spouse_name' || field.name === 'mother_name')) {
      console.log('Hiding field (father selected):', field.name);
      return null;
    }
    
    // If mother is selected, hide father_name and spouse_name
    if (familyType === 'mother' && (field.name === 'father_name' || field.name === 'spouse_name')) {
      console.log('Hiding field (mother selected):', field.name);
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
        'is_volunteer',
        // 'state',
        // 'district',
        // 'block',
        // 'village',
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
              editable={!['first_name', 'last_name', 'firstName', 'lastName'].includes(field.name)}
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
                field.name === 'state'
                  ? stateData
                  : field.name === 'district'
                  ? districtData
                  : field.name === 'block'
                  ? blockData
                  : field.name === 'village'
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
