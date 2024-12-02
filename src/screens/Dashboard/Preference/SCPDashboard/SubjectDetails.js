import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SecondaryHeader from '../../../../components/Layout/SecondaryHeader';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import globalStyles from '../../../../utils/Helper/Style';
import { default as Octicons } from 'react-native-vector-icons/Octicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Accordion from '../../../../components/Accordion/Accordion';

import GlobalText from '@components/GlobalText/GlobalText';
import {
  getDataFromStorage,
  setDataInStorage,
} from '../../../../utils/JsHelper/Helper';
import { courseTrackingStatus } from '../../../../utils/API/ApiCalls';
import {
  EventDetails,
  getDoits,
  SolutionEvent,
  SolutionEventDetails,
  targetedSolutions,
} from '../../../../utils/API/AuthService';
import ContentAccordion from './MyClass/ContentAccordion';

function getFilteredData(data) {
  return data
    .map((item) => {
      const prerequisites = [];
      const postrequisites = [];

      item?.children?.forEach((child) => {
        const learningResources = child?.learningResources || [];

        prerequisites.push(
          ...learningResources
            .filter((resource) => resource.type === 'prerequisite')
            .map((resource) => resource?.id?.toLowerCase())
        );

        postrequisites.push(
          ...learningResources
            .filter((resource) => resource.type === 'postrequisite')
            .map((resource) => resource?.id?.toLowerCase())
        );
      });

      return {
        // name: item.name,
        prerequisites: prerequisites,
        postrequisites: postrequisites,
        contentIdList: [...prerequisites, ...postrequisites],
      };

      // Return null if the item name doesn't match the topic
      return null;
    })
    .filter((result) => result !== null); // Filter out null values
}

const SubjectDetails = ({ route }) => {
  const { topic, subTopic, courseType, item } = route.params;
  const navigation = useNavigation();
  const [trackData, setTrackData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [track, setTrack] = useState();
  const [resourceData, setResourceData] = useState();

  // console.log({ item });

  const callProgramIfempty = async ({ solutionId, id }) => {
    const data = await SolutionEvent({ solutionId });
    const templateId = data?.externalId;
    const result = await SolutionEventDetails({ templateId, solutionId });
    if (!id) {
      fetchData();
    } else {
      console.log('error_API_Success');
    }
  };

  const getDoidsDetails = async (contentList) => {
    // console.log('#####');
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
    return result;
  };

  const fetchData = async () => {
    let result;
    const subjectName = item?.metadata?.subject || '';
    const type = item?.metadata?.courseType || '';
    const data = await targetedSolutions({ subjectName, type });

    const id = data?.data?.[0]?._id;
    const solutionId = data?.data?.[0]?.solutionId;
    // console.log({ data, id });

    if (id == '') {
      callProgramIfempty({ solutionId, id });
    } else {
      result = await EventDetails({ id });
      // console.log('result', JSON.stringify(result));

      const filterData = getFilteredData(result?.tasks || []);
      // setTasks(filterData);

      let userId = await getDataFromStorage('userId');
      let course_track_data = await courseTrackingStatus(
        userId,
        filterData?.[0]?.contentIdList
      );

      let courseTrackData = [];
      if (course_track_data?.data) {
        courseTrackData =
          course_track_data?.data?.find((course) => course.userId === userId)
            ?.course || [];
      }
      // console.log('sssss', JSON.stringify(course_track_data));

      setTrackData(courseTrackData || []);
      setTrack(courseTrackData || []);

      // console.log('filterData', JSON.stringify(filterData?.[0].prerequisites));
      // console.log(
      //   'postrequisites',
      //   JSON.stringify(filterData?.[0].postrequisites)
      // );

      if (filterData) {
        const result = await getDoidsDetails(filterData?.[0]?.contentIdList);
        console.log('result', JSON.stringify(result?.content));
        console.log(
          'filterData?.[0]?.prerequisites',
          JSON.stringify(filterData?.[0]?.prerequisites)
        );

        // Initialize arrays for prerequisites and postrequisites
        const prerequisites = [];
        const postrequisites = [];

        // Filter prerequisites
        result?.content?.forEach((item) => {
          if (
            filterData?.[0]?.prerequisites?.includes(
              item?.identifier?.toLowerCase()
            )
          ) {
            prerequisites.push(item); // Push filtered items
          }
          if (
            filterData?.[0]?.postrequisites?.includes(
              item?.identifier?.toLowerCase()
            )
          ) {
            postrequisites.push(item); // Push filtered items
          }
        });

        // Filter postrequisites
        result?.QuestionSet?.forEach((item) => {
          if (
            filterData?.[0]?.prerequisites?.includes(
              item?.identifier?.toLowerCase()
            )
          ) {
            prerequisites.push(item); // Push filtered items
          }
          if (
            filterData?.[0]?.postrequisites?.includes(
              item?.identifier?.toLowerCase()
            )
          ) {
            postrequisites.push(item); // Push filtered items
          }
        });

        console.log(
          '{ prerequisites, postrequisites }',
          JSON.stringify({ prerequisites })
        );

        setResourceData({ prerequisites, postrequisites });
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <SecondaryHeader logo />
      <View style={styles.leftContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Octicons
            name="arrow-left"
            style={{ marginRight: 20 }}
            color={'#000'}
            size={30}
          />
        </TouchableOpacity>
        <GlobalText style={[globalStyles.heading2]}>{topic}</GlobalText>
      </View>
      <View style={{ left: 50 }}>
        {subTopic?.map((item, key) => {
          return (
            <GlobalText key={key} style={styles.accordionDetails}>
              {item}
            </GlobalText>
          );
        })}
      </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    left: 20,
  },
  img: {
    width: 50,
    height: 50,
  },
  accordionDetails: {
    color: '#0D599E',
    marginLeft: 10,
  },
});

SubjectDetails.propTypes = {};

export default SubjectDetails;
