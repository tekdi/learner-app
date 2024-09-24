import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from '../../context/LanguageContext';

const CustomCards = ({
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

  useEffect(() => {
    if (value) {
      onChange({ value: value?.value, fieldId: field?.fieldId });
    }
  }, [field]);

  const handlePress = (name, id) => {
    setSelectedIds((prevSelectedIds) => ({
      ...prevSelectedIds,
      [name]: id,
    }));
    onChange({ value: id, fieldId: field?.fieldId || null });
  };
  useEffect(() => {
    if (value) {
      setSelectedIds((prevSelectedIds) => ({
        ...prevSelectedIds,
        [name]: { value: value?.value, fieldId: field?.fieldId },
      }));
    }
  }, [value]);
  return (
    <View style={styles.container} key={field.name}>
      <ScrollView>
        <View style={styles.cardContainer}>
          {field.name === 'gender' && (
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontFamily: 'Poppins-Regular',
                width: '100%',
                marginBottom: 20,
                marginLeft: 20,
              }}
            >
              {t('gender')}
            </Text>
          )}
          {field.options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handlePress(name, option.value)}
              style={[
                styles.card,
                selectedIds[name]?.value === option.value &&
                  styles.selectedCard,
              ]}
            >
              <Text
                style={[
                  {
                    color: 'black',
                    fontSize: 20,
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center',
                  },
                  selectedIds[name]?.value === option.value && {
                    fontFamily: 'Poppins-Medium',
                  },
                ]}
              >
                {t(option.label)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors[name] && (
          <Text style={styles.error}>{errors[name].message}</Text>
        )}
      </ScrollView>
    </View>
  );
};

CustomCards.propTypes = {
  field: PropTypes.any,
  name: PropTypes.any,
  errors: PropTypes.any,
  setSelectedIds: PropTypes.any,
  selectedIds: PropTypes.any,
  control: PropTypes.any,
};

const styles = StyleSheet.create({
  cardContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    margin: 10,
    padding: 7,
    borderRadius: 10,
    height: 60,
    width: 150,
    borderWidth: 1,
    borderColor: '#D0C5B4',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  selectedCard: {
    backgroundColor: '#FEEDA1',
  },
  error: {
    textAlign: 'left',
    color: 'red',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
  },
});

export default CustomCards;
