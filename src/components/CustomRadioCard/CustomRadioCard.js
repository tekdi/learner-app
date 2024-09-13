import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Radio, RadioGroup } from '@ui-kitten/components';
import { useTranslation } from '../../context/LanguageContext';
import { useController } from 'react-hook-form';

const CustomRadioCard = ({
  field,
  name,
  errors,
  setSelectedIds,
  selectedIds,
  control,
}) => {
  const { t } = useTranslation();

  console.log('field', field);

  const {
    field: { onChange, value },
  } = useController({ name, control });

  const [selectedIndex, setSelectedIndex] = useState();

  useEffect(() => {
    if (value) {
      const selectedOptionIndex = field.options.findIndex(
        (option) => option.value === value.value
      );
      if (selectedOptionIndex >= 0) {
        setSelectedIndex(selectedOptionIndex);
      }
    }
  }, [value, field]);

  const handlePress = (index) => {
    const selectedValue = field.options[index].value;
    setSelectedIndex(index);
    setSelectedIds((prevSelectedIds) => ({
      ...prevSelectedIds,
      [name]: { value: selectedValue, fieldId: field?.fieldId },
    }));
    onChange({ value: selectedValue, fieldId: field?.fieldId || null });
  };

  return (
    <RadioGroup selectedIndex={selectedIndex} onChange={handlePress}>
      <ScrollView>
        <View
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {field?.options?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => handlePress(index)}
            >
              <View style={styles.radioContainer}>
                <Radio
                  checked={selectedIndex === index}
                  style={styles.radio}
                  onChange={() => handlePress(index)}
                >
                  <Text style={styles.title}>{option.label}</Text>
                </Radio>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {errors[name] && (
          <Text style={styles.error}>{errors[name]?.message}</Text>
        )}
      </ScrollView>
    </RadioGroup>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 3,
    width: '40%',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radio: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
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

CustomRadioCard.propTypes = {
  field: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  errors: PropTypes.object,
  setSelectedIds: PropTypes.func.isRequired,
  selectedIds: PropTypes.object.isRequired,
  control: PropTypes.object.isRequired,
};

export default CustomRadioCard;
