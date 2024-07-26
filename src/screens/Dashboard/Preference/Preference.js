import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StyleSheet } from 'react-native';
import Header from '../../../components/Layout/Header';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../../context/LanguageContext';
import PreferenceHeader from './PreferenceHeader';
import PreferenceForm from './PreferenceForm';

const Preference = (props) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <SafeAreaView style={{ top: 50 }}>
        <PreferenceHeader />
        <PreferenceForm />
      </SafeAreaView>
    </>
  );
};

Preference.propTypes = {};

export default Preference;
