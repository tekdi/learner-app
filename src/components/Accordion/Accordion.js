import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import globalStyles from '../../utils/Helper/Style';
import { useTranslation } from '../../context/LanguageContext';
import {
  EventDetails,
  getDoits,
  SolutionEvent,
  SolutionEventDetails,
  targetedSolutions,
} from '../../utils/API/AuthService';
import {
  extractLearningResources,
  getDataFromStorage,
  separatePrerequisiteAndPostrequisite,
  setDataInStorage,
} from '../../utils/JsHelper/Helper';
import ContentCard from '../../screens/Dashboard/ContentCard';
import { courseTrackingStatus } from '../../utils/API/ApiCalls';

import GlobalText from '@components/GlobalText/GlobalText';
import ActiveLoading from '../../screens/LoadingScreen/ActiveLoading';

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

const Accordion = ({ item, postrequisites, title, setTrack, topic }) => {
  const [isAccordionOpen, setAccordionOpen] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [trackData, setTrackData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

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
    const payload = {
      request: {
        filters: {
          identifier: contentList,
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
    setLoading(true);
    let result;
    const subjectName = item?.metadata?.subject || '';
    const type = item?.metadata?.courseType || '';
    const data = await targetedSolutions({ subjectName, type });

    const id = data?.data?.[0]?._id;
    const solutionId = data?.data?.[0]?.solutionId;

    if (id == '') {
      callProgramIfempty({ solutionId, id });
    } else {
      result = await EventDetails({ id });
      const filterData = getFilteredData(result?.tasks || []);
      let userId = await getDataFromStorage('userId');
      let course_track_data;
      if (postrequisites) {
        course_track_data = await courseTrackingStatus(
          userId,
          filterData?.[0]?.contentIdList
        );
      } else {
        course_track_data = await courseTrackingStatus(
          userId,
          filterData?.[0]?.prerequisites
        );
      }

      let courseTrackData = [];
      if (course_track_data?.data) {
        courseTrackData =
          course_track_data?.data?.find((course) => course.userId === userId)
            ?.course || [];
      }

      setTrackData(courseTrackData || []);
      setTrack(courseTrackData || []);

      if (filterData) {
        const result = await getDoidsDetails(filterData?.[0]?.contentIdList);

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

        setResourceData({ prerequisites, postrequisites });
      }
      setLoading(false);

      // if (!postrequisites) {
      //   setDataInStorage(
      //     'courseTrackData',
      //     JSON.stringify(courseTrackData || {})
      //   );
      // }
    }
  };

  // console.log('courseTrackData', JSON.stringify(trackData));
  // console.log('postrequisites', JSON.stringify(resourceData));

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View
      style={{
        backgroundColor: '#F7ECDF',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
      }}
    >
      <TouchableOpacity
        style={[
          globalStyles.flexrow,
          {
            justifyContent: 'space-between',
            padding: 10,
            borderBottomWidth: 1,
            borderColor: '#D0C5B4',
          },
        ]}
        onPress={() => setAccordionOpen(!isAccordionOpen)}
      >
        {title ? (
          <GlobalText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[globalStyles.text]}
          >
            {t(title)}
          </GlobalText>
        ) : (
          <GlobalText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[globalStyles.text]}
          >
            {item?.metadata?.subject || ''}
            {/* {item?.shortDescription && `- ${item?.shortDescription}`} */}
          </GlobalText>
        )}
        <Icon
          name={isAccordionOpen ? 'angle-up' : 'angle-down'}
          color="#0D599E"
          size={20}
        />
      </TouchableOpacity>

      {isAccordionOpen && (
        <View style={styles.accordionDetails}>
          {loading ? (
            <ActiveLoading />
          ) : (
            <ScrollView>
              {resourceData ? (
                <View
                  style={{
                    width: '100%',
                  }}
                >
                  {!postrequisites ? (
                    <View
                      style={{
                        padding: 10,
                        // backgroundColor: '#F7ECDF',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                      }}
                    >
                      {resourceData?.prerequisites?.map((data, index) => {
                        return (
                          <ContentCard
                            key={index}
                            item={data}
                            index={index}
                            course_id={data?.identifier}
                            unit_id={data?.identifier}
                            TrackData={trackData}
                          />
                        );
                      })}
                    </View>
                  ) : (
                    <View
                      style={{
                        // backgroundColor: '#F7ECDF',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        paddingBottom: 50,
                      }}
                    >
                      {resourceData?.postrequisites?.map((data, index) => {
                        return (
                          <ContentCard
                            key={index}
                            item={data}
                            index={index}
                            course_id={data?.identifier}
                            unit_id={data?.identifier}
                            TrackData={trackData}
                          />
                        );
                      })}
                    </View>
                  )}
                </View>
              ) : (
                <GlobalText style={[globalStyles.text, { marginLeft: 10 }]}>
                  {t('no_topics')}
                </GlobalText>
              )}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },

  accordionContent: {
    paddingVertical: 10,
    // borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#D0C5B4',
  },
  accordionDetails: {
    fontSize: 14,
    color: '#7C766F',
  },
});

Accordion.propTypes = {};

export default Accordion;
