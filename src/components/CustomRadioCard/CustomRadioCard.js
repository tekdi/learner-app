import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Radio, RadioGroup } from '@ui-kitten/components';
import { useTranslation } from '../../context/LanguageContext';

import GlobalText from '@components/GlobalText/GlobalText';
import { ImageCarousel } from '@src/screens/LanguageScreen/ImageCarousel';

const CustomRadioCard = ({ field, formData, options, handleValue, errors }) => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState();

  const handlePress = (index) => {
    const selectedValue = options[index]?.tenantId || 'none';
    const selectedName = options[index]?.name;
    const role = options[index]?.role?.find(
      (item) => item?.name == 'Learner' || item?.name === 'Student'
    );
    handleValue(field.name, { value: selectedValue, roleId: role?.roleId });
    setSelectedIndex(selectedValue);
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
          {options?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                {
                  backgroundColor:
                    formData?.[field.name]?.value === option?.tenantId
                      ? '#FFEFD5'
                      : 'white',
                },
              ]}
              onPress={() => handlePress(index)}
            >
              <View style={styles.radioContainer}>
                <Radio
                  checked={formData?.[field.name]?.value === option?.tenantId}
                  style={styles.radio}
                  onChange={() => handlePress(index)}
                >
                  <GlobalText style={styles.title}>{option.name}</GlobalText>
                </Radio>
              </View>
              <View style={styles.carocontainer}>
                <ImageCarousel images={option?.programImages || []} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {errors[field.name] && (
          <GlobalText style={styles.error}>{errors[field.name]}</GlobalText>
        )}
      </ScrollView>
    </RadioGroup>
  );
};

const { width } = Dimensions.get('window');

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
    // marginBottom: 10,
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
    // width: '100%',
    height: '100%',
  },
  itemContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  carocontainer: {
    flex: 1,
    marginTop: 10,
    backgroundColor: 'white',
    // height: 200,
    // borderWidth: 5,
  },
});

CustomRadioCard.propTypes = {
  field: PropTypes.object.isRequired,
  errors: PropTypes.object,
};

export default CustomRadioCard;
