import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useEffect } from 'react';
import { useController } from 'react-hook-form';

const CustomCards = ({
  field,
  name,
  errors,
  setSelectedIds,
  selectedIds,
  control,
}) => {
  const {
    field: { onChange, value },
  } = useController({ name, control });

  const handlePress = (name, id) => {
    setSelectedIds((prevSelectedIds) => ({
      ...prevSelectedIds,
      [name]: id,
    }));
    onChange(id);
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
    <View style={styles.container} key={field.name}>
      <ScrollView>
        <View style={styles.cardContainer}>
          {field.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handlePress(name, option.id)}
              style={[
                styles.card,
                selectedIds[name] === option.id && styles.selectedCard,
              ]}
            >
              <Text
                style={[
                  {
                    color: 'black',
                    fontSize: 20,
                    fontFamily: 'Poppins-Regular',
                  },
                  selectedIds[name] === option.id && {
                    fontFamily: 'Poppins-Medium',
                  },
                ]}
              >
                {option.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    height: '80%',
  },
  cardContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    margin: 10,
    padding: 7,
    borderRadius: 10,
    height: 60,
    width: '100%',
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
