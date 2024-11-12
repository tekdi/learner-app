import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SecondaryHeader from '../../../../../components/Layout/SecondaryHeader';
import ContentAccordion from './ContentAccordion';

const LearningResources = ({ route }) => {
  const { resources } = route.params;
  const [resourceData, setResourceData] = useState([]);

  function separatePrerequisitesAndPostrequisites(data) {
    let prerequisites = [];
    let postrequisites = [];

    data.forEach((item) => {
      if (item.type === 'prerequisite') {
        prerequisites.push(item);
      } else if (item.type === 'postrequisite') {
        postrequisites.push(item);
      }
    });

    return { prerequisites, postrequisites };
  }

  useEffect(() => {
    const data = separatePrerequisitesAndPostrequisites(resources);
    setResourceData(data);
  }, []);

  console.log(JSON.stringify(resourceData));

  return (
    <>
      <SecondaryHeader />
      <ContentAccordion
        resourceData={resourceData}
        title={'pre_requisites_2'}
      />
      <ContentAccordion
        resourceData={resourceData}
        title={'post_requisites_2'}
      />
    </>
  );
};

LearningResources.propTypes = {};

export default LearningResources;
