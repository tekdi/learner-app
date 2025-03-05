import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { CheckBox } from '@ui-kitten/components';

const CustomCheckbox = ({
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
    console.log('item', item);

    setFormData((prevFormData) => {
      const updatedCategoryData = prevFormData[category] || [];
      const exists = updatedCategoryData.some(
        (selectedItem) => selectedItem.identifier === item.identifier
      );

      // Toggle selection
      let newCategoryData = exists
        ? updatedCategoryData.filter(
            (selectedItem) => selectedItem.identifier !== item.identifier
          )
        : [...updatedCategoryData, { ...item, index }]; // Add index here

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
        const prevData = prevIndexData[prevCategoryKey];
        const newCategoryData = prevData
          ? prevData.map((item) => ({ ...item, index: prevIndex })) // Ensure index is carried over
          : [];
        newFormData = replaceOptionsWithAssoc({
          category: prevCategoryKey,
          index: prevIndex,
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
      {/* Options List */}
      <View style={styles.dropdown}>
        <FlatList
          data={options}
          keyExtractor={(item) => item.identifier}
          renderItem={({ item }) => (
            <View style={styles.option}>
              <CheckBox
                checked={selectedItems.some(
                  (selectedItem) => selectedItem.identifier === item.identifier
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
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: { fontSize: 16, color: '#333', width: '80%' },
  dropdown: {
    // borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: 'white',
    maxHeight: 200,
    padding: 10,
  },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
});

export default CustomCheckbox;
