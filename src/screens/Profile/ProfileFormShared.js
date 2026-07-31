import React from 'react';
import CustomTextField from '../../components/CustomTextField/CustomTextField';
import CustomCards from '@components/CustomCard/CustomCard';
import RadioButton from '@components/CustomRadioCard/RadioButton';
import DropdownSelect from '@components/DropdownSelect/DropdownSelect';
import CustomPasswordTextField from '@components/CustomPasswordComponent/CustomPasswordComponent';
import DateTimePicker from '@components/DateTimePicker/DateTimePicker';
import { calculateAge } from '../../utils/JsHelper/Helper';

const NON_EDITABLE_NAME_FIELDS = [
  'first_name',
  'last_name',
  'firstName',
  'lastName',
  'state',
  'district',
  'block',
  'village',
];
const ALWAYS_HIDDEN_FIELDS = [
  'username',
  'password',
  'confirm_password',
  'is_volunteer',
];
const FAMILY_NAME_FIELDS = ['father_name', 'mother_name', 'spouse_name'];

const getFamilyType = (formData) => {
  const raw = formData?.family_member_details;
  return raw && typeof raw === 'object' ? raw.value : raw;
};

const getPhoneType = (formData) => {
  const raw = formData?.phone_type_accessible;
  return raw && typeof raw === 'object' ? raw.value : raw;
};

const getAgeFromFormData = (formData) => {
  const dob = formData?.dob || '';
  if (!dob) {
    return null;
  }
  try {
    const age = calculateAge(dob);
    return age !== null && age !== undefined && !isNaN(age) ? parseInt(age, 10) : null;
  } catch {
    return null;
  }
};

// Whether `field` should be shown/considered given the rest of the form's current
// values - age-based guardian/mobile visibility, the selected family member
// relation, and phone ownership. Shared so the full Edit Profile form and the
// Complete Profile mini-form apply identical conditional logic.
export const isFieldVisible = (field, formData) => {
  const ageValue = getAgeFromFormData(formData);
  const isAge18OrAbove = ageValue !== null && ageValue >= 18;
  const isAgeBelow18 = ageValue !== null && ageValue < 18;

  if (
    ['guardian_relation', 'guardian_name', 'parent_phone'].includes(field.name) &&
    isAge18OrAbove
  ) {
    return false;
  }
  if (
    ['phone_num', 'phone_number', 'mobile'].includes(field.name) &&
    isAgeBelow18
  ) {
    return false;
  }

  const familyType = getFamilyType(formData);
  if (!familyType && FAMILY_NAME_FIELDS.includes(field.name)) {
    return false;
  }
  if (familyType === 'spouse' && ['father_name', 'mother_name'].includes(field.name)) {
    return false;
  }
  if (familyType === 'father' && ['spouse_name', 'mother_name'].includes(field.name)) {
    return false;
  }
  if (familyType === 'mother' && ['father_name', 'spouse_name'].includes(field.name)) {
    return false;
  }

  if (field.name === 'own_phone_check' && getPhoneType(formData) === 'nophone') {
    return false;
  }

  if (ALWAYS_HIDDEN_FIELDS.includes(field.name)) {
    return false;
  }

  return true;
};

// Reorders `schema` so father_name/mother_name/spouse_name render immediately
// after family_member_details, regardless of their original position.
export const reorderFamilyFieldsAfterSelector = (schema) => {
  const familyDetailsIndex = schema.findIndex(
    (f) => f.name === 'family_member_details'
  );
  if (familyDetailsIndex === -1) {
    return schema;
  }

  const nameFields = schema.filter((f) => FAMILY_NAME_FIELDS.includes(f.name));
  let orderedSchema = schema.filter((f) => !FAMILY_NAME_FIELDS.includes(f.name));
  const insertAt =
    orderedSchema.findIndex((f) => f.name === 'family_member_details') + 1;
  orderedSchema.splice(insertAt, 0, ...nameFields);

  return orderedSchema;
};

// Renders the single input component for `field` (no wrapping container - callers
// own their own layout), or null if the field is currently hidden per
// isFieldVisible(). Shared between ProfileUpdateForm and CompleteProfileFormScreen
// so both screens use identical field components and behavior.
export const renderProfileField = (
  field,
  { formData, errors, handleInputChange, geoOptions = {} }
) => {
  if (!isFieldVisible(field, formData)) {
    return null;
  }

  switch (field.type) {
    case 'text':
      return (
        <CustomTextField
          key={field.name}
          field={field}
          formData={formData}
          handleValue={handleInputChange}
          errors={errors}
          editable={!NON_EDITABLE_NAME_FIELDS.includes(field.name)}
        />
      );
    case 'email':
      return (
        <CustomTextField
          key={field.name}
          field={field}
          formData={formData}
          handleValue={handleInputChange}
          errors={errors}
          autoCapitalize={'none'}
        />
      );
    case 'numeric':
      return (
        <CustomTextField
          key={field.name}
          field={field}
          formData={formData}
          handleValue={handleInputChange}
          errors={errors}
          keyboardType="numeric"
        />
      );
    case 'radio':
      return (
        <RadioButton
          key={field.name}
          field={field}
          errors={errors}
          formData={formData}
          handleValue={handleInputChange}
        />
      );
    case 'select':
      return (
        <CustomCards
          key={field.name}
          field={field}
          errors={errors}
          formData={formData}
          handleValue={handleInputChange}
        />
      );
    case 'drop_down':
      return (
        <DropdownSelect
          key={field.name}
          field={field}
          options={
            field.name === 'state'
              ? geoOptions.stateData
              : field.name === 'district'
              ? geoOptions.districtData
              : field.name === 'block'
              ? geoOptions.blockData
              : field.name === 'village'
              ? geoOptions.villageData
              : field?.options
          }
          errors={errors}
          formData={formData}
          handleValue={handleInputChange}
          editable={!NON_EDITABLE_NAME_FIELDS.includes(field.name)}
        />
      );
    case 'password':
    case 'confirm_password':
      return (
        <CustomPasswordTextField
          key={field.name}
          field={field}
          errors={errors}
          formData={formData}
          handleValue={handleInputChange}
        />
      );
    case 'date':
      return (
        <DateTimePicker
          key={field.name}
          field={field}
          errors={errors}
          formData={formData}
          handleValue={handleInputChange}
        />
      );
    default:
      return null;
  }
};

// Validates `fieldNames` (defaults to every field in `schema`) against `formData`,
// applying the same required/minLength/maxLength/pattern rules - and the same
// conditional skips (age, family member selection, phone ownership) - as the full
// Edit Profile form. Returns an { [fieldName]: message } errors object.
export const validateProfileFields = (schema, formData, t, fieldNames) => {
  const targetFields = fieldNames || schema?.map((f) => f.name) || [];
  const newErrors = {};
  const age = calculateAge(formData?.dob || '');
  const ageValue = age ? parseInt(age, 10) : null;
  const familyType = getFamilyType(formData);
  const phoneType = getPhoneType(formData);

  targetFields.forEach((fieldName) => {
    const field = schema?.find((f) => f.name === fieldName);
    if (!field) {
      return;
    }

    const fieldValue = formData[field.name];
    let value = '';
    if (fieldValue !== null && fieldValue !== undefined) {
      if (typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
        value = fieldValue.value !== undefined ? String(fieldValue.value) : '';
      } else if (Array.isArray(fieldValue)) {
        value =
          fieldValue.length > 0
            ? String(fieldValue[0]?.value || fieldValue[0] || '')
            : '';
      } else {
        value = String(fieldValue);
      }
    }

    if (
      [
        'confirm_password',
        'password',
        'program',
        'username',
        'is_volunteer',
        'family_member_details',
      ].includes(field.name)
    ) {
      return;
    }
    if (
      ['guardian_name', 'guardian_relation', 'parent_phone'].includes(field.name) &&
      ageValue !== null &&
      ageValue >= 18
    ) {
      return;
    }
    if (familyType === 'mother' && ['father_name', 'spouse_name'].includes(field.name)) {
      return;
    }
    if (familyType === 'father' && ['mother_name', 'spouse_name'].includes(field.name)) {
      return;
    }
    if (familyType === 'spouse' && ['father_name', 'mother_name'].includes(field.name)) {
      return;
    }
    if (!familyType && FAMILY_NAME_FIELDS.includes(field.name)) {
      return;
    }
    if (field.name === 'mobile' && ageValue !== null && ageValue < 18) {
      return;
    }
    if (field.name === 'own_phone_check' && phoneType === 'nophone') {
      return;
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
  });

  return newErrors;
};
