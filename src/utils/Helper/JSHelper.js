import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NativeModules } from 'react-native';
// const { FileProvider } = NativeModules;

// Function to store JSON object
export const storeData = async (key, value, type) => {
  try {
    let storeValue = value;
    if (type == 'json') {
      storeValue = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, storeValue);
    return true;
  } catch (e) {
    console.error('Error storing JSON object', e);
    return false;
  }
};

export const getData = async (key, type) => {
  try {
    let storeValue = await AsyncStorage.getItem(key);
    if (type == 'json') {
      storeValue = JSON.parse(storeValue);
    }
    return storeValue;
  } catch (e) {
    console.error('Error getting stored JSON object', e);
    return null;
  }
};
