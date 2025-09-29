import React from 'react';
import SafeAreaWrapper from '../../../components/SafeAreaWrapper/SafeAreaWrapper';
import Header from '../../../components/Layout/Header';
import PreferenceHeader from './PreferenceHeader';
import PreferenceForm from './PreferenceForm';

const Preference = () => {
  return (
    <>
      <Header />
      <SafeAreaWrapper style={{ top: 10 }}>
        <PreferenceHeader />
        <PreferenceForm />
      </SafeAreaWrapper>
    </>
  );
};

export default Preference;
