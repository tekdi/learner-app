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

// Import your translations
import en from './locales/en.json'; // English
import hi from './locales/hi.json'; // Hindi
import ma from './locales/ma.json'; // Marathi
import ba from './locales/ba.json'; // Bangla
import te from './locales/te.json'; // Telugu
import ka from './locales/ka.json'; // Kannada
import gu from './locales/gu.json'; // Gujarati

const translations = {
  en,
  hi,
  ma,
  ba,
  te,
  ka,
  gu,
  // Add more languages as needed
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default language

  // Load saved language preference from AsyncStorage on app start
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        if (savedLanguage && translations[savedLanguage]) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };

    loadLanguage();
  }, []);

  const handleLanguageChange = async (newLanguage) => {
    try {
      if (translations[newLanguage]) {
        await AsyncStorage.setItem('appLanguage', newLanguage);
        setLanguage(newLanguage);
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
