import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler } from 'react-native';

// Get Saved Data from AsyncStorage

export const getDataFromStorage = async (value) => {
  try {
    const data = await AsyncStorage.getItem(value);
    return { data };
  } catch (e) {
    console.error('Error retrieving credentials:', e);
  }
};

// Save Refresh Token

export const setDataInStorage = async (name, data) => {
  try {
    await AsyncStorage.setItem(name, data);
  } catch (e) {
    console.error('Error saving credentials:', e);
  }
};

// Save Token
export const saveToken = async (data) => {
  try {
    await AsyncStorage.setItem('token', data);
  } catch (e) {
    console.error('Error saving credentials:', e);
  }
};
export const saveAccessToken = async (data) => {
  try {
    await AsyncStorage.setItem('Accesstoken', data);
  } catch (e) {
    console.error('Error saving credentials:', e);
  }
};

// Get Saved Token
export const getSavedToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return { token };
  } catch (e) {
    console.error('Error retrieving credentials:', e);
  }
};

// Save Refresh Token

export const saveRefreshToken = async (data) => {
  try {
    await AsyncStorage.setItem('refreshToken', data);
  } catch (e) {
    console.error('Error saving credentials:', e);
  }
};

// Get Refresh Token

export const getRefreshToken = async () => {
  try {
    const token = await AsyncStorage.getItem('refreshToken');
    return { token };
  } catch (e) {
    console.error('Error retrieving credentials:', e);
  }
};

// Delete Saved items from storage

export const deleteSavedItem = async (data) => {
  try {
    await AsyncStorage.removeItem(data);
  } catch (e) {
    console.error('Error retrieving credentials:', e);
  }
};

// Exit the app on back button

export const backAction = () => {
  if (Platform.OS === 'android') {
    BackHandler.exitApp();
    return true; // prevent default behavior
  }
  return false;
};

// Translate Languages as per payload

export const translateLanguage = (code) => {
  const languageMap = {
    en: 'english',
    hi: 'hindi',
    ma: 'marathi',
    ba: 'bengali',
    te: 'telugu',
    ka: 'kannada',
    gu: 'gujarati',
  };

  return languageMap[code] || 'Unknown Language';
};

export const checkAssessmentStatus = async (data, uniqueAssessmentsId) => {
  const contentIdsInData = data?.map((item) => item.contentId);
  const matchedIds = uniqueAssessmentsId.filter((id) =>
    contentIdsInData.includes(id)
  );
  if (matchedIds.length === 0) {
    return 'not_started';
  } else if (matchedIds.length < contentIdsInData.length) {
    return 'inprogress';
  } else {
    return 'completed';
  }
};

export const convertSecondsToMinutes = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}`;
};
