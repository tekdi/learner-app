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

//for rtl
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart'; // Install this library: https://github.com/avishayil/react-native-restart

// Import your translations
import en from './locales/en.json'; // English
import hi from './locales/hi.json'; // Hindi
import ma from './locales/ma.json'; // Marathi
import ba from './locales/ba.json'; // Bangla
import te from './locales/te.json'; // Telugu
import ka from './locales/ka.json'; // Kannada
import gu from './locales/gu.json'; // Gujarati
import ur from './locales/ur.json'; // Urdu

const translations = {
  en,
  hi,
  ma,
  ba,
  te,
  ka,
  gu,
  // Add more languages as needed
  ur,
};
const rtlLanguages = ['ur']; // List of RTL languages

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
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

  const toggleRTL = (isRTL) => {
    I18nManager.forceRTL(isRTL);
    RNRestart.Restart(); // This will restart the app
  };

  const handleLanguageChange = async (newLanguage) => {
    try {
      if (translations[newLanguage]) {
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
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const t = (key) => translations[language][key] || key;

  const value = useMemo(
    () => ({ language, setLanguage: handleLanguageChange, t }),
    [language]
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
