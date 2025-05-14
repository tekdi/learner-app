import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import debounce from 'lodash.debounce';

const CustomSearchBox = ({
  setSearchText,
  searchText,
  // handleSearch,
  placeholder,
}) => {
  const onChangeText = (text) => {
    setSearchText(text);
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchBox}
        placeholder={placeholder}
        placeholderTextColor="black"
        value={searchText}
        onChangeText={onChangeText}
      />
      {/* <TouchableOpacity style={styles.searchButton} onPress={handleSearch}> */}
      <Ionicons
        name="search"
        style={styles.searchButton}
        size={24}
        color="#4D4639"
      />
      {/* </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    // flex: 2
    width: '95%',
    height: 50,
    borderColor: '#ccc',
    // borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    color: 'black',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  searchButton: {
    // height: 40,
    // width: 40,
    backgroundColor: 'transparent',
    // borderWidth: 1,
    borderColor: '#ccc',
    // borderLeftWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 20,
    right: 10,
    position: 'absolute',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    alignSelf: 'center',
    textAlign: 'center',
    borderWidth: 0,
    borderRadius: 20,
    backgroundColor: '#EDEDED',
  },
});

CustomSearchBox.propTypes = {};

export default CustomSearchBox;
