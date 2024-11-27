import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SecondaryHeader from '../../../../../components/Layout/SecondaryHeader';
import ContentAccordion from './ContentAccordion';
import { getDoits } from '../../../../../utils/API/AuthService';
import { getDataFromStorage } from '../../../../../utils/JsHelper/Helper';
import { courseTrackingStatus } from '../../../../../utils/API/ApiCalls';

const LearningResources = ({ route }) => {
  const { resources } = route.params;
  const [resourceData, setResourceData] = useState([]);
  const [trackData, setTrackData] = useState([]);

  function separatePrerequisitesAndPostrequisites(data) {
    let prerequisites = [];
    let postrequisites = [];
    let contentList = [];

    data.forEach((item) => {
      console.log('item', JSON.stringify(item));
      if (item.type === 'prerequisite') {
        prerequisites.push(item?.id);
        contentList.push(item?.id);
      } else if (item.type === 'postrequisite') {
        postrequisites.push(item?.id);
        contentList.push(item?.id);
      }
    });

    // console.log('sdsads', { prerequisites, postrequisites, contentList });

    return { prerequisites, postrequisites, contentList };
  }

  const getDoitsDetails = async (contentList) => {
    // console.log({ contentList });

    const payload = {
      request: {
        filters: {
          identifier: contentList,
          // identifier: ['do_2141915232762675201250'],
        },
        fields: [
          'name',
          'appIcon',
          'description',
          'posterImage',
          'mimeType',
          'identifier',
          'resourceType',
          'primaryCategory',
          'contentType',
          'trackable',
          'children',
          'leafNodes',
        ],
      },
    };
    const result = await getDoits({ payload });
    return result?.content;
  };

  const trackingData = async (data) => {
    let contentIdList = data?.contentList;
    let userId = await getDataFromStorage('userId');
    let course_track_data = await courseTrackingStatus(userId, contentIdList);
    let courseTrackData = [];
    if (course_track_data?.data) {
      courseTrackData =
        course_track_data?.data?.find((course) => course.userId === userId)
          ?.course || [];
    }
    // console.log({ courseTrackData });

    setTrackData(courseTrackData || []);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = separatePrerequisitesAndPostrequisites(resources);
      // console.log({ data });
      await trackingData(data);
      const result = await getDoitsDetails(data?.contentList);
      const prerequisites = result.filter((item) =>
        data?.prerequisites.includes(item.identifier)
      );
      const postrequisites = result.filter((item) =>
        data?.postrequisites.includes(item.identifier)
      );

      setResourceData({ prerequisites, postrequisites });
    };
    fetchData();
  }, []);

  return (
    <>
      <SecondaryHeader />
      <ContentAccordion
        trackData={trackData}
        resourceData={resourceData}
        title={'pre_requisites_2'}
      />
      <ContentAccordion
        trackData={trackData}
        resourceData={resourceData}
        title={'post_requisites_2'}
      />
    </>
  );
};

LearningResources.propTypes = {};

export default LearningResources;
