import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

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

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error deleting stored JSON object', e);
    return null;
  }
};

export const loadFileAsBlob = async (filePath, mimetype) => {
  try {
    console.log('in loadFileAsBlob');
    // Read the file content
    const fileBase64 = await RNFS.readFile(filePath, 'base64');
    //console.log('fileBase64', fileBase64);
    //pdf player
    if (mimetype == 'application/pdf') {
      return `data:application/pdf;base64,${fileBase64}`;
    }
    //video player
    else if (mimetype == 'video/mp4') {
      return `data:video/mp4;base64,${fileBase64}`;
    } else if (mimetype == 'video/webm') {
      return `data:video/webm;base64,${fileBase64}`;
    }
    //epub
    else if (mimetype == 'application/epub') {
      return `data:application/epub;base64,${fileBase64}`;
    }
    return fileBase64;
  } catch (error) {
    console.error('Error loading file as Blob:', error);
    return null;
  }
};

export function convertDates(dates) {
  return dates.map((date) => {
    let formattedDate = new Date(date);
    let year = formattedDate.getFullYear();
    let month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    let day = formattedDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
}

export const convertDate = (dateStr) => {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};
