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

const DropdownSelect = ({
  field,
  name,
  errors,
  setSelectedIds,
  selectedIds,
  control,
  setValue,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();
  const {
    field: { onChange, value },
  } = useController({ name, control });

  useEffect(() => {
    // setSelectedValue({ value: value?.value, fieldId: field?.fieldId });
    setSelectedIds((prevSelectedIds) => ({
      ...prevSelectedIds,
      [name]: {
        label: value?.label,
        value: value?.value,
        fieldId: field?.fieldId,
      },
    }));
    onChange({
      label: value?.label,
      value: value?.value,
      fieldId: field?.fieldId,
    });
  }, []);

  const toggleDropdown = () => {
    if (field.options && field.options.length > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleSelect = (item) => {
    // setSelectedValue({ name: item?.label, value: item?.value });
    setSelectedIds((prevSelectedIds) => ({
      ...prevSelectedIds,
      [name]: {
        label: item?.label,
        value: item?.value,
        fieldId: field?.fieldId,
      },
    }));
    onChange({
      label: item?.label,
      value: item?.value,
      fieldId: field?.fieldId,
    });

    if (name === 'state') {
      setValue('district', '');
      setValue('block', '');
    }
    setIsDropdownOpen(false);
  };

  console.log('errors', errors[name]);

  return (
    <View style={styles.dropdownContainer}>
      <View style={styles.label}>
        <Text style={globalStyles.text}>{t(name)}</Text>
      </View>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <Text style={[globalStyles.text]}>{value?.label}</Text>
        <MaterialCommunityIcons name="chevron-down" size={24} color="black" />
      </TouchableOpacity>
      {isDropdownOpen && (
        <View style={styles.dropdownOptions}>
          <ScrollView nestedScrollEnabled>
            {field.options?.map((item) => (
              <TouchableOpacity
                key={item.value}
                onPress={() => handleSelect(item)}
                style={styles.dropdownOption}
              >
                <Text style={styles.optionText}>{item?.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {errors[name] && (
        <Text
          style={{
            color: 'red',
            alignSelf: 'flex-start',
            marginTop: 10,
            fontFamily: 'Poppins-Regular',
          }}
        >
          {errors[name]?.value?.message}
        </Text>
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
    top: 15,
    left: 15,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    zIndex: 1,
    width: 70,
    alignItems: 'center',
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
});

export default DropdownSelect;
