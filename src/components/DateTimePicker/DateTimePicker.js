import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import PropTypes from 'prop-types';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import GlobalText from '@components/GlobalText/GlobalText';
import { default as MaterialIcons } from 'react-native-vector-icons/MaterialIcons';
import globalStyles from '../../utils/Helper/Style';
import moment from 'moment';

const DateTimePicker = ({
  handleValue,
  field,
  formData,
  errors,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
}) => {
  const { t } = useTranslation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDatePickerVisibility(false);

    if (!date) return; // Prevent unnecessary execution
    const selectedDate = moment(date).format('YYYY-MM-DD');
    // Check if the date is actually changing
    if (formData[field.name] !== selectedDate) {
      handleValue(field?.name, selectedDate);
    }

    hideDatePicker(); // Ensure modal closes properly
  };

  // const minDate = new Date(1985, 0, 1); // January 1, 1995
  // const maxDate = new Date(2024, 11, 31); // December 31, 2005

  const today = new Date();

  // validation values
  const minValue = 10;
  const maxValue = 100;

  // minDate = today - minValue years
  const minDate = new Date(today);
  minDate.setFullYear(minDate.getFullYear() - field?.validation?.maxValue);

  // maxDate = minDate + maxValue years
  const maxDate = new Date(today);
  minDate.setFullYear(minDate.getFullYear() - field?.validation?.minValue);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.input,
          { borderColor: errors[field.name] ? 'red' : '#4D4639' },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={[globalStyles.text, { color: '#4D4639' }]}>
            {formData[field.name]
              ? moment(formData[field.name], 'YYYY-MM-DD').format('DD-MM-YYYY')
              : ''}
          </Text>
          <TouchableOpacity onPress={showDatePicker} style={{ right: 20 }}>
            <MaterialIcons name="calendar-month" color={'#000'} size={30} />
          </TouchableOpacity>
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={
          formData[field.name]
            ? moment(formData[field.name], 'YYYY-MM-DD').toDate()
            : new Date()
        } // Set previously selected date or default to today
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={minDate}
        maximumDate={maxDate}
      />

      <View style={styles.overlap}>
        <GlobalText
          style={[
            styles.text,
            { color: errors[field.name] ? 'red' : '#4D4639' },
          ]}
        >
          {t(field.label.toLowerCase())}
          {!field?.isRequired && `(${t('optional')})`}
        </GlobalText>
      </View>
      {errors[field.name] && (
        <GlobalText
          style={{
            color: 'red',
            alignSelf: 'flex-start',
            marginBottom: 10,
            marginTop: -20,
            fontFamily: 'Poppins-Regular',
          }}
        >
          {errors[field.name]}
        </GlobalText>
      )}
    </View>
  );
};

DateTimePicker.propTypes = {
  position: PropTypes.string,
  key: PropTypes.any,
  field: PropTypes.object,
  control: PropTypes.object,
  errors: PropTypes.object,
  secureTextEntry: PropTypes.any,
};

export default DateTimePicker;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'flex-start',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    height: 55,
    borderRadius: 7,
    borderColor: '#DADADA',
    borderWidth: 1.4,
    color: 'black',
    paddingLeft: 20,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    justifyContent: 'center',
  },
  overlap: {
    top: -62,
    left: 13,
    // top: -76,
    // left: -120,
    backgroundColor: 'white',
  },
  text: {
    color: '#4D4639',
    paddingLeft: 2,
    fontFamily: 'Poppins-Regular',
    paddingRight: 2,
  },
});
