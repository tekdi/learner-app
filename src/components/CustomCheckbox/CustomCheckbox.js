import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomCheckbox = ({ value, onChange, label }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onChange(!value)}>
      <View style={styles.checkbox}>
        {value && <Icon name="check-square" size={25} color="#000" />}
        {!value && <Icon name="square-o" size={27} color="#000" />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
});

CustomCheckbox.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  label: PropTypes.string,
};

export default CustomCheckbox;
