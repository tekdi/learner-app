import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import debounce from 'lodash.debounce';

import GlobalText from '@components/GlobalText/GlobalText';

const ContinueLearning = ({ youthnet, t, userId }) => {
  useEffect(() => {
    const fetch = async () => {
      userId;
    };
    fetch();
  }, []);

  const debouncedSearch = useCallback(
    debounce(() => {}, 2000), // Adjust debounce time in milliseconds as needed
    []
  );

  const onChangeText = (text) => {
    setSearchText(text);

    if (text == '') {
      handleSearch();
    }
  };

  return (
    <View style={styles.searchContainer}>
      <GlobalText style={styles.text}>
        {youthnet ? t('l1_courses') : t('courses')}
      </GlobalText>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    alignSelf: 'center',
    textAlign: 'center',
    // borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#EDEDED',
  },
});

ContinueLearning.propTypes = {};

export default ContinueLearning;
