import React from 'react';
import PropTypes from 'prop-types';
import SecondaryHeader from '../../../../../components/Layout/SecondaryHeader';
import ContentAccordion from './ContentAccordion';

const LearningResources = ({ route }) => {
  const { resources } = route.params;
  console.log({ resources });

  return (
    <>
      <SecondaryHeader />
      {resources?.map(() => {
        return <ContentAccordion title={'pre_requisites_2'} />;
      })}
      {resources?.map(() => {
        return <ContentAccordion title={'post_requisites_2'} />;
      })}
    </>
  );
};

LearningResources.propTypes = {};

export default LearningResources;
