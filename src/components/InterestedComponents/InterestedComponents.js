import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';

const InterestedCardsComponent = ({
  field,
  control,
  name,
  errors,
  setSelectedIds,
  selectedIds,
}) => {
  const {
    field: { onChange, value },
  } = useController({ name, control });

  const { t } = useTranslation();

  const handlePress = (name, id) => {
    const newSelectedIds = { ...selectedIds };
    if (newSelectedIds[name]?.value?.includes(id)) {
      newSelectedIds[name] = {
        ...newSelectedIds[name],
        value: newSelectedIds[name].value.filter((item) => item !== id),
      };
    } else {
      if (!newSelectedIds[name]) {
        newSelectedIds[name] = { value: [] };
      }
      newSelectedIds[name] = {
        ...newSelectedIds[name],
        value: [...newSelectedIds[name].value, id],
      };
    }

    setSelectedIds(newSelectedIds);
    onChange({
      value: newSelectedIds[name].value,
      fieldId: field?.fieldId || null,
    });
  };

  useEffect(() => {
    if (value) {
      setSelectedIds((prevSelectedIds) => ({
        ...prevSelectedIds,
        [name]: value,
      }));
    }
  }, [value]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.cardContainer}>
          {field?.options?.map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => {
                handlePress(name, item.value);
              }}
              style={styles.touchable}
            >
              <View
                style={[
                  styles.card,
                  selectedIds[name]?.value?.includes(item.value) &&
                    styles.selectedCard,
                ]}
              >
                <Text style={styles.cardText}>{t(item.label)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {errors[name] && (
          <Text style={styles.error}>
            {errors[name]?.value?.message || errors[name]?.message}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

InterestedCardsComponent.propTypes = {
  field: PropTypes.object,
  control: PropTypes.object,
  errors: PropTypes.object,
  name: PropTypes.string,
  setSelectedIds: PropTypes.func,
  selectedIds: PropTypes.any,
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  error: {
    color: 'red',
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    padding: 10,
  },
  cardContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 10,
  },
  touchable: {
    marginTop: 3,
  },
  card: {
    backgroundColor: 'white',
    margin: 5,
    padding: 7,
    borderRadius: 10,
    height: 40,
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  selectedCard: {
    backgroundColor: '#FEEDA1',
  },
  cardText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});

export default InterestedCardsComponent;
