import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler, PermissionsAndroid } from 'react-native';
import { getAccessToken } from '../API/AuthService';
import analytics from '@react-native-firebase/analytics';

// Get Saved Data from AsyncStorage

export const getDataFromStorage = async (value) => {
  try {
    const data = await AsyncStorage.getItem(value);
    return data;
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
export const getuserDetails = async () => {
  try {
    const data = await getAccessToken();
    return data?.result;
  } catch (e) {
    console.error('Error retrieving credentials:', e);
  }
};
export const getTentantId = async () => {
  try {
    const data = JSON.parse(await getDataFromStorage('tenantData'));
    return data?.[0]?.tenantId;
  } catch (e) {
    console.error('Error retrieving credentials:', e);
  }
};
export const getAcademicYearId = async () => {
  try {
    const data = JSON.parse(await getDataFromStorage('academicYearId'));
    return data;
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
    return token;
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
  } else if (matchedIds.length === uniqueAssessmentsId.length) {
    return 'competed';
  } else {
    return 'inprogress';
  }
};

export const getLastMatchingData = async (data, uniqueAssessmentsId) => {
  const result = [];
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
  return `${minutes}`;
};

export const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeName = (name) => {
  return name
    .split(' ') // Split the name by spaces into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    .join(' '); // Join the words back into a single string
};

export const logEventFunction = async ({ eventName, method, screenName }) => {
  const timestamp = new Date().toLocaleString(); // Get the current timestamp

  let userId = await getDataFromStorage('userId');

  analytics().logEvent(eventName, {
    method: method,
    screen_name: screenName,
    userId: userId || '-',
    timestamp: timestamp, // Adding the timestamp as a parameter
  });
};

export const storeUsername = async (username) => {
  try {
    // Fetch existing usernames
    const storedUsernames = await AsyncStorage.getItem('usernames');
    let usernamesArray = storedUsernames ? JSON.parse(storedUsernames) : [];

    // Add new username if it's not already in the list
    if (!usernamesArray.includes(username)) {
      usernamesArray.push(username);
      await AsyncStorage.setItem('usernames', JSON.stringify(usernamesArray));
    }
  } catch (error) {
    console.error('Error storing username:', error);
  }
};

//translate digits in language
const regionalDigits = {
  en: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  hi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'], // Hindi
  ma: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'], // Marathi
};
const monthNames = {
  en: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  hi: [
    'जनवरी',
    'फेब्रुवारी',
    'मार्च',
    'एप्रिल',
    'मे',
    'जून',
    'जुलै',
    'ऑगस्ट',
    'सप्टेंबर',
    'ऑक्टोबर',
    'नोव्हेंबर',
    'डिसेंबर',
  ],
  ma: [
    'जानेवारी',
    'फेब्रुवारी',
    'मार्च',
    'एप्रिल',
    'मे',
    'जून',
    'जुलै',
    'ऑगस्ट',
    'सप्टेंबर',
    'ऑक्टोबर',
    'नोव्हेंबर',
    'डिसेंबर',
  ],
};
// Create a mapping for month abbreviations to indices
const monthAbbrToIndex = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};
export const translateDigits = (number, lang) => {
  return number
    .toString()
    .split('')
    .map((digit) => regionalDigits[lang][parseInt(digit, 10)] || digit)
    .join('');
};
export const translateDate = (dateStr, lang) => {
  // Split the date string into components
  const [day, monthAbbr, year] = dateStr.split(' ');
  console.log('###### dateStr', dateStr);
  console.log('###### day', day);
  console.log('###### monthAbbr', monthAbbr);
  console.log('###### year', year);
  // Translate the day
  const translatedDay = translateDigits(day, lang).toString();

  const translatedYear = translateDigits(year, lang).toString();

  console.log('###### translatedDay', translatedDay);
  console.log('###### translatedYear', translatedYear);
  // Translate the month
  const monthIndex = monthAbbrToIndex[monthAbbr];

  console.log('###### monthIndex', monthIndex);
  const translatedMonth = monthNames[lang][monthIndex];
  const translatedDate = `${translatedDay} ${translatedMonth} ${translatedYear}`;
  /*const translatedDate = {
    translatedDay: translatedDay,
    translatedMonth: translatedMonth,
    translatedYear: translatedYear,
  };*/
  console.log('###### translatedDate', JSON.stringify(translatedDate));
  // Combine translated components
  return translatedDate;
};

export const createNewObject = (customFields, labels) => {
  const result = {};
  customFields?.forEach((field) => {
    const cleanedFieldLabel = field?.label?.replace(/[^a-zA-Z0-9_ ]/g, '');

    if (labels.includes(cleanedFieldLabel)) {
      result[cleanedFieldLabel] = field.value || '';
    }
  });

  return result;
};

export const categorizeEvents = async (events) => {
  const plannedSessions = [];
  const extraSessions = [];

  events?.forEach((event) => {
    if (event.isRecurring) {
      plannedSessions.push(event);
    } else {
      extraSessions.push(event);
    }
  });

  return { plannedSessions, extraSessions };
};

export const formatDateTimeRange = (startDateTime) => {
  // Parse the input date string
  const date = new Date(startDateTime);

  // Format date to "25 Oct"
  const options = { day: 'numeric', month: 'short' };
  const formattedDate = date.toLocaleDateString('en-US', options);

  // Format start time in 12-hour format
  const startTimeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
  const formattedStartTime = date.toLocaleTimeString('en-US', startTimeOptions);

  // Combine everything into the final output string
  return ` ${formattedStartTime} `;
};

export const getOptionsByCategory = (frameworks, categoryCode) => {
  // Find the category by code
  console.log({ frameworks });

  const category = frameworks.categories.find(
    (category) => category.code === categoryCode
  );

  // Return the mapped terms
  return category
    ? category.terms.map((term) => ({
        name: term.name,
        code: term.code,
        associations: term.associations,
      }))
    : [];
};
