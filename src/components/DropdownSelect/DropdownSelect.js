import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyles from '../../utils/Helper/Style';
import { useController } from 'react-hook-form';
import { useTranslation } from '../../context/LanguageContext';

import GlobalText from '@components/GlobalText/GlobalText';
import { isProfileFieldRequired } from '../../utils/JsHelper/Helper';

const DropdownSelect = ({
  field,
  errors,
  options,
  formData,
  handleValue,
  editable = true,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();

  const toggleDropdown = () => {
    if (editable && options && options.length > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleSelect = (item) => {
    console.log('item', item);

    handleValue(field?.name, { value: item?.value, label: item?.label });
    setIsDropdownOpen(false);
  };

  const labelArray = [
    'STATES',
    'DISTRICTS',
    'BLOCKS',
    'VILLAGE',
    'STATE',
    'DISTRICT',
    'BLOCK',
  ];
  // console.log('options', options);
  // console.log('formData==>', formData);
  return (
    <View style={styles.dropdownContainer}>
      <View style={styles.label}>
        <GlobalText
          style={[
            globalStyles.text,
            { color: errors[field.name] ? 'red' : '#4D4639' },
          ]}
        >
          {t(field.label.toLowerCase())}
          {isProfileFieldRequired(field) && <Text style={styles.required}> *</Text>}
        </GlobalText>
      </View>

      <TouchableOpacity
        onPress={toggleDropdown}
        style={[
          styles.dropdownButton,
          {
            borderColor: errors[field.name] ? 'red' : '#DADADA',
            backgroundColor: editable ? 'white' : '#F5F5F5',
          },
        ]}
      >
        {labelArray.includes(field.label) ? (
          <GlobalText style={[globalStyles.text, { color: editable ? '#3B383E' : '#A0A0A0' }]}>
            {t(formData[field.name]?.label)}
          </GlobalText>
        ) : (
          <GlobalText style={[globalStyles.text, { color: editable ? '#3B383E' : '#A0A0A0' }]}>
            {t(formData[field.name]?.label?.toLowerCase())}
          </GlobalText>
        )}
        {editable && (
          <MaterialCommunityIcons name="chevron-down" size={24} color="black" />
        )}
      </TouchableOpacity>
      {isDropdownOpen && (
        <View style={styles.dropdownOptions}>
          <ScrollView nestedScrollEnabled>
            {options?.map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => handleSelect(item)}
                style={styles.dropdownOption}
              >
                <GlobalText style={styles.optionText}>
                  {labelArray.includes(field.label) ? (
                    <GlobalText style={[globalStyles.text]}>
                      {t(item?.label)}
                    </GlobalText>
                  ) : (
                    <GlobalText style={[globalStyles.text]}>
                      {t(item?.label?.toLowerCase())}
                    </GlobalText>
                  )}
                </GlobalText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {errors[field.name] && (
        <GlobalText style={styles.error}>{errors[field.name]}</GlobalText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 10,
    width: '95%',
    alignSelf: 'center',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  label: {
    backgroundColor: 'white',
    paddingHorizontal: 5,
    marginBottom: 6,
    alignSelf: 'flex-start', // Allow the label to adjust to its content width
  },
  selectedValue: {
    fontSize: 16,
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'white',
    marginTop: 5,
    maxHeight: 200, // Set a maximum height for the options box
  },
  dropdownOption: {
    padding: 10,
  },
  optionText: {
    fontSize: 14,
    color: '#000',
  },
  error: {
    textAlign: 'left',
    color: 'red',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    marginTop: 20,
    // marginLeft: 20,
  },
  required: {
    color: 'red',
  },
});

export default DropdownSelect;
