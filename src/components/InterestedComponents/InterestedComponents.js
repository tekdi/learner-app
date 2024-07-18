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
    if (newSelectedIds[name] && newSelectedIds[name].includes(id)) {
      newSelectedIds[name] = newSelectedIds[name].filter((item) => item !== id);
    } else {
      if (!newSelectedIds[name]) {
        newSelectedIds[name] = [];
      }
      newSelectedIds[name].push(id);
    }

    setSelectedIds(newSelectedIds);
    onChange(newSelectedIds[name]); // Trigger validation
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
      {/* <Text style={styles.title}>{field.label}</Text> */}
      <ScrollView>
        <View style={styles.cardContainer}>
          {field.options.map((item) => (
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
                  selectedIds[name] &&
                    selectedIds[name].includes(item.value) &&
                    styles.selectedCard,
                ]}
              >
                <Text style={styles.cardText}>{t(item.label)}</Text>
              </View>
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
  title: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    paddingLeft: 10,
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
