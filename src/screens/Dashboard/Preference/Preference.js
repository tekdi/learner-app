import React from 'react';
import { SafeAreaView,  } from 'react-native';
import Header from '../../../components/Layout/Header';
import PreferenceHeader from './PreferenceHeader';
import PreferenceForm from './PreferenceForm';

const Preference = () => {

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


export default Preference;
