import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler, PermissionsAndroid } from 'react-native';
import { getAccessToken } from '../API/AuthService';
import analytics from '@react-native-firebase/analytics';
import RNFS from 'react-native-fs';
import messaging from '@react-native-firebase/messaging';

// Get Saved Data from AsyncStorage

export const getDataFromStorage = async (value) => {
  try {
    const data = await AsyncStorage.getItem(value);
    return data;
  } catch (e) {
    return null;
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
    ur: 'urdu',
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
  try {
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
  } catch (e) {
    console.log('getLastMatchingData ', e);
  }
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
    ?.split(' ') // Split the name by spaces into an array of words
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    ?.join(' '); // Join the words back into a single string
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
  ba: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'], // Bengali
  te: ['౦', '౧', '౨', '౩', '౪', '౫', '౬', '౭', '౮', '౯'], // Telugu
  ka: ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'], // Kannada
  ta: ['௦', '௧', '௨', '௩', '௪', '௫', '௬', '௭', '௮', '௯'], // Tamil
  gu: ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'], // Gujarati
  ur: ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'], // Urdu
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
  ba: [
    'জানু',
    'ফেব',
    'মার',
    'এপ্রি',
    'মে',
    'জুন',
    'জুল',
    'আগ',
    'সেপ',
    'অক্টো',
    'নভে',
    'ডিসে',
  ],
  te: [
    'జన',
    'ఫిబ్ర',
    'మార్చి',
    'ఏప్రి',
    'మే',
    'జూన్',
    'జులై',
    'ఆగ',
    'సెప్',
    'అక్టో',
    'నవం',
    'డిసెం',
  ],
  ka: [
    'ಜನ',
    'ಫೆಬ್ರ',
    'ಮಾರ್ಚ್',
    'ಏಪ್ರಿ',
    'ಮೇ',
    'ಜೂನ್',
    'ಜುಲೈ',
    'ಆಗ',
    'ಸೆಪ್',
    'ಅಕ್ಟೋ',
    'ನವೆಂ',
    'ಡಿಸೆಂ',
  ],
  ta: [
    'ஜன',
    'பெப்',
    'மார்',
    'ஏப்',
    'மே',
    'ஜூன்',
    'ஜூலை',
    'ஆக்',
    'செப்',
    'அக்',
    'நவ',
    'டிச',
  ],
  gu: [
    'જાન્યુ',
    'ફેબ્રુ',
    'માર્ચ',
    'એપ્રિલ',
    'મે',
    'જૂન',
    'જુલાઈ',
    'ઓગસ્ટ',
    'સપ્ટે',
    'ઓક્ટો',
    'નવે',
    'ડિસે',
  ],
  ur: [
    'جنوری',
    'فروری',
    'مارچ',
    'اپریل',
    'مئی',
    'جون',
    'جولائی',
    'اگست',
    'ستمبر',
    'اکتوبر',
    'نومبر',
    'دسمبر',
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
  try {
    return number
      .toString()
      .split('')
      .map((digit) => regionalDigits[lang][parseInt(digit, 10)] || digit)
      .join('');
  } catch (error) {
    return null;
  }
};
export const translateDate = (dateStr, lang) => {
  // Split the date string into components
  try {
    const [day, monthAbbr, year] = dateStr.split(' ');

    // Translate the day
    const translatedDay = translateDigits(day, lang).toString();

    const translatedYear = translateDigits(year, lang).toString();

    // Translate the month
    const monthIndex = monthAbbrToIndex[monthAbbr];

    const translatedMonth = monthNames[lang][monthIndex];
    const translatedDate = `${translatedDay} ${translatedMonth} ${translatedYear}`;
    /*const translatedDate = {
    translatedDay: translatedDay,
    translatedMonth: translatedMonth,
    translatedYear: translatedYear,
  };*/
    // Combine translated components
    return translatedDate;
  } catch (error) {
    return null;
  }
};

export const createNewObject = (customFields, labels, profileView) => {
  const result = {};

  customFields?.forEach((field) => {
    const cleanedFieldLabel = field?.label?.replace(/[^a-zA-Z0-9_ ]/g, '');
    // console.log('cleanedFieldLabel', cleanedFieldLabel);

    labels.map((item) => {
      if (item?.label === cleanedFieldLabel) {
        const selectedValues = field?.selectedValues;

        if (field.type === 'drop_down') {
          if (profileView) {
            result[item.label.toLowerCase()] = {
              label: selectedValues?.[0]?.value || '-',
              value: selectedValues?.[0]?.value || '-',
            };
          } else {
            result[item.name] = {
              label: selectedValues?.[0]?.value || '-',
              value: selectedValues?.[0]?.value || '-',
            };
          }

          if (['STATE', 'DISTRICT', 'BLOCK', 'VILLAGE'].includes(field.label)) {
            if (profileView) {
              result[item.label.toLowerCase()] = {
                label: selectedValues?.[0]?.value || '-',
                value: selectedValues?.[0]?.value || '-',
              };
            } else {
              result[item.name] = {
                label: selectedValues?.[0]?.value || '-',
                value: selectedValues?.[0]?.id || '-',
              };
            }
          }
        } else {
          if (profileView) {
            result[item.label.toLowerCase()] = selectedValues || '';
          } else {
            result[item.name] = selectedValues?.[0] || '';
          }
        }
      }
    });
  });

  return result;
};

export const createNewObjectTarget = (customFields, labels, profileView) => {
  const result = {};

  customFields?.forEach((field) => {
    const cleanedFieldLabel = field?.label?.replace(/[^a-zA-Z0-9_ ]/g, '');

    labels.map((item) => {
      if (item === cleanedFieldLabel) {
        const selectedValues = field?.selectedValues;

        if (field.type === 'drop_down') {
          if (profileView) {
            result[item.toLowerCase()] = {
              label: selectedValues?.[0]?.value || selectedValues?.[0] || '-',
              value: selectedValues?.[0]?.value || selectedValues?.[0] || '-',
            };
          } else {
            result[item] = {
              label: selectedValues?.[0]?.value || selectedValues?.[0] || '-',
              value: selectedValues?.[0]?.value || selectedValues?.[0] || '-',
            };
          }

          if (['STATE', 'DISTRICT', 'BLOCK', 'VILLAGE'].includes(field.label)) {
            if (profileView) {
              result[item.toLowerCase()] = {
                label: selectedValues?.[0]?.value || '-',
                value: selectedValues?.[0]?.value || '-',
              };
            } else {
              result[item] = {
                label: selectedValues?.[0]?.value || '-',
                value: selectedValues?.[0]?.id || '-',
              };
            }
          }
        } else {
          if (profileView) {
            result[item.toLowerCase()] = selectedValues || '';
          } else {
            result[item] = selectedValues || '';
          }
        }
      }
    });
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

// Function to calculate the total size of RNFS Document Directory
async function getDocumentDirectorySize(directoryPath) {
  try {
    const files = await RNFS.readDir(directoryPath); // Get list of files in the directory
    let totalSize = 0;

    // Loop through each file and accumulate its size
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.isDirectory()) {
        // If it's a directory, recursively calculate its size
        totalSize += await getDocumentDirectorySize(file.path);
      } else {
        // If it's a file, add its size
        totalSize += file.size;
      }
    }

    return totalSize;
  } catch (error) {
    console.error('Error calculating Document Directory size:', error);
    return 0;
  }
}

// Function to calculate the size of AsyncStorage for "do_" keys
export const calculateAsyncStorageSize = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();

    // Filter keys that start with "do_"
    const doKeys = keys.filter((key) => key.startsWith('do_'));
    const doItems = await AsyncStorage.multiGet(doKeys);

    // Calculate the total byte size of "do_" items
    let totalBytes = 0;
    doItems.forEach(([key, value]) => {
      totalBytes += key.length + (value ? value.length : 0);
    });

    // Return the total size in bytes
    return totalBytes;
  } catch (error) {
    console.error('Error calculating do_ storage size:', error);
    return 0; // Return 0 if there's an error
  }
};

// Combined function to calculate both AsyncStorage and Document Directory sizes
export const calculateTotalStorageSize = async () => {
  try {
    // Calculate AsyncStorage size in bytes
    const asyncStorageSizeBytes = await calculateAsyncStorageSize();

    // Calculate RNFS Document Directory size in bytes
    const documentDirectorySizeBytes = await getDocumentDirectorySize(
      RNFS.DocumentDirectoryPath
    );

    // Sum both sizes in bytes
    const totalSizeInBytes = asyncStorageSizeBytes + documentDirectorySizeBytes;

    // Convert total size to KB, MB, or GB for display
    const sizeInKB = totalSizeInBytes / 1024;
    const sizeInMB = sizeInKB / 1024;
    const sizeInGB = sizeInMB / 1024;

    // Format the result to show GB, MB, or KB
    let totalSizeFormatted = '';
    if (sizeInGB >= 1) {
      totalSizeFormatted = `${sizeInGB.toFixed(2)} GB`;
    } else if (sizeInMB >= 1) {
      totalSizeFormatted = `${sizeInMB.toFixed(2)} MB`;
    } else {
      totalSizeFormatted = `${sizeInKB.toFixed(2)} KB`;
    }

    return totalSizeFormatted;
  } catch (error) {
    console.error('Error calculating total storage size:', error);
    return 'Error';
  }
};

export const clearDoKeys = async () => {
  try {
    // Retrieve all keys
    const keys = await AsyncStorage.getAllKeys();

    // Filter keys that start with "do_"
    const doKeys = keys.filter((key) => key.startsWith('do_'));

    if (doKeys.length > 0) {
      // Remove all "do_" keys
      await AsyncStorage.multiRemove(doKeys);
      // console.log(`Cleared ${doKeys.length} keys starting with "do_"`);
    } else {
      console.log('No keys starting with "do_" found to clear.');
    }
  } catch (error) {
    console.error('Error clearing do_ keys from storage:', error);
  }
};

export const findObjectByIdentifier = (array, identifier) => {
  return array.find((item) => item.identifier === identifier);
};

export const deleteFilesInDirectory = async () => {
  try {
    const directoryPath = RNFS.DocumentDirectoryPath;

    // Check if the directory exists
    const exists = await RNFS.exists(directoryPath);
    if (exists) {
      // Delete the entire directory and its contents
      await RNFS.unlink(directoryPath);
      console.log('Document directory and its contents have been deleted.');
    }

    // Recreate the directory after deletion
    await RNFS.mkdir(directoryPath);
    console.log('Document directory has been recreated.');

    return true; // Return true to indicate success
  } catch (error) {
    console.error('Error clearing the document directory:', error);
    return false; // Return false in case of an error
  }
};

export const getDeviceId = async () => {
  const token = await messaging().getToken();
  return token;
};

export const getActiveCohortIds = async (cohortData) => {
  return cohortData
    ?.filter((cohort) => cohort?.cohortMemberStatus === 'active')
    ?.map((cohort) => cohort?.cohortId);
};
export const getActiveCohortData = async (cohortData) => {
  return cohortData
    ?.filter((cohort) => cohort?.cohortMemberStatus === 'active')
    ?.map((cohort) => cohort);
};

// utils.js
export const getAssociationsByName = (data, name) => {
  const foundItem = data.find((item) => item.name === name);
  return foundItem ? foundItem.associations : [];
};

export const calculateAge = (dobString) => {
  // Split the date string into year, month, and day (assuming YYYY-MM-DD format)
  const [year, month, day] = dobString.split('-').map(Number);

  // Create a Date object for the DOB
  const dob = new Date(year, month - 1, day);

  // Get the current date
  const today = new Date();

  // Calculate the age
  let age = today.getFullYear() - dob.getFullYear();

  // Adjust if the birthday hasn't occurred this year yet
  const hasBirthdayPassed =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age;
};
