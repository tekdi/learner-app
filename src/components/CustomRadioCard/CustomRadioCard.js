import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Radio, RadioGroup } from '@ui-kitten/components';
import { useTranslation } from '../../context/LanguageContext';
import { useController } from 'react-hook-form';
import program from '../../assets/images/png/program.png';
import globalStyles from '../../utils/Helper/Style';

const CustomRadioCard = ({
  field,
  name,
  errors,
  setSelectedIds,
  selectedIds,
  control,
}) => {
  const { t } = useTranslation();

  const {
    field: { onChange, value },
  } = useController({ name, control });

  const [selectedIndex, setSelectedIndex] = useState();

  useEffect(() => {
    if (value) {
      const selectedOptionIndex = field.options.findIndex(
        (option) => option.tenantId === value.tenantId
      );
      if (selectedOptionIndex >= 0) {
        setSelectedIndex(selectedOptionIndex);
      }
    }
  }, [value, field]);

  const handlePress = (index) => {
    const selectedValue = field?.options[index]?.tenantId || 'none';
    setSelectedIndex(selectedValue);
    setSelectedIds((prevSelectedIds) => ({
      ...prevSelectedIds,
      [name]: { value: selectedValue, fieldId: field?.fieldId },
    }));
    onChange(selectedValue);
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
                  checked={selectedIds?.[name]?.value === option?.tenantId}
                  style={styles.radio}
                  onChange={() => handlePress(index)}
                >
                  <Text allowFontScaling={false} style={styles.title}>
                    {option.name}
                  </Text>
                </Radio>
              </View>
              <Image style={styles.img} source={program} resizeMode="contain" />
              <Text allowFontScaling={false} style={globalStyles.subHeading}>
                {option.description}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(field?.options?.length + 1)}
          >
            <View style={styles.radioContainer}>
              <Radio
                checked={selectedIds[name]?.value === 'none'}
                style={styles.radio}
                onChange={() => handlePress(field?.options?.length + 1)}
              >
                <Text allowFontScaling={false} style={styles.title}>
                  {t('optional_content')}
                </Text>
              </Radio>
            </View>
            <Text
              allowFontScaling={false}
              style={[
                globalStyles.subHeading,
                {
                  padding: 10,
                  borderWidth: 1,
                  color: 'white',
                  backgroundColor: '#1C5533',
                  borderRadius: 20,
                },
              ]}
            >
              {t('optional_content_des')}
            </Text>
          </TouchableOpacity>
        </View>
        {errors[name] && (
          <Text allowFontScaling={false} style={styles.error}>
            {errors[name]?.message}
          </Text>
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
    width: '98%',
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
  img: {
    width: '98%',
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
