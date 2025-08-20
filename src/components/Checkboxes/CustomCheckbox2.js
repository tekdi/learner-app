import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { CheckBox } from '@ui-kitten/components';
import GlobalText from '@components/GlobalText/GlobalText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomCheckbox2 = ({
  setStaticFormData,
  staticFormData,
  options,
  category,
  showMoreLimit = 3,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAllOptions, setShowAllOptions] = useState(false);

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

  const renderCheckboxItem = ({ item }) => {
    const isSelected = selectedItems.includes(item);

    return (
      <View style={styles.optionContainer}>
        <CheckBox
          checked={isSelected}
          onChange={() => toggleSelection(item)}
          style={styles.checkbox}
          checkedColor="#333"
          tintColor="#FFD700"
        >
          {() => (
            <GlobalText style={[styles.optionText, isSelected && styles.selectedText]}>
              {item}
            </GlobalText>
          )}
        </CheckBox>
      </View>
    );
  };

  const displayOptions = showAllOptions ? options : options.slice(0, showMoreLimit);
  const hasMoreOptions = options.length > showMoreLimit;

  return (
    <View style={styles.container}>
      <FlatList
        data={displayOptions}
        keyExtractor={(item) => item} // Ensure items are unique
        renderItem={renderCheckboxItem}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      
      {hasMoreOptions && (
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={() => setShowAllOptions(!showAllOptions)}
          activeOpacity={0.7}
        >
          <GlobalText style={styles.showMoreText}>
            {showAllOptions ? 'Show less' : 'Show more'}
          </GlobalText>
          <MaterialIcons
            name={showAllOptions ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={16}
            color="#FFD700"
            style={styles.showMoreIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 4,
  },
  optionContainer: {
    marginVertical: 2,
    paddingHorizontal: 4,
  },
  checkbox: {
    marginVertical: 2,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  selectedText: {
    fontWeight: '600',
    color: '#333',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '500',
  },
  showMoreIcon: {
    marginLeft: 4,
  },
});

export default CustomCheckbox2;
