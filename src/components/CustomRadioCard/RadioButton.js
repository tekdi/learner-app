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
import { Radio, RadioGroup, useTheme } from '@ui-kitten/components';
import { useTranslation } from '../../context/LanguageContext';
import { useController } from 'react-hook-form';
import program from '../../assets/images/png/program.png';
import globalStyles from '../../utils/Helper/Style';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

import GlobalText from '@components/GlobalText/GlobalText';
import { ImageCarousel } from '@src/screens/LanguageScreen/ImageCarousel';

const RadioButton = ({ field, formData, handleValue, errors }) => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState();

  const handlePress = (index) => {
    const selectedValue = field?.options[index]?.value || 'none';
    handleValue(field.name, selectedValue);
    setSelectedIndex(selectedValue);
  };
  console.log('selectedValue', formData?.[field.name]?.value);

  return (
    <>
      <GlobalText style={[globalStyles.text, { fontSize: 18 }]}>
        {' '}
        {t(field.label.toLowerCase())}
        {!field?.isRequired && `(${t('optional')})`}
      </GlobalText>

      <RadioGroup selectedIndex={selectedIndex} onChange={handlePress}>
        <ScrollView>
          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
              width: '100%',
            }}
          >
            {field?.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  {
                    backgroundColor: '#FFEFD5',
                  },
                ]}
                onPress={() => handlePress(index)}
              >
                <View style={styles.radioContainer}>
                  <Radio
                    checked={
                      formData?.[field.name]?.value === undefined
                        ? formData?.[field.name] === option?.value
                        : formData?.[field.name].value === option?.value
                    }
                    style={styles.radio}
                    onChange={() => handlePress(index)}
                  >
                    <GlobalText style={styles.title}>
                      {t(option?.label.toLowerCase())}
                    </GlobalText>
                  </Radio>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {errors[field.name] && (
            <GlobalText style={styles.error}>{errors[field.name]}</GlobalText>
          )}
        </ScrollView>
      </RadioGroup>
    </>
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
    width: '44%',
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
    // marginTop: 20,
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
    // flex: 1,
    marginTop: 10,
    backgroundColor: 'white',
    // height: 200,
    // borderWidth: 5,
  },
});

RadioButton.propTypes = {
  field: PropTypes.object.isRequired,
  errors: PropTypes.object,
};

export default RadioButton;
