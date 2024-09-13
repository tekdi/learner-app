import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyles from '../../utils/Helper/Style';
import { useController } from 'react-hook-form';

const DropdownSelect = ({
  field,
  name,
  errors,
  setSelectedIds,
  selectedIds,
  control,
}) => {
  const [selectedValue, setSelectedValue] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    field: { onChange, value },
  } = useController({ name, control });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = (item) => {
    setSelectedValue(item);
    setSelectedIds((prevSelectedIds) => ({
      ...prevSelectedIds,
      [name]: { value: item, fieldId: field?.fieldId },
    }));
    onChange({ value: item, fieldId: field?.fieldId || null });
    setIsDropdownOpen(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <View style={styles.label}>
        <Text style={globalStyles.text}>{name}</Text>
      </View>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <Text style={[globalStyles.text]}>{selectedValue}</Text>
        <MaterialCommunityIcons name="chevron-down" size={24} color="black" />
      </TouchableOpacity>
      {isDropdownOpen && (
        <View style={styles.dropdownOptions}>
          {field?.options.map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => handleSelect(item?.value)}
              style={styles.dropdownOption}
            >
              <Text style={styles.optionText}>{item?.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    width: 50,
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
