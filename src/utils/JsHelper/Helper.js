import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler } from 'react-native';
import { getAccessToken } from '../API/AuthService';

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

// Get UserId From Storage
export const getUserId = async () => {
  try {
    const data = await getAccessToken();
    return data?.result?.userId;
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
  // console.log({ data, uniqueAssessmentsId });
  const contentIdsInData = data?.map((item) => item.contentId);
  const matchedIds = uniqueAssessmentsId.filter((id) =>
    contentIdsInData.includes(id)
  );
  // console.log({ contentIdsInData, matchedIds });
  if (matchedIds.length === 0) {
    return 'not_started';
  } else if (matchedIds.length === uniqueAssessmentsId.length) {
    return 'competed';
  } else {
    return 'inprogress';
  }
};

export const getLastMatchingData = async (data, uniqueAssessmentsId) => {
  const result = [];
  // console.log(data?.[0]?.assessments);
  uniqueAssessmentsId.forEach((id) => {
    // Filter the data array to find all objects with the matching uniqueAssessmentsId
    const matchingData = data?.[0]?.assessments.filter(
      (item) => item.contentId === id
    );

    // If matching data exists, get the last item in the array
    if (matchingData.length > 0) {
      result.push(matchingData[matchingData.length - 1]);
    }
  });

  return result;
};

export const convertSecondsToMinutes = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}`;
};
