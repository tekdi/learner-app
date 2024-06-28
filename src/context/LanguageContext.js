// LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Import your translations
import en from './locales/en.json'; //english
import hi from './locales/hi.json'; //hindi
import ma from './locales/ma.json'; //marathi
import ba from './locales/ba.json'; //bangla
import te from './locales/te.json'; //telugu
import ka from './locales/ka.json'; //kannada
import gu from './locales/gu.json'; //gujarati

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

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleLanguageChange, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
