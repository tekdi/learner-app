import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SecondaryHeader from '../../../../../components/Layout/SecondaryHeader';
import ContentAccordion from './ContentAccordion';
import { getDoits } from '../../../../../utils/API/AuthService';
import { getDataFromStorage } from '../../../../../utils/JsHelper/Helper';
import { courseTrackingStatus } from '../../../../../utils/API/ApiCalls';
import { ScrollView } from 'react-native';

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
    console.log({ contentList });

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
    return result;
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
      try {
        // Separate prerequisites and postrequisites from resources
        const data = separatePrerequisitesAndPostrequisites(resources);
        console.log({ data });

        // Track the data
        await trackingData(data);

        // Fetch details based on contentList
        const result = await getDoitsDetails(data?.contentList);
        console.log('result', JSON.stringify(result));

        // Initialize arrays for prerequisites and postrequisites
        const prerequisites = [];
        const postrequisites = [];

        // Filter prerequisites
        result?.content?.forEach((item) => {
          if (data?.prerequisites.includes(item.identifier)) {
            prerequisites.push(item); // Push filtered items
          }
          if (data?.postrequisites.includes(item.identifier)) {
            postrequisites.push(item); // Push filtered items
          }
        });

        // Filter postrequisites
        result?.QuestionSet?.forEach((item) => {
          if (data?.prerequisites.includes(item.identifier)) {
            prerequisites.push(item); // Push filtered items
          }
          if (data?.postrequisites.includes(item.identifier)) {
            postrequisites.push(item); // Push filtered items
          }
        });

        // Update state with filtered data
        setResourceData({ prerequisites, postrequisites });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [resources]); // Add dependencies if necessary

  console.log(JSON.stringify(resourceData));

  return (
    <>
      <SecondaryHeader />
      <ScrollView>
        <ContentAccordion
          trackData={trackData}
          resourceData={resourceData}
          title={'pre_requisites_2'}
          openDropDown={true}
        />
        <ContentAccordion
          trackData={trackData}
          resourceData={resourceData}
          title={'post_requisites_2'}
        />
      </ScrollView>
    </>
  );
};

LearningResources.propTypes = {};

export default LearningResources;
