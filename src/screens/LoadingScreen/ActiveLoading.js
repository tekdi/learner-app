import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, View } from 'react-native';

const ActiveLoading = (props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

ActiveLoading.propTypes = {};

export default ActiveLoading;
