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

const DropdownSelect = ({ field, errors, options, formData, handleValue }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();

  const toggleDropdown = () => {
    if (options && options.length > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleSelect = (item) => {
    console.log('item', item);
    handleValue(field?.name, { value: item?.value, label: item?.label });
    setIsDropdownOpen(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <View style={styles.label}>
        <GlobalText style={globalStyles.text}>{t(field.name)}</GlobalText>
      </View>

      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <GlobalText style={[globalStyles.text]}>
          {t(formData[field.name]?.label)}
        </GlobalText>
        <MaterialCommunityIcons name="chevron-down" size={24} color="black" />
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
                  {t(item?.label)}
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
    top: -10,
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
    // position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    zIndex: 1,
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
    marginLeft: 20,
  },
});

export default DropdownSelect;
