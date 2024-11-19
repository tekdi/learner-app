import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from '../../context/LanguageContext';
import female from '../../assets/images/png/female.png';
import male from '../../assets/images/png/male.png';
import transgender from '../../assets/images/png/transgender.png';

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
              allowFontScaling={false}
              style={{
                color: 'black',
                fontSize: 18,
                fontFamily: 'Poppins-Regular',
                width: '100%',
                marginBottom: 20,
                marginLeft: 20,
              }}
            >
              {t('gender')}
            </Text>
          )}
          <View style={styles.cardWrapper}>
            {field.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handlePress(name, option.value)}
                style={[
                  styles.card,
                  selectedIds[name]?.value === option.value &&
                    styles.selectedCard,
                ]}
              >
                {option.label !== 'OTHER' && (
                  <Image
                    source={
                      option.label == 'FEMALE'
                        ? female
                        : option.label == 'MALE'
                          ? male
                          : option.label == 'TRANSGENDER' && transgender
                    }
                  />
                )}
                <Text
                  allowFontScaling={false}
                  style={[
                    {
                      color: 'black',
                      fontSize: 15,
                      fontFamily: 'Poppins-Regular',
                      textAlign: 'center',
                      width: '70%',
                      marginLeft: 2,
                    },
                    selectedIds[name]?.value === option.value && {
                      fontFamily: 'Poppins-Medium',
                    },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t(option.label.toLowerCase())}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {errors[name] && (
          <Text allowFontScaling={false} style={styles.error}>
            {errors[name].message}
          </Text>
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
    // borderWidth: 1,
  },
  card: {
    backgroundColor: 'white',
    margin: 10,
    // padding: 7,
    borderRadius: 10,
    height: 60,
    width: '43%',
    borderWidth: 1,
    borderColor: '#D0C5B4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    // borderWidth: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
