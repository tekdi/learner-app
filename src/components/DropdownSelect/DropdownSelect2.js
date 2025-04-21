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

const DropdownSelect = ({
  field,
  name,
  error,
  setSelectedIds,
  selectedIds,
  value,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // setSelectedValue({ value: value?.value, fieldId: field?.fieldId });
    setSelectedIds((prevSelectedIds) => ({
      ...prevSelectedIds,
      label: value?.label || null,
      value: value?.value || null,
    }));
  }, []);

  const toggleDropdown = () => {
    if (field && field.length > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleSelect = (item) => {
    // setSelectedValue({ name: item?.label, value: item?.value });
    setSelectedIds((prevSelectedIds) => ({
      ...prevSelectedIds,
      label: item?.label || item?.name,
      value: item?.value || item?.code,
    }));

    setIsDropdownOpen(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <View style={styles.label}>
        <GlobalText style={globalStyles.text}>{t(name)}</GlobalText>
      </View>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
        <GlobalText
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[globalStyles.text, { width: '90%' }]}
        >
          {selectedIds?.label || t('select')}
        </GlobalText>
        <MaterialCommunityIcons name="chevron-down" size={24} color="black" />
      </TouchableOpacity>
      {isDropdownOpen && (
        <View style={styles.dropdownOptions}>
          <ScrollView nestedScrollEnabled>
            {field?.map((item, key) => (
              <TouchableOpacity
                key={key}
                onPress={() => handleSelect(item)}
                style={styles.dropdownOption}
              >
                <GlobalText style={styles.optionText}>
                  {item?.label || item?.name}
                </GlobalText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {error && (
        <GlobalText
          style={{
            color: 'red',
            alignSelf: 'flex-start',
            marginTop: 10,
            fontFamily: 'Poppins-Regular',
          }}
        >
          {error}
        </GlobalText>
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
    position: 'absolute',
    top: 60,
    zIndex: 2,
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
