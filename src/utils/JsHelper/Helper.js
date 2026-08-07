import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackHandler, PermissionsAndroid } from 'react-native';
import { getAccessToken, getStudentForm } from '../API/AuthService';
import analytics from '@react-native-firebase/analytics';
import RNFS from 'react-native-fs';
import messaging from '@react-native-firebase/messaging';
import { getCurrentRouteParams } from '../NavigationService';
import { readContent } from '../API/ApiCalls';

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
  console.log('########## setDataInStorage', name, data);
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

export const capitalizeNameWithSpace = (name) => {
  try {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  } catch (e) {
    console.log('share ', e);
    return '';
  }
};

export const logEventFunction = async ({ eventName, method, screenName, content_do_id: passedContentId, course_id: passedCourseId }) => {
  const timestamp = new Date().toLocaleString();

  const routeParams = getCurrentRouteParams();
  const { content_do_id: routeContentId, content_list_node, unit_id, course_id: routeCourseId } = routeParams;

  const content_do_id = passedContentId || routeContentId;
  const course_id = passedCourseId || routeCourseId;

  console.log('eventName=====>', eventName);

  let userId = await getDataFromStorage('userId');
  const tenantData = JSON.parse(await getDataFromStorage('tenantData')) || {};
  const storedProgram = tenantData?.[0]?.tenantName;

  console.log('######## [Analytics] IDs → content_do_id:', content_do_id, '| course_id:', course_id);

  const [contentResponse, courseResponse] = await Promise.all([
    content_do_id ? readContent(content_do_id) : Promise.resolve(null),
    course_id ? readContent(course_id) : Promise.resolve(null),
  ]);

  console.log('######## [Analytics] raw contentResponse:', JSON.stringify(contentResponse));
  console.log('######## [Analytics] raw courseResponse:', JSON.stringify(courseResponse));

  const contentData = contentResponse?.result?.content || null;
  const courseData = courseResponse?.result?.content || null;

  const content_name = contentData?.name || null;
  const course_name = courseData?.name || null;
  const content_language = contentData?.language?.[0] || courseData?.language?.[0] || null;
  const content_mimetype = contentData?.mimeType || courseData?.mimeType || null;
  const origin = 'Learner Android App';

  const eventParams = {
    method: method,
    screen_name: screenName,
    userId: userId || '-',
    program: storedProgram || '-',
    timestamp: timestamp,
    ...(content_list_node && { content_list_node: content_list_node }),
    ...(content_do_id && { content_do_id: content_do_id }),
    ...(course_id && { course_id: course_id }),
    ...(unit_id && { unit_id: unit_id }),
    ...(content_name && { content_name: content_name }),
    ...(course_name && { course_name: course_name }),
    ...(content_language && { content_language: content_language }),
    ...(content_mimetype && { content_type: content_mimetype }),
    origin: origin,
  };

  console.log('######## [Analytics] firing event:', eventName);
  console.log('######## [Analytics] params:', JSON.stringify(eventParams, null, 2));

  try {
    await analytics().logEvent(eventName, eventParams);
    console.log('######## [Analytics] event fired successfully:', eventName);
  } catch (e) {
    console.log('######## [Analytics] event failed:', eventName, e);
  }
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

export const getStoredUsername = async () => {
  try {
    // Fetch stored usernames
    const storedUsernames = await AsyncStorage.getItem('usernames');
    if (storedUsernames) {
      const usernamesArray = JSON.parse(storedUsernames);
      // Return the most recent username (last item in array)
      if (usernamesArray && usernamesArray.length > 0) {
        return usernamesArray[usernamesArray.length - 1];
      }
    }
    return null;
  } catch (error) {
    console.error('Error retrieving username:', error);
    return null;
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

// Fetches the two Form Read responses that make up a learner's profile:
// the base ("common") form collected at registration, and the current program's
// own form. Both are cached to storage because TransformPayload reads them back
// when building the update payload.
export const getProfileFormSchemas = async (tenantId) => {
  const base = await getStudentForm();
  const program = await getStudentForm(tenantId);
  const commonFields = base?.fields || [];
  const programFields = program?.fields || [];

  await setDataInStorage('studentForm', JSON.stringify(commonFields));
  await setDataInStorage('studentProgramForm', JSON.stringify(programFields));

  return { commonFields, programFields };
};

// Everything a learner can edit: common form + current program's form. Used by
// the full Edit Profile screen, and by the Complete Profile mini-form when it
// needs to render a field (e.g. a family member's name) that is not itself part
// of the completion scope below.
export const getMergedProfileSchema = async (tenantId) => {
  const { commonFields, programFields } = await getProfileFormSchemas(tenantId);

  return [...commonFields, ...programFields].filter(
    (field) => field.name !== 'center' && field.name !== 'batch'
  );
};

// The fields that determine whether a profile counts as "complete" for the
// current program - deliberately narrower than getMergedProfileSchema.
//
// Scope is the PROGRAM form only, matching the web client: common-form fields
// (name, dob, gender, state/district/block/village, preferred language) are
// collected during registration, so they must never hold this banner open.
// Both required and optional program fields count - Camp to Club's two fields
// are optional and web still asks for them.
//
// `center`/`batch` are dropped here (admin-assigned, not user-supplied); the
// remaining exclusions - unsupported types like `consent_file`, and the
// name-based list in PROFILE_COMPLETENESS_OPTIONAL_FIELDS - are applied by
// getMissingProfileFields.
export const getProfileCompletionSchema = async (tenantId) => {
  const { programFields } = await getProfileFormSchemas(tenantId);

  return programFields.filter(
    (field) => field.name !== 'center' && field.name !== 'batch'
  );
};

// Builds the same flattened { fieldName: value } object ProfileUpdateForm builds
// from cached profileData + the merged schema's labels, for reuse by anything that
// needs to inspect the user's saved values (e.g. the profile-completeness check).
export const buildUserDetailsObject = (profileData, schema) => {
  const finalResult = profileData?.getUserDetails?.[0];
  if (!finalResult) {
    return {};
  }

  const keysToRemove = [
    'customFields',
    'total_count',
    'status',
    'updatedAt',
    'createdAt',
    'updatedBy',
    'createdBy',
    'username',
  ];
  const filteredResult = Object.keys(finalResult)
    .filter((key) => !keysToRemove.includes(key))
    .reduce((obj, key) => {
      obj[key] = finalResult[key];
      return obj;
    }, {});

  const requiredLabels = schema?.map((item) => ({
    label: item?.label,
    name: item?.name,
  }));
  const userDetails = createNewObject(finalResult?.customFields, requiredLabels);

  return { ...userDetails, ...filteredResult };
};

const extractProfileFieldValue = (fieldValue) => {
  if (fieldValue === null || fieldValue === undefined) {
    return '';
  }
  if (Array.isArray(fieldValue)) {
    return fieldValue.length > 0
      ? String(fieldValue[0]?.value ?? fieldValue[0] ?? '').trim()
      : '';
  }
  if (typeof fieldValue === 'object') {
    return fieldValue.value !== undefined ? String(fieldValue.value).trim() : '';
  }
  return String(fieldValue).trim();
};

// Field types the profile forms know how to render (see renderProfileField in
// screens/Profile/ProfileFormShared.js). A field of any other type cannot be
// filled in through the app, so it must never be counted as "missing" - doing so
// would show a Complete Profile banner that opens a form with nothing in it.
export const PROFILE_SUPPORTED_FIELD_TYPES = [
  'text',
  'email',
  'numeric',
  'radio',
  'select',
  'drop_down',
  'password',
  'confirm_password',
  'date',
];

// Rendered, but read-only - set at registration or derived elsewhere. The user
// cannot change these here, so they must never be counted as "missing" either.
export const PROFILE_NON_EDITABLE_FIELDS = [
  'first_name',
  'firstName',
  'last_name',
  'lastName',
  'state',
  'district',
  'block',
  'village',
];

// Never rendered at all - internal/system fields.
export const PROFILE_ALWAYS_HIDDEN_FIELDS = [
  'username',
  'password',
  'confirm_password',
  'is_volunteer',
];

// Fully editable in the forms, but genuinely optional - a user may legitimately
// have no value for these, so leaving them blank must not keep the Complete
// Profile banner up forever.
export const PROFILE_COMPLETENESS_OPTIONAL_FIELDS = [
  'middle_name',
  'middleName',
];

const ALWAYS_EXCLUDED_PROFILE_FIELDS = [
  ...PROFILE_ALWAYS_HIDDEN_FIELDS,
  ...PROFILE_NON_EDITABLE_FIELDS,
  ...PROFILE_COMPLETENESS_OPTIONAL_FIELDS,
  'center',
  'batch',
  'program',
];

// Whether `field` should be rendered at all given the rest of the form's current
// values. Single source of truth shared by the Edit Profile form, the Complete
// Profile mini-form, and the banner's completeness check, so the three can't
// drift apart. Note "visible" != "editable": first_name/state/etc. are visible
// but read-only (see PROFILE_NON_EDITABLE_FIELDS).
export const isProfileFieldVisible = (field, formData) => {
  if (PROFILE_ALWAYS_HIDDEN_FIELDS.includes(field?.name)) {
    return false;
  }

  const dob = formData?.dob || '';
  let age = null;
  if (dob) {
    try {
      const parsed = calculateAge(dob);
      age =
        parsed !== null && parsed !== undefined && !isNaN(parsed)
          ? parseInt(parsed, 10)
          : null;
    } catch {
      age = null;
    }
  }

  if (
    ['guardian_relation', 'guardian_name', 'parent_phone'].includes(field?.name) &&
    age !== null &&
    age >= 18
  ) {
    return false;
  }
  if (
    ['mobile', 'phone_num', 'phone_number'].includes(field?.name) &&
    age !== null &&
    age < 18
  ) {
    return false;
  }

  const rawFamilyType = formData?.family_member_details;
  const familyType =
    rawFamilyType && typeof rawFamilyType === 'object'
      ? rawFamilyType.value
      : rawFamilyType;
  if (['father_name', 'mother_name', 'spouse_name'].includes(field?.name)) {
    if (!familyType) {
      return false;
    }
    return field.name === `${familyType}_name`;
  }

  const rawPhoneType = formData?.phone_type_accessible;
  const phoneType =
    rawPhoneType && typeof rawPhoneType === 'object'
      ? rawPhoneType.value
      : rawPhoneType;
  if (field?.name === 'own_phone_check' && phoneType === 'nophone') {
    return false;
  }

  return true;
};

// Given the merged schema (§getMergedProfileSchema) and the user's saved profile
// data (§buildUserDetailsObject), returns which schema fields have no value yet.
//
// A field only counts as "missing" if the user can actually fill it in through
// the Complete Profile form: it must render (supported type + currently visible)
// and be editable. Anything else would produce a banner the user can never clear,
// because the form it opens would have no usable input for that field.
export const getMissingProfileFields = (schema, userDetails) => {
  const missingFields = (schema || [])
    .filter((field) => field?.name)
    .filter((field) => !ALWAYS_EXCLUDED_PROFILE_FIELDS.includes(field.name))
    .filter((field) => PROFILE_SUPPORTED_FIELD_TYPES.includes(field.type))
    .filter((field) => isProfileFieldVisible(field, userDetails))
    .filter((field) => !extractProfileFieldValue(userDetails?.[field.name]))
    .map((field) => field.name);

  return { missingFields, isComplete: missingFields.length === 0 };
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

const PREFERRED_LANGUAGE_LABELS = new Set([
  'PREFERRED_LANGUAGE_OF_LEARNING',
  'PREFERRED LANGUAGE OF LEARNING',
  'PREFERRED LANGUAGE',
  'MEDIUM',
]);

const LANGUAGE_ALIASES = {
  english: 'English',
  en: 'English',
  hindi: 'Hindi',
  hi: 'Hindi',
  'हिंदी': 'Hindi',
  marathi: 'Marathi',
  ma: 'Marathi',
  mr: 'Marathi',
  'मराठी': 'Marathi',
  bengali: 'Bengali',
  ba: 'Bengali',
  bangla: 'Bengali',
  'বাংলা': 'Bengali',
  telugu: 'Telugu',
  te: 'Telugu',
  kannada: 'Kannada',
  ka: 'Kannada',
  tamil: 'Tamil',
  ta: 'Tamil',
  gujarati: 'Gujarati',
  gu: 'Gujarati',
  urdu: 'Urdu',
  ur: 'Urdu',
  odia: 'Odia',
  or: 'Odia',
  assamese: 'Assamese',
  malayalam: 'Malayalam',
  manipuri: 'Manipuri',
  kashmiri: 'Kashmiri',
  khasi: 'Khasi',
  sanskrit: 'Sanskrit',
  punjabi: 'Punjabi',
};

const isPreferredLanguageField = (field) => {
  const label = field?.label?.toUpperCase() || '';
  if (PREFERRED_LANGUAGE_LABELS.has(label)) return true;
  return (
    (label.includes('PREFERRED') && label.includes('LANGUAGE')) ||
    (label.includes('LANGUAGE') && label.includes('LEARNING'))
  );
};

const getCustomFieldValue = (field) => {
  let raw = field?.value ?? field?.selectedValues?.[0];
  if (raw && typeof raw === 'object') {
    raw = raw.value || raw.label || null;
  }
  return typeof raw === 'string' ? raw.trim() : null;
};

const toFilterLanguageName = (value) => {
  if (!value) return null;
  return LANGUAGE_ALIASES[value.toLowerCase()] || LANGUAGE_ALIASES[value] || value;
};

const readPreferredLanguage = async () => {
  try {
    const profileDataRaw = await getDataFromStorage('profileData');
    const cohortDataRaw = await getDataFromStorage('cohortData');
    const fieldGroups = [
      profileDataRaw
        ? JSON.parse(profileDataRaw)?.getUserDetails?.[0]?.customFields
        : null,
      cohortDataRaw ? JSON.parse(cohortDataRaw)?.customField : null,
    ];

    for (const customFields of fieldGroups) {
      if (!customFields?.length) continue;

      for (const field of customFields) {
        if (!isPreferredLanguageField(field)) continue;
        const language = toFilterLanguageName(getCustomFieldValue(field));
        if (language) return language;
      }
    }
  } catch (error) {
    console.error('Error reading preferred learning language:', error);
  }

  return null;
};

export const getPreferredContentLanguageSelection = async (staticFormFields) => {
  if (!staticFormFields?.length) return null;

  const languageField = staticFormFields.find(
    (field) =>
      field?.name === 'Content Language' || field?.name === 'Language'
  );
  if (!languageField?.range?.length) return null;

  const preferredLang = await readPreferredLanguage();
  if (!preferredLang) return null;

  const matchedOption = languageField.range.find(
    (option) => option?.toLowerCase() === preferredLang.toLowerCase()
  );
  if (!matchedOption) return null;

  return { code: languageField.code, values: [matchedOption] };
};
