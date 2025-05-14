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

const CustomCheckbox2 = ({
  setStaticFormData,
  staticFormData,
  options,
  category,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setSelectedItems(staticFormData[category] || []);
  }, [staticFormData, category]); // ✅ Added category to dependencies

  const toggleSelection = (item) => {
    setStaticFormData((prevFormData) => {
      const updatedCategoryData = prevFormData[category] || [];
      const exists = updatedCategoryData.includes(item);

      const newCategoryData = exists
        ? updatedCategoryData.filter((code) => code !== item)
        : [...updatedCategoryData, item];

      return { ...prevFormData, [category]: newCategoryData };
    });

    // ✅ Immediately update selectedItems for UI reactivity
    setSelectedItems((prevSelected) =>
      prevSelected.includes(item)
        ? prevSelected.filter((code) => code !== item)
        : [...prevSelected, item]
    );
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
            ? selectedItems.join(', ')
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
            keyExtractor={(item) => item} // Ensure items are unique
            renderItem={({ item }) => (
              <View style={styles.option}>
                <CheckBox
                  checked={selectedItems.includes(item)}
                  onChange={() => toggleSelection(item)}
                >
                  {item}
                </CheckBox>
              </View>
            )}
            nestedScrollEnabled
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

export default CustomCheckbox2;
