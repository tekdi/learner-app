import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { CheckBox } from '@ui-kitten/components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MultiSelectDropdown = ({
  options,
  category,
  setFormData,
  formData,
  replaceOptionsWithAssoc,
  index,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    // Initialize selectedItems with the objects from formData[category]
    const initialSelectedItems = formData[category] || [];
    setSelectedItems(initialSelectedItems);
  }, [formData, category]);

  const toggleSelection = (item) => {
    setFormData((prevFormData) => {
      const updatedCategoryData = prevFormData[category] || [];
      const exists = updatedCategoryData.some(
        (selectedItem) => selectedItem.identifier === item.identifier
      );

      // Toggle selection
      const newCategoryData = exists
        ? updatedCategoryData.filter(
            (selectedItem) => selectedItem.identifier !== item.identifier
          )
        : [...updatedCategoryData, item];

      // Handle cascading logic if needed
      const formKeys = Object.keys(prevFormData);
      const categoryIndex = formKeys.indexOf(category);
      const prevCategoryKey =
        categoryIndex > 0 ? formKeys[categoryIndex - 1] : null;
      const prevCategoryValues = prevCategoryKey
        ? prevFormData[prevCategoryKey]
        : [];

      let prevIndexData = {};
      let prevIndex;

      if (newCategoryData.length === 0 && categoryIndex > 0) {
        prevIndexData[prevCategoryKey] = prevCategoryValues;
        prevIndex = index - 1;
      }
      let newFormData = null;

      if (index > 1 && newCategoryData.length === 0) {
        const newCategoryData = prevIndexData[prevCategoryKey];
        const category = prevCategoryKey;
        const index = prevIndex;
        newFormData = replaceOptionsWithAssoc({
          category,
          index,
          newCategoryData,
        });
      } else {
        newFormData = replaceOptionsWithAssoc({
          category,
          index,
          newCategoryData,
        });
      }

      return { ...newFormData, [category]: newCategoryData };
    });
  };

  return (
    <View style={styles.container}>
      {/* Dropdown Button */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownVisible(!isDropdownVisible)}
      >
        <Text style={styles.buttonText}>
          {selectedItems.length > 0
            ? selectedItems.map((item) => item.name).join(', ')
            : 'Select options'}
        </Text>
        <MaterialIcons
          name={isDropdownVisible ? 'arrow-drop-up' : 'arrow-drop-down'}
          size={24}
          color="black"
        />
      </TouchableOpacity>

      {/* Options List */}
      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.identifier}
            renderItem={({ item }) => (
              <View style={styles.option}>
                <CheckBox
                  checked={selectedItems.some(
                    (selectedItem) =>
                      selectedItem.identifier === item.identifier
                  )}
                  onChange={() => toggleSelection(item)}
                >
                  {item.name}
                </CheckBox>
              </View>
            )}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: { fontSize: 16, color: '#333', width: '80%' },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: 'white',
    padding: 10,
    maxHeight: 200,
  },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
});

export default MultiSelectDropdown;
