// LanguageContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

import { getTitleFromValue } from '@context/Languages';

//for rtl
import { I18nManager, Alert } from 'react-native';
import RNRestart from 'react-native-restart'; // Install this library: https://github.com/avishayil/react-native-restart

//context
import { useConfirmation } from '@context/Confirmation/ConfirmationContext';

// Import your translations
import en from './locales/en.json'; // English
import hi from './locales/hi.json'; // Hindi
import ma from './locales/ma.json'; // Marathi
import ba from './locales/ba.json'; // Bangla
import te from './locales/te.json'; // Telugu
import ka from './locales/ka.json'; // Kannada
import ta from './locales/ta.json'; // Tamil
import gu from './locales/gu.json'; // Gujarati
import ur from './locales/ur.json'; // Urdu

const translations = {
  en,
  hi,
  ma,
  ba,
  te,
  ka,
  ta,
  gu,
  ur,
};
const rtlLanguages = ['ur']; // List of RTL languages

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { showConfirmation } = useConfirmation();

  const [language, setLanguage] = useState('en'); // Default language

  //for rtl
  const [isRTL, setIsRTL] = useState(false);

  // Load saved language preference from AsyncStorage on app start
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        if (savedLanguage && translations[savedLanguage]) {
          setLanguage(savedLanguage);
          const rtl = rtlLanguages.includes(savedLanguage);
          setIsRTL(rtl);
          if (rtl !== I18nManager.isRTL) {
            I18nManager.forceRTL(isRTL);
          } else if (rtl == false) {
            I18nManager.forceRTL(isRTL);
          }
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };

    loadLanguage();
  }, []);

  const toggleRTLRestart = (isRTL) => {
    I18nManager.forceRTL(isRTL);
    RNRestart.Restart(); // This will restart the app
  };
  const toggleRTL = (isRTL) => {
    I18nManager.forceRTL(isRTL);
  };

  const handleLanguageChange = async (newLanguage) => {
    try {
      if (translations[newLanguage]) {
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        const savedTitle = getTitleFromValue(savedLanguage);
        const newTitle = getTitleFromValue(newLanguage);
        const savedFound = rtlLanguages.includes(savedLanguage);
        const newFound = rtlLanguages.includes(newLanguage);

        if (savedFound || newFound) {
          showConfirmation(
            `Are you sure you want to switch from ${t(savedTitle)} to ${t(
              newTitle
            )}? The app will restart.`,
            async () => {
              await AsyncStorage.setItem('appLanguage', newLanguage);
              setLanguage(newLanguage);
              //for rtl
              const rtl = rtlLanguages.includes(newLanguage);
              setIsRTL(rtl);
              if (rtl !== I18nManager.isRTL) {
                toggleRTLRestart(rtl);
              } else if (rtl == false) {
                toggleRTLRestart(rtl);
              }
            },
            t('yes'),
            t('no')
          );
        } else {
          await AsyncStorage.setItem('appLanguage', newLanguage);
          setLanguage(newLanguage);
          //for rtl
          const rtl = rtlLanguages.includes(newLanguage);
          setIsRTL(rtl);
          if (rtl !== I18nManager.isRTL) {
            toggleRTL(rtl);
          } else if (rtl == false) {
            toggleRTL(rtl);
          }
        }
      }
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const t = (key) => translations[language][key] || key;

  const value = useMemo(
    () => ({ language, setLanguage: handleLanguageChange, t, rtlLanguages }),
    [language, rtlLanguages]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.any,
};

export const useTranslation = () => useContext(LanguageContext);
